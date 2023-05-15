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
    {
        languageOptions: { globals: globals.mocha },
        linterOptions: { reportUnusedDisableDirectives: true },
    },
    {
        ignores: [
            ".nyc_output/",
            "coverage/",
            "docs/",
            "lib/converted-esm/",
            "test/fixtures/",
        ],
    },
    js.configs.recommended,
    nodeRecommended,
    ...compat.extends("plugin:eslint-plugin/recommended", "prettier"),
    { rules: { "eslint-plugin/require-meta-docs-description": "error" } },
    {
        // these messageIds were used outside
        files: ["lib/rules/prefer-global/*.js"],
        rules: {
            "eslint-plugin/no-unused-message-ids": 0,
        },
    },
]
