module.exports = {
  extends: ["plugin:react/recommended", "plugin:react-hooks/recommended", "plugin:@typescript-eslint/recommended"],
  plugins: ["jsx-a11y", "react", "react-hooks", "@typescript-eslint", "import"],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
      }
    },
    react: {
      version: "detect"
    },
  },
  rules: {
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-use-before-define": "error",
    "jsx-a11y/href-no-hash": "off", // temp workaround
    "no-console": "warn",
    "react/jsx-uses-react": "off",
    "react/no-access-state-in-setstate": "error",
    "react/no-direct-mutation-state": "error",
    "react/no-redundant-should-component-update": "error",
    "react/no-typos": "error",
    "react/no-unused-state": "warn",
    "react/react-in-jsx-scope": "off"
  },
  overrides: [{
    files: ["**/*.ts", "**/*.tsx"],
    parser: "@typescript-eslint/parser",
    rules: {
      "no-unused-vars": "off",
      "no-undef": "off"
    }
  }]
};
