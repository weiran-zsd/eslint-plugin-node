/**
 * @fileoverview Helpers for tests.
 * @author 唯然<weiran.zsd@outlook.com>
 */
"use strict"

const eslintVersion = require("eslint/package.json").version

// greater than or equal to ESLint v8
exports.gtEslintV8 = +eslintVersion.split(".")[0] >= 8
