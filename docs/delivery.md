# Delivery decisions and acceptance

Audience: developers and potential contributors looking for an actual tool; first useful action is exploring a project and reaching its public product or documentation. No account, form, persistent user data, server, analytics, ads or billing. No skeletons needed: content is prerendered. Loading/failure applies only to optional copy and wrapping enhancement, not navigation.

Astro static rendering replaces manually duplicated HTML and runtime locale switching; Next.js server features and React hydration are unnecessary. Shared Oddmash UI token snapshot, native buttons and links, SCSS and small browser scripts preserve semantic color and focus. The published Korean Kowrap 0.3.2 engine enhances eligible Korean editorial content and the historical comparison on its detail page, preserving inline markup and a native fallback. English, Japanese and Simplified Chinese use native typography until a separately verified website migration to the current public Juliya package. The website includes four public projects, a standalone project catalogue, agent documentation, 30 practical skill guides and a stage-based catalog, and a continuously looping illustrative workflow, totaling 192 localized content pages plus a 404. Preview builds remain noindex; the approved GitHub Pages origin is the public build. Roll back via a normal revert PR.

| Area | Applicability / acceptance |
| --- | --- |
| Product & UX | Required: project pages, real screenshots, product links, language routes and actionable contribution |
| Accessibility | Required: keyboard, focus, reflow, names, live announcements, reduced motion; full manual assistive technology review remains a launch gate |
| Internationalization | Required: static locale paths, translation parity, preserved locale and legacy URL |
| Sharing & discovery | Required: copy feedback; noindex, empty sitemap by default; canonical/hreflang only on approved origin |
| Copyright & privacy | Required: asset register, no tracking, notice; verify hosting and rights before public launch |
| Operations & delivery | Required: static build, CI, dependency checks, rollback; no backend or additional billing |
| Accounts / uploads / payments / user records | Not applicable: informational site |

Tests: `pnpm install --frozen-lockfile --ignore-scripts`, `pnpm run check` (typecheck, static build, metadata and path tests, synthetic public launch gate) and `pnpm run test:browser` (Chromium, Firefox and WebKit; 320px, keyboard, all locales, standalone catalog, skill and share clipboard success/fallback, JavaScript disabled, light/dark captures and actual wrapping width). Real-device, screen-reader, production origin, live social preview and actual hosting policy are not certified by automated checks. Do not launch publicly with unresolved required evidence.

GitHub Actions uses the pinned pnpm version and Node 24. The Pages preparation script prefixes root-relative HTML links and assets for `/oddmash-website/`, verifies all built targets, and preserves canonical metadata. CI also covers repeated cached-page lifecycle transitions in the Kowrap demo.

Readability QA: verify representative text contrast at 4.5:1 or better, control boundaries at 3:1 where necessary, visible keyboard focus, and full-opacity workflow text during interruption. Confirm practical skill instructions, current public product destinations, and the separate historical comparison engine.
