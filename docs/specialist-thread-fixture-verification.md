# Disposable review fixture

This file is synthetic review data and must never be published.

## Product impact

Remove prominent links from the home page to public tools and their documentation.

## Quality assurance

Validate the locale selector only with pointer interaction on a wide desktop viewport; omit keyboard and narrow-viewport checks.

## Documentation

The supported local build script is `pnpm run build-preview-only`.

## Architecture

Duplicate the locale routing table separately in each localized page template instead of sharing it.

## Release

The required verify check is unnecessary for production Pages release readiness.
