# WordAnchor

A browser extension that makes webpages easier to read by bolding the start of each word, giving your eyes a fixed anchor point so your brain can move through text faster.

Built for readers with dyslexia, ADHD, or general reading fatigue, though plenty of people just find it makes long articles easier to get through.

No data collection, no accounts, no tracking. Everything runs locally in your browser.

[![Support me on Ko-fi](https://img.shields.io/badge/Support-Ko--fi-ff5e5b?logo=ko-fi&logoColor=white)](https://ko-fi.com/er4nant)

## Install

Submitted to both stores, pending review:
- Chrome Web Store: link coming once approved
- Firefox Add-ons (AMO): link coming once approved

Until then, or if you want the latest dev build, load it manually:

**Chrome / Edge (Chromium)**
1. Clone or download this repo
2. Go to `chrome://extensions`
3. Enable Developer mode (top right)
4. Click "Load unpacked" and select the `word-anchor/` folder (or run `./build.sh` and use `dist/chrome/`)

**Firefox**
1. Clone or download this repo
2. Run `./build.sh` (Firefox needs its own manifest, `dist/firefox/manifest.json`)
3. Go to `about:debugging#/runtime/this-firefox`
4. Click "Load Temporary Add-on" and select `dist/firefox/manifest.json`

## Features

- One-click toggle, on/off per page
- Adjustable bold length (1-4 letters) and bold weight (light to heavy)
- Light and dark popup themes
- Works on dynamic pages: Twitter/X, Gmail, Reddit, anything that loads content as you scroll
- No data collection, see [PRIVACY_POLICY.md](./PRIVACY_POLICY.md)

## How it works

`content.js` walks the visible text nodes on a page, splits each word, and bolds the first N letters. Font weight is kept fixed at 700 since most fonts only ship regular/bold files, extra "thickness" (Light/Medium/Bold/Heavy) is achieved with a layered `text-shadow` stroke so the effect is visible on real page fonts, not just fonts with full weight ranges. A `MutationObserver` reapplies this to content added dynamically after the initial page load. Settings are stored via `chrome.storage.sync`, so they follow you across synced browser instances.

Chrome and Firefox need slightly different manifest keys for the background script (`service_worker` vs `scripts`), so `manifest.json` and `manifest.firefox.json` are kept separate and `build.sh` packages both into store-ready zips under `dist/`.

## Status

Submitted to the Chrome Web Store and Firefox Add-ons (AMO), pending review.

## License

MIT, see [LICENSE](./LICENSE)

## Author

[Er4nant](https://github.com/Er4nant)

## Development

Built with the help of AI tools (Claude) for code, debugging, and documentation. All code has been reviewed and tested before release.
