# Delivery decisions and acceptance

Audience: developers and potential contributors looking for an actual tool; first useful action is exploring a project and reaching its public product or documentation. No account, form, persistent user data, server, analytics, ads or billing. No skeletons needed: content is prerendered. Loading/failure applies only to optional copy and wrapping enhancement, not navigation.

Astro static rendering replaces manually duplicated HTML and runtime locale switching; Next.js server features and React hydration are unnecessary. Shared Oddmash UI token snapshot, native buttons and links, SCSS and small browser scripts preserve semantic color and focus. Kowrap is used for a real comparison on its detail page, with actual-width bounds and a progressive fallback. The private preview includes five currently public projects and 32 localized content pages plus a 404. Roll back via a normal revert PR; hosting setup and audience unchanged.

| Area | Applicability / acceptance |
| --- | --- |
| Product & UX | Required: project pages, real screenshots, product links, language routes and actionable contribution |
| Accessibility | Required: keyboard, focus, reflow, names, live announcements, reduced motion; full manual assistive technology review remains a launch gate |
| Internationalization | Required: static locale paths, translation parity, preserved locale and legacy URL |
| Sharing & discovery | Required: copy feedback; noindex, empty sitemap by default; canonical/hreflang only on approved origin |
| Copyright & privacy | Required: asset register, no tracking, notice; verify hosting and rights before public launch |
| Operations & delivery | Required: static build, CI, dependency checks, rollback; no backend or additional billing |
| Accounts / uploads / payments / user records | Not applicable: informational site |

Tests: `pnpm install --frozen-lockfile --ignore-scripts`, `pnpm run check` (typecheck, static build, metadata and path tests, synthetic public launch gate) and `pnpm run test:browser` (Chromium, Firefox and WebKit; 320px, keyboard, all locales, filters, clipboard success/fallback, JavaScript disabled, light/dark captures and actual wrapping width). Real-device, screen-reader, production origin, live social preview and actual hosting policy are not certified by automated checks. Do not launch publicly with unresolved required evidence.

The Vercel install and build commands invoke Corepack to use the exact packageManager pin instead of inferring a pnpm version from the lockfile format. Verify the selected pnpm version in the authorized hosting build logs before launch. If provider-side auto-detection is needed, enable `ENABLE_EXPERIMENTAL_COREPACK=1` only in the approved hosting project.

Serve the output at the root of a dedicated HTTPS origin. The generated routes, locale links, assets and legacy redirects are root-relative; subpath deployment is not supported by the current build. A future base-path migration requires coordinated routing and browser tests. CI also covers repeated cached-page lifecycle transitions in the Kowrap demo.
