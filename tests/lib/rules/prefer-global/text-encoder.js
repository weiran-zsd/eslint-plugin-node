/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("#eslint-rule-tester").RuleTester
const rule = require("../../../../lib/rules/prefer-global/text-encoder")

new RuleTester().run("prefer-global/text-encoder", rule, {
    valid: [
        "var b = new TextEncoder(s)",
        {
            code: "var b = new TextEncoder(s)",
            options: ["always"],
        },
        {
            code: "var { TextEncoder } = require('util'); var b = new TextEncoder(s)",
            options: ["never"],
        },
        {
            code: "var { TextEncoder } = require('node:util'); var b = new TextEncoder(s)",
            options: ["never"],
        },
    ],
    invalid: [
        {
            code: "var { TextEncoder } = require('util'); var b = new TextEncoder(s)",
            errors: [{ messageId: "preferGlobal" }],
        },
        {
            code: "var { TextEncoder } = require('node:util'); var b = new TextEncoder(s)",
            errors: [{ messageId: "preferGlobal" }],
        },
        {
            code: "var { TextEncoder } = require('util'); var b = new TextEncoder(s)",
            options: ["always"],
            errors: [{ messageId: "preferGlobal" }],
        },
        {
            code: "var { TextEncoder } = require('node:util'); var b = new TextEncoder(s)",
            options: ["always"],
            errors: [{ messageId: "preferGlobal" }],
        },
        {
            code: "var b = new TextEncoder(s)",
            options: ["never"],
            errors: [{ messageId: "preferModule" }],
        },
    ],
})
