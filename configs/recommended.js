"use strict"

const mod = require("../lib/index.js")
const {globals, rules, overrides} = mod.configs["recommended"]

module.exports = {
    plugins: { n: mod },
    languageOptions: {
        sourceType: "module",
        globals,
    },
    rules,
    overrides,
}
