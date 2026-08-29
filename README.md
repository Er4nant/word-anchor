# WordAnchor

A browser extension that makes webpages easier to read by bolding the start of each word, giving your eyes a fixed anchor point so your brain can move through text faster.

Built for readers with dyslexia, ADHD, or general reading fatigue, though plenty of people just find it makes long articles easier to get through.

No data collection, no accounts, no tracking. Everything runs locally in your browser.

[![Support me on Ko-fi](https://img.shields.io/badge/Support-Ko--fi-ff5e5b?logo=ko-fi&logoColor=white)](https://ko-fi.com/er4nant)

## Install

Not on the Chrome Web Store or Firefox Add-ons yet. For now, load it manually:

**Chrome / Edge (Chromium)**
1. Clone or download this repo
2. Go to `chrome://extensions`
3. Enable Developer mode (top right)
4. Click "Load unpacked" and select this folder

**Firefox**
1. Clone or download this repo
2. Go to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on" and select `manifest.json`

## Features

- One-click toggle, on/off per page
- Adjustable bold length (1-4 letters) and bold weight (light to heavy)
- Light and dark popup themes
- Works on dynamic pages: Twitter/X, Gmail, Reddit, anything that loads content as you scroll
- No data collection, see [PRIVACY_POLICY.md](./PRIVACY_POLICY.md)

## How it works

`content.js` walks the visible text nodes on a page, splits each word, and bolds the first N letters using CSS `font-weight` inside a wrapping span. A `MutationObserver` reapplies this to content added dynamically after the initial page load. Settings are stored via `chrome.storage.sync`, so they follow you across synced browser instances.

## Status

Functional, in final testing before store submission.

## License

MIT, see [LICENSE](./LICENSE)

## Author

[Er4nant](https://github.com/Er4nant)

## Development

Built with the help of AI tools (Claude) for code, debugging, and documentation. All code has been reviewed and tested before release.
