// @see https://prettier.io/docs/en/options
module.exports = {
  printWidth: 130,   // 指定换行的行长<int>，默认80
  tabWidth: 2,       // 指定每个缩进级别的空格数<int>，默认2
  useTabs: false,    // 使用tab缩进<bool>，默认false
  semi: true,        // 在语句末尾添加分号<bool>，默认true
  singleQuote: true, // 使用单引号而不是双引号<bool>，默认false
  bracketSameLine: true, // 把多行JSX元素的>`放在最后一行的末尾，而不是单独放在下一行（不适用于自闭合标签）<bool>，默认false
  trailingComma: "all",// 在对象或数组最后一个元素后面是否加逗号（影响多行模式）<es5|none|all>，默认none
  endOfLine: "auto", // 结尾是 \n \r \n 或 auto<lf|crlf|cr|auto>，默认 lf
  htmlWhitespaceSensitivity: "ignore", // 指定HTML文件的全局空白区域敏感度<css|strict|ignore>，默认css
  overrides: [
    {
      files: "*.json",
      options: {
        trailingComma: "none",
      },
    },
  ],
};