module.exports = {
  extends: "react-app",
  plugins: ["jsx-a11y", "react"],
  rules: {
    "no-console": 1,
    "quotes": [2, "double", "avoid-escape"],
    "react/no-access-state-in-setstate": "error",
    "react/no-redundant-should-component-update": "error",
    "react/no-direct-mutation-state": "error",
    "react/no-typos": "error",
    "react/no-unused-state": "error"
  },
  overrides: {
    files: ["**/*.ts", "**/*.tsx"],
    parser: "typescript-eslint-parser",
    rules: {
      "no-unused-vars": [0],
      "no-undef": [0]
    }
  }
};
