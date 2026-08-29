# WordAnchor: Privacy Policy

Last updated: August 2026

WordAnchor does not collect, transmit, sell, or share any user data, browsing history, or page content.

## What runs locally on your device

- Reads the text of the page you're viewing, purely in your browser, to bold the start of each word.
- Saves your preferences (enabled/disabled, bold letter count, bold weight, dark mode) via the browser's built-in `storage.sync` API, the same mechanism used to sync bookmarks. This data syncs through your own browser account; we never see it, because there's no server to send it to.

## What it doesn't do

- Doesn't send page content, browsing history, or personal information anywhere.
- No analytics, no tracking pixels, no third-party scripts.
- No account, login, or personal information required.

## Permissions

| Permission | Why |
|---|---|
| `storage` | Save your display preferences |
| `activeTab` | Apply formatting to the page you're viewing |
| `scripting` | Inject the formatting logic into the page |
| `host_permissions: <all_urls>` | Lets the extension run on any site you enable it on. It only activates on tabs where you've turned it on |

## Contact

Open an issue at [github.com/Er4nant/word-anchor/issues](https://github.com/Er4nant/word-anchor/issues)
