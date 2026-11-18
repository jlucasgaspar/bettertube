# BetterTube

> A Chrome extension for an enhanced YouTube experience on desktop.

BetterTube lets you take control of YouTube: build your own home page, cut out the noise, and make the site look and behave the way you want.

> **Status:** early development. Nothing is released yet. See [specs.md](specs.md) for the roadmap.

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

Setup is coming with the first milestone. Once available:

```sh
pnpm install
pnpm dev
```

Then load the generated build as an unpacked extension at `chrome://extensions`.

## Contributing

The project is developed milestone by milestone, tracked in [specs.md](specs.md). Contributions and ideas are welcome once the foundation is in place. Please read [AGENTS.md](AGENTS.md) for the conventions used in this repository.

## Disclaimer

BetterTube is an independent project and is not affiliated with, endorsed by, or sponsored by YouTube or Google. YouTube is a trademark of Google LLC.

## License

[MIT](LICENSE)
