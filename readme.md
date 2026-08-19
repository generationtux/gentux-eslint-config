# @generationtux/eslint-config

![Tests](https://github.com/generationtux/gentux-eslint-config/workflows/Tests/badge.svg)

ESLint configuration for Generation Tux projects.

## Setup

1. Install the package:

```bash
npm i -D @generationtux/eslint-config
# or
yarn add -D @generationtux/eslint-config
```

2. Create an `eslint.config.mjs` file in your project root:

```javascript
import gentuxConfig from '@generationtux/eslint-config';

export default [
  ...gentuxConfig,
  // Add your own rules here
];
```

## Release

Bump the version in `package.json` and merge to `master`. CI publishes to npm via
trusted publishing (OIDC) — there is no token to log in with, and publishing from
a laptop will not work.

## Changelog

### Version 4.1.2

- Publish via npm trusted publishing (OIDC) instead of a stored token
- Bumped CI to Node 24

### Version 4.1.1

- Optimized CI workflows to avoid duplicate test runs on merge

### Version 4.1.0

- Updated all dependencies to latest versions
- Added React Hooks rules (`rules-of-hooks`, `exhaustive-deps`)
- Removed legacy React 17 rules
- Fixed: Removed eslint from dependencies (kept only in peerDependencies)
- Added author and files field to package.json
- Added test suite
- Added GitHub Actions CI

### Version 4.0.0

- **BREAKING**: Requires ESLint 9
- **BREAKING**: Migrated to flat config (`eslint.config.mjs`)
- **BREAKING**: Ported to ES module
- Updated all dependencies
- Removed TypeScript version upper bound restriction
