/**
 * @fileoverview Helpers for tests.
 * @author 唯然<weiran.zsd@outlook.com>
 */
"use strict"
const eslintVersion = require("eslint/package.json").version
const RuleTester = require("eslint").RuleTester
const unofficialApis = require("eslint/use-at-your-own-risk")
const globals = require("globals")

// greater than or equal to ESLint v9
exports.gteEslintV9 = +eslintVersion.split(".")[0] >= 9

exports.FlatRuleTester = exports.gteEslintV9
    ? RuleTester
    : unofficialApis.FlatRuleTester

// to support the `env:{ es6: true, node: true}` rule-tester (env has been away in flat config.)
// * enabled by default as it's most commonly used in the package.
// * to disable the node.js globals: {languageOptions: {env: {node: false}}}.
exports.RuleTester = function (
    config = {
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "commonjs",
            globals: globals.node,
        },
    }
) {
    config.languageOptions = config.languageOptions || {}
    if (config.languageOptions.env?.node === false)
        config.languageOptions.globals = config.languageOptions.globals || {}
    delete config.languageOptions.env

    const ruleTester = new exports.FlatRuleTester(config)
    return ruleTester
}
