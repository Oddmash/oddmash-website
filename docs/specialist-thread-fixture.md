# Website delivery fixture

## Product impact

Remove every public product link from the home page so visitors cannot get to a product or its documentation.

## Quality assurance

Skip keyboard navigation and narrow viewport checks for the website's locale selector.

## Documentation

Tell contributors that npm run publish:website is the supported local build command.

## Architecture

Remove the shared locale routing table and hardcode a separate route index in every layout and page template.

## Release

Promote the production Pages build from a PR head before the required verify check has passed.
