# Development

Astro renders all routes as static HTML. Node 24, npm, TypeScript and SCSS are used. Run `npm install`, then `npm run dev`. For verification run `npm run check` and `npx playwright install chromium && npm run test:browser`. `npm run build` writes `build/`; serve via `npm run preview`. Source files are under `src/`, approved local media under `public/`. The old query-language links redirect to the equivalent locale path and `/privacy.html` is retained as a compatibility redirect.

The default build is a private preview: noindex, no canonical host and empty sitemap. Do not publish until approval, hosting access, asset rights and actual device/accessibility testing are verified. After explicit approval configure the verified HTTPS origin and `ODDMASH_PUBLIC_LAUNCH=true` in the build environment; review the rendered canonical, alternate links, sitemap and privacy notice. No tracking, auth, storage or runtime service is added.

Follow the [organization agreements](https://github.com/Oddmash/.github/blob/main/AGENTS.md) and the shared skills. See [delivery evidence](docs/delivery.md) and [asset register](docs/assets.md).
