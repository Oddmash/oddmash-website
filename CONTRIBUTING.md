# Development

Astro renders all routes as static HTML. Node 24, pinned pnpm, TypeScript and SCSS are used. Run `pnpm install --frozen-lockfile --ignore-scripts` with the committed lockfile, then `pnpm run dev`. For verification run `pnpm run check` and `pnpm exec playwright install chromium firefox webkit && pnpm run test:browser`. `pnpm run build` writes `build/`; serve via `pnpm run preview`. Source files are under `src/`, approved local media under `public/`. The old query-language links and `/privacy.html` redirect to the equivalent locale path. Browser tests use an isolated foreground preview on port 4322 and capture representative screens under `test-results/`.

The default build is a private preview: noindex, no canonical host and empty sitemap. Do not publish until approval, hosting access, asset rights and actual device/accessibility testing are verified. After explicit approval configure the verified HTTPS origin and `ODDMASH_PUBLIC_LAUNCH=true` in the build environment; review the rendered canonical, alternate links, sitemap and privacy notice. No tracking, auth, server-side storage or runtime service is added. Only an explicitly chosen language preference is stored on the user's device.

The initial home route selects the first supported browser language, falling back to English. Explicit localized routes and manual language choices take priority, and the root remains English without JavaScript. Use `/?lang=en` to select English explicitly during preview. Verify all localized project imagery, canonical and social metadata against the approved asset register; never replace a real capture with a fabricated example.

The lockfile pins `@oddmash/juliya@0.4.1` with registry integrity. The website uses its public DOM adapter across all supported locales. The exact-version release-age exception is restricted to this reviewed release and should be removed once mature.

Follow the [organization agreements](https://github.com/Oddmash/.github/blob/main/AGENTS.md) and the shared skills. See [delivery evidence](docs/delivery.md) and [asset register](docs/assets.md).

Create topic branches from `main` and open issue-linked pull requests directly against `main`. There is no integration branch; GitHub Pages deploys after verified main merges.

PR CI always runs metadata checks, static and browser tests, and the required `verify` check. After a normal merge, main CI may reuse the latest successful PR run only when it verified the exact merged tree. A missing or mismatched proof, direct push, or superseded or unsuccessful run requires the full suite again. Pages independently builds and validates the actual main revision before publishing.
