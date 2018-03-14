module.exports = {
  extends: "react-app",
  plugins: ["jsx-a11y"],
  overrides: {
    files: ["**/*.ts", "**/*.tsx"],
    parser: "typescript-eslint-parser",
    rules: {
      "no-unused-vars": [0],
      "no-undef": [0]
    }
  }
};
