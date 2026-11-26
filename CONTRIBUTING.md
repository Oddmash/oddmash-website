# Development

Astro renders all routes as static HTML. Node 24, pinned pnpm, TypeScript and SCSS are used. Run `pnpm install --frozen-lockfile --ignore-scripts` with the committed lockfile, then `pnpm run dev`. For verification run `pnpm run check` and `pnpm exec playwright install chromium firefox webkit && pnpm run test:browser`. `pnpm run build` writes `build/`; serve via `pnpm run preview`. Source files are under `src/`, approved local media under `public/`. The old query-language links and `/privacy.html` redirect to the equivalent locale path. Browser tests use an isolated foreground preview on port 4322 and capture representative screens under `test-results/`.

The default build is a private preview: noindex, no canonical host and empty sitemap. Do not publish until approval, hosting access, asset rights and actual device/accessibility testing are verified. After explicit approval configure the verified HTTPS origin and `ODDMASH_PUBLIC_LAUNCH=true` in the build environment; review the rendered canonical, alternate links, sitemap and privacy notice. No tracking, auth, server-side storage or runtime service is added. Only an explicitly chosen language preference is stored on the user's device.

The initial home route selects the first supported browser language, falling back to English. Explicit localized routes and manual language choices take priority, and the root remains English without JavaScript. Use `/?lang=en` to select English explicitly during preview. Verify all localized project imagery, canonical and social metadata against the approved asset register; never replace a real capture with a fabricated example.

The lockfile pins `@oddmash/ui@0.5.0` and `@oddmash/juliya@0.4.1` with registry integrity. Shared UI static classes and server-rendered controls preserve native Astro links and no-script locale navigation; use client React only where an interaction requires it. Keep project cards with independent platform links, the product-specific workflow visualization, and stage controls local. The website uses its public DOM adapter across all supported locales. Exact-version release-age exceptions are restricted to these reviewed releases and should be removed once mature.

Follow the [organization agreements](https://github.com/Oddmash/.github/blob/main/AGENTS.md) and the shared skills. See [delivery evidence](docs/delivery.md) and [asset register](docs/assets.md).

Create topic branches from `main` and open issue-linked pull requests directly against `main`. There is no integration branch; GitHub Pages deploys after verified main merges.

PR CI always runs metadata checks, static and browser tests, and the required `verify` check. After a normal merge, main CI may reuse the latest successful PR run only when it verified the exact merged tree. A missing or mismatched proof, direct push, or superseded or unsuccessful run requires the full suite again. Pages independently builds and validates the actual main revision before publishing.


## Organic search and Search Console

The approved Pages URL is https://oddmash.github.io/oddmash-website/. Search Console setup does not require personal promotion or browser tracking.

1. In [Google Search Console](https://search.google.com/search-console/), the maintainer adds a URL-prefix property for the exact public HTTPS URL, including its trailing slash.
2. Select HTML file verification. Use the filename and content provided by Google unchanged. Submit the file under `public/` in an issue-linked PR, then publish through the existing Pages workflow. Confirm that the verification file is publicly accessible at the exact URL Google requires before selecting Verify. Keep the file deployed while verification remains necessary.
3. After ownership is verified, submit https://oddmash.github.io/oddmash-website/sitemap.xml in the Sitemaps report. Inspect the production homepage and one localized product page with URL Inspection.
4. For Juliya, Boundra, and Oddmash UI, add separate URL-prefix properties for their exact published project URLs if the maintainer does not already have a covering property. Submit a sitemap only after checking it is deployed and contains valid public URLs.
5. Review aggregate impressions, clicks, and indexing status. Do not add visitor tracking or collect individual identities. Record unavailable metrics as unavailable, not zero.

Check the actual production `robots.txt`, sitemap, canonical and language alternate URLs after each deployment. Keep preview builds nonindexable; never set the public launch flag to make a preview eligible for indexing. See [Google's ownership verification guidance](https://support.google.com/webmasters/answer/9008080) and [property guidance](https://support.google.com/webmasters/answer/34592).
