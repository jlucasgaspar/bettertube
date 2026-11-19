# BetterTube Privacy Policy

_Last updated: 2026-11-19_

BetterTube is a Chrome extension that changes how youtube.com looks and behaves on desktop. It has no backend, no accounts and no analytics.

## What BetterTube collects

Nothing. BetterTube does not collect, transmit, sell or share personal data. The extension makes no network requests to any server operated by its developer, because there is none.

## What BetterTube stores

Everything BetterTube remembers stays in your browser, using Chrome's extension storage:

- **Settings** (which features are on, language, theme), in `chrome.storage.sync`. If you are signed in to Chrome with sync enabled, Chrome itself may sync these between your devices. That sync is handled by Chrome and Google, not by BetterTube.
- **Saved videos and saved channels** (id, title, channel name, thumbnail or avatar URL, date saved), in `chrome.storage.local`. They never leave your device.
- **An "ads handled" counter**, in local storage.

You can delete all of this by removing the saved items in the options page, or by uninstalling the extension.

## Permissions and why they are needed

- **Access to youtube.com pages.** Content scripts run only on `*.youtube.com` to add the Save buttons, build the custom home page, hide Shorts and recommendations, and handle ads. BetterTube reads page content (video titles, thumbnails, channel names) only to show it back to you in your own saved lists.
- **`storage`.** To keep your settings and saved items.
- **`declarativeNetRequest`.** To block known ad requests when you turn that option on. Rules are static and run inside the browser. BetterTube does not see the requests it blocks.

## Watch Later

If you enable the Watch Later section, BetterTube requests your Watch Later playlist from youtube.com using your existing YouTube session, from the page you are already on. The result is shown on screen and is not stored or sent anywhere else.

## Remote code

BetterTube does not load or run remote code. All code ships inside the extension package.

## Children

BetterTube does not knowingly collect any data from anyone, including children.

## Changes

If this policy changes, the new version will be published in the extension repository with an updated date.

## Contact

Open an issue at <https://github.com/jlucasgaspar/bettertube/issues>.
