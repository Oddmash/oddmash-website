# Development

The site is static HTML, CSS, and JavaScript with no runtime dependencies. Serve `dist/` with a local static HTTP server, for example `python3 -m http.server 8080 --directory dist`.

Run `node verify.mjs` and `node --check dist/app.js` before opening a pull request. The verifier tests local references and interaction logic using synthetic browser objects; it is not a substitute for browser, device, or accessibility QA.

Before public deployment, configure the verified canonical origin and absolute Open Graph image URL, replace the preview-only indexing directives, review the privacy notice against the actual hosting environment, and verify the real deployed page. Keep private project names and internal operational details out of public copy. Do not publish without maintainer approval.

Follow the [Oddmash organization agreements](https://github.com/Oddmash/.github/blob/main/AGENTS.md). Public project assets shown here come from the Oddmash UI repository; illustrative diagrams are labeled in the interface.
