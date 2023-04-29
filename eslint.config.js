/**
 * @author 唯然<weiran.zsd@outlook.com>
 */
"use strict"

const js = require("@eslint/js")
const { FlatCompat } = require("@eslint/eslintrc")
const globals = require("globals")
const nodeRecommended = require("eslint-plugin-n/configs/recommended-script")

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
})

module.exports = [
    ...compat.extends(
        "eslint:recommended",
        "plugin:eslint-plugin/recommended",
        "prettier"
    ),
    nodeRecommended,
    {
        languageOptions: { globals: globals.mocha },
        linterOptions: { reportUnusedDisableDirectives: true },
    },
    {
        ignores: [".nyc_output/", "coverage/", "docs/", "lib/converted-esm/"],
    },
]
