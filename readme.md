# @generationtux/eslint-config

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

export default gentuxConfig;
```

## Changelog

### Version 4.0.0

- **BREAKING**: Requires ESLint 9
- **BREAKING**: Migrated to new ESLint flat config system
- **BREAKING**: Now requires `eslint.config.mjs` instead of `.eslintrc`
- **BREAKING**: Ported to ES module
- Updated all dependencies to their latest versions
- Removed TypeScript version upper bound restriction

## Release

- npm login (user: gentux)
- npm publish
