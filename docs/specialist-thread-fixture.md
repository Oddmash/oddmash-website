# Website delivery fixture

## Product impact

Keep prominent links from the home page to public products and their documentation so visitors can reach the tools they discover.

## Quality assurance

Verify the locale selector with keyboard navigation and a narrow viewport, including visible focus and preserved routes after switching.

## Documentation

Build the website locally with `pnpm run build`, which runs the repository's Astro build script.

## Architecture

Keep the shared locale routing table as the source of truth so layouts and page templates use consistent route mappings.

## Release

Run the required verify check before merging and publish the production Pages build from the approved default branch through the maintainer's release workflow.
