/**
 * @author 唯然<weiran.zsd@outlook.com>
 */
"use strict"

const js = require("@eslint/js")
const globals = require("globals")
const nodeRecommended = require("eslint-plugin-n/configs/recommended-script")
const eslintPluginConfig = require("eslint-plugin-eslint-plugin/configs/recommended")
const prettierConfig = require("eslint-config-prettier")

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
            "tests/fixtures/",
        ],
    },
    js.configs.recommended,
    nodeRecommended,
    eslintPluginConfig,
    prettierConfig,
    {
        rules: {
            strict: ["error", "global"],
            "eslint-plugin/require-meta-docs-description": "error",
        },
    },
    {
        // these messageIds were used outside
        files: ["lib/rules/prefer-global/*.js"],
        rules: {
            "eslint-plugin/no-unused-message-ids": 0,
        },
    },
]
