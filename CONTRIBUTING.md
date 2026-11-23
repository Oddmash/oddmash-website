# Development

Astro renders all routes as static HTML. Node 24, pinned pnpm, TypeScript and SCSS are used. Run `pnpm install --frozen-lockfile --ignore-scripts` with the committed lockfile, then `pnpm run dev`. For verification run `pnpm run check` and `pnpm exec playwright install chromium firefox webkit && pnpm run test:browser`. `pnpm run build` writes `build/`; serve via `pnpm run preview`. Source files are under `src/`, approved local media under `public/`. The old query-language links and `/privacy.html` redirect to the equivalent locale path. Browser tests use an isolated foreground preview on port 4322 and capture representative screens under `test-results/`.

The default build is a private preview: noindex, no canonical host and empty sitemap. Do not publish until approval, hosting access, asset rights and actual device/accessibility testing are verified. After explicit approval configure the verified HTTPS origin and `ODDMASH_PUBLIC_LAUNCH=true` in the build environment; review the rendered canonical, alternate links, sitemap and privacy notice. No tracking, auth, storage or runtime service is added.

The migrated lockfile retains `@oddmash/kowrap@0.3.0` and its exact original integrity. Remove the temporary exact-version minimum-release-age exception when that release satisfies the default maturity window.

Follow the [organization agreements](https://github.com/Oddmash/.github/blob/main/AGENTS.md) and the shared skills. See [delivery evidence](docs/delivery.md) and [asset register](docs/assets.md).
