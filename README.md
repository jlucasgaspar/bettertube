# BetterTube

> A Chrome extension for an enhanced YouTube experience on desktop.

BetterTube lets you take control of YouTube: build your own home page, cut out the noise, and make the site look and behave the way you want.

> **Status:** not on the Chrome Web Store yet. You can already load it as an unpacked extension (see Getting started). See [specs.md](specs.md) for the roadmap.

## Planned features

- **Your own home page** — replace the default feed with two sections: videos you saved with BetterTube and your YouTube "Watch Later" list.
- **Save button** — a one-click "Save" button next to Like on every video.
- **Block Shorts** — hide Shorts shelves and entries, optionally redirect Shorts links to the regular player.
- **Block recommendations** — hide suggested videos, optionally replacing them with your saved ones.
- **Ad handling** — block ads where possible; otherwise mute and auto-skip.
- **Light and dark theme** — follows your Chrome/OS theme by default.
- **Multilingual** — English, Português, Español, Français, Italiano, Deutsch.
- **Highly customizable** — every feature can be toggled independently.

## Privacy

BetterTube has no backend and no accounts. All settings and saved videos are stored locally in your browser. Nothing is sent anywhere.

## Tech stack

[WXT](https://wxt.dev) (Manifest V3) · React · TypeScript · Tailwind CSS · pnpm · ESLint · Prettier · Vitest · Playwright

## Getting started

```sh
pnpm install
```

### Use it in your own Chrome

You can run BetterTube in your everyday Chrome without the Web Store:

1. `pnpm build`
2. Open `chrome://extensions` and turn on **Developer mode** (top right).
3. Click **Load unpacked** and pick the `.output/chrome-mv3` folder.
4. Pin it from the puzzle-piece menu in the toolbar.

After pulling new changes, run `pnpm build` again, click the reload button on the extension card, and refresh any open YouTube tabs.

### Develop

```sh
pnpm dev
```

This opens a separate Chrome profile with the extension loaded and reloads it on every change. Saved data lives in that temporary profile, not in your regular Chrome.

### Useful commands

| Command         | What it does                                                     |
| --------------- | ---------------------------------------------------------------- |
| `pnpm check`    | Format check, lint, typecheck and unit tests (run before commit) |
| `pnpm build`    | Production build into `.output/chrome-mv3`                       |
| `pnpm budget`   | Check the build against the size budget (run after `pnpm build`) |
| `pnpm test:e2e` | Build and run the Playwright end-to-end tests                    |
| `pnpm zip`      | Package the build as a zip for the Chrome Web Store              |

## Contributing

The project is developed milestone by milestone, tracked in [specs.md](specs.md). Contributions and ideas are welcome once the foundation is in place. Please read [AGENTS.md](AGENTS.md) for the conventions used in this repository.

## Disclaimer

BetterTube is an independent project and is not affiliated with, endorsed by, or sponsored by YouTube or Google. YouTube is a trademark of Google LLC.

## License

[MIT](LICENSE)
