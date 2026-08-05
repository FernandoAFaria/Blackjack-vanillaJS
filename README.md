# Twenty One

Twenty One is a dependency-light, single-player Blackjack practice game built with vanilla JavaScript. It runs entirely in the browser: there are no accounts, payments, backend services, or real-money features.

## Gameplay

Set a practice wager of at least $5, then deal. Use **Hit** to take a card, **Stand** to let the dealer play, or **Double** to double the wager, take exactly one card, and stand. Double is available only on the first two cards when the bankroll covers the additional wager. The dealer reveals the hole card and draws until reaching 17 or higher, including standing on soft 17. Aces count as 11 unless counting them as 1 prevents a bust. Blackjack pays 3:2; ordinary wins pay 1:1; pushes return the wager.

Keyboard controls are `H` for hit, `S` for stand, `D` for double, and `N` for the next round. All controls are standard focusable buttons and game messages are announced by screen readers.

## Local development

Requires Node.js and npm. Dependencies are already represented by `package-lock.json`.

```sh
npm install
npm run dev
```

The local, dependency-free build script watches the source and writes `dist/bundle.js`. Serve the static output with any local file server, for example `npx serve dist` when that utility is already available, then open its local URL. Opening `dist/index.html` directly also works in modern browsers.

## Verification

```sh
npm test
npm run build
```

The tests cover ace valuation, blackjack and bust detection, deck uniqueness, action state guards, and double-down eligibility. The production command creates the minified browser bundle in `dist/`.

## Deploy to Vercel

This is a static site. Import the repository into Vercel and configure:

- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

Or, with the Vercel CLI already installed and authenticated, run `vercel` from the repository root and use the same build/output settings. No environment variables are required.
