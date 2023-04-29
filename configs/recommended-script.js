/**
 * @fileoverview the `recommended-script` config for `eslint.config.js`
 * @author 唯然<weiran.zsd@outlook.com>
 */

"use strict"

const mod = require("../lib/index.js")

module.exports = {
    plugins: { n: mod },
    languageOptions: { sourceType: "commonjs" },
    rules: mod.configs["recommended-script"].rules,
}
