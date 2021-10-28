module.exports = {
  printWidth: 120,
  bracketSpacing: true,
  jsxBracketSameLine: true,
  singleQuote: false,
  arrowParens: "avoid",
  trailingComma: "none",
  overrides: [
    {
      files: ["*.vue"],
      options: {
        printWidth: 250
      }
    }
  ]
};
