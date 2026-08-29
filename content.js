// content.js: bolds the start of each word to help guide the eyes

let settings = {
  enabled: false,
  letterCount: 2,
  boldWeight: 800,
};

const SKIP_TAGS = new Set([
  "SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT",
  "CODE", "PRE", "SELECT", "OPTION", "BUTTON", "LABEL"
]);

function makeBionicWord(word, letterCount, boldWeight) {
  if (word.trim() === "") return word;
  const count = Math.min(letterCount, word.length);
  const bold = word.slice(0, count);
  const rest = word.slice(count);

  const wrapper = document.createElement("span");
  wrapper.setAttribute("data-bionic", "1");

  const boldSpan = document.createElement("span");
  boldSpan.style.fontWeight = boldWeight;
  boldSpan.textContent = bold;

  const restSpan = document.createElement("span");
  restSpan.style.fontWeight = "400";
  restSpan.textContent = rest;

  wrapper.appendChild(boldSpan);
  wrapper.appendChild(restSpan);
  return wrapper;
}

// WeakSet, not a DOM attribute. A parent can have several sibling text
// nodes (e.g. "Hi <b>x</b> there"), so flagging the parent as processed
// after the first one broke the rest.
const processedNodes = new WeakSet();

function applyBionicToNode(textNode) {
  const parent = textNode.parentNode;
  if (!parent || SKIP_TAGS.has(parent.tagName)) return;
  if (processedNodes.has(textNode)) return;

  const text = textNode.textContent;
  if (!text.trim()) return;

  const parts = text.split(/(\s+)/);
  const fragment = document.createDocumentFragment();

  parts.forEach(part => {
    if (/^\s+$/.test(part)) {
      fragment.appendChild(document.createTextNode(part));
    } else {
      const bionicWord = makeBionicWord(part, settings.letterCount, settings.boldWeight);
      if (typeof bionicWord === "string") {
        fragment.appendChild(document.createTextNode(bionicWord));
      } else {
        fragment.appendChild(bionicWord);
      }
    }
  });

  parent.setAttribute("data-bionic-processed", "1");
  parent.replaceChild(fragment, textNode);
  processedNodes.add(textNode);
}

function getTextNodes(root) {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentNode;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (parent.getAttribute("data-bionic")) return NodeFilter.FILTER_REJECT;
        if (processedNodes.has(node)) return NodeFilter.FILTER_REJECT;
        if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const nodes = [];
  let node;
  while ((node = walker.nextNode())) nodes.push(node);
  return nodes;
}

function applyBionic() {
  getTextNodes(document.body).forEach(applyBionicToNode);
}

function revertBionic() {
  document.querySelectorAll("[data-bionic-processed]").forEach(el => {
    const text = el.textContent;
    if (el.querySelectorAll("[data-bionic]").length > 0) {
      const textNode = document.createTextNode(text);
      while (el.firstChild) el.removeChild(el.firstChild);
      el.appendChild(textNode);
    }
    el.removeAttribute("data-bionic-processed");
  });
}

function updateBoldWeight(weight) {
  document.querySelectorAll("[data-bionic='1'] span:first-child").forEach(span => {
    span.style.fontWeight = weight;
  });
}

let observer = null;

function startObserver() {
  if (observer) return;
  observer = new MutationObserver(mutations => {
    if (!settings.enabled) return;
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          applyBionicToNode(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          getTextNodes(node).forEach(applyBionicToNode);
        }
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function stopObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

chrome.storage.sync.get(["enabled", "letterCount", "boldWeight"], (stored) => {
  settings.enabled = stored.enabled ?? false;
  settings.letterCount = stored.letterCount ?? 2;
  settings.boldWeight = stored.boldWeight ?? 800;

  if (settings.enabled) {
    applyBionic();
    startObserver();
  }
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type !== "UPDATE_SETTINGS") return;

  const prev = { ...settings };
  settings = { ...settings, ...msg.settings };

  if (settings.enabled && !prev.enabled) {
    applyBionic();
    startObserver();
  } else if (!settings.enabled && prev.enabled) {
    stopObserver();
    revertBionic();
  } else if (settings.enabled) {
    if (settings.letterCount !== prev.letterCount) {
      stopObserver();
      revertBionic();
      applyBionic();
      startObserver();
    } else {
      updateBoldWeight(settings.boldWeight);
    }
  }
});
