/**
 * @fileoverview the `recommended-module` config for `eslint.config.js`
 * @author 唯然<weiran.zsd@outlook.com>
 */

"use strict"

const { configs, rules } = require("../lib/index.js")

module.exports = {
    plugins: { n: { rules } },
    languageOptions: { sourceType: "module" },
    rules: configs["recommended-module"].rules,
}
