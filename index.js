module.exports = {
  extends: ["plugin:react/recommended", "plugin:react-hooks/recommended", "plugin:@typescript-eslint/recommended"],
  plugins: ["jsx-a11y", "react", "react-hooks", "@typescript-eslint"],
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "no-console": 1,
    "react/no-access-state-in-setstate": "error",
    "react/no-redundant-should-component-update": "error",
    "react/no-direct-mutation-state": "error",
    "react/no-typos": "error",
    "react/no-unused-state": "error",
    "jsx-a11y/href-no-hash": [0], // temp workaround
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error"]
  },
  overrides: [{
    files: ["**/*.ts", "**/*.tsx"],
    parser: "@typescript-eslint/parser",
    rules: {
      "no-unused-vars": [0],
      "no-undef": [0]
    }
  }]
};
