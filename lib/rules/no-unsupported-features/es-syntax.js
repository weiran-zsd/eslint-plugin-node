/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const { readFileSync } = require("node:fs")
const { resolve } = require("node:path")

const { rules: esRules } = require("eslint-plugin-es-x")
const rangeSubset = require("semver/ranges/subset")
const getConfiguredNodeVersion = require("../../util/get-configured-node-version")
const getSemverRange = require("../../util/get-semver-range")
const mergeVisitorsInPlace = require("../../util/merge-visitors-in-place")

/**
 * @type {{ruleId: string, supported: import("semver").Range, deprecated: boolean}[]}
 */
const features = JSON.parse(readFileSync(resolve(__dirname, "es-syntax.json")))

const ruleMap = Object.entries(features).map(([rule, meta]) => ({
    ruleId: rule,
    supported: getSemverRange(meta.supported ?? "<0"),
    deprecated: Boolean(meta.deprecated),
}))

/**
 * Parses the options.
 * @param {RuleContext} context The rule context.
 * @returns {{version:Range,ignores:Set<string>}} Parsed value.
 */
function parseOptions(context) {
    const raw = context.options[0] || {}
    const version = getConfiguredNodeVersion(context)
    const ignores = new Set(raw.ignores || [])

    return Object.freeze({ version, ignores })
}

/**
 * Define the visitor object as merging the rules of eslint-plugin-es-x.
 * @param {RuleContext} context The rule context.
 * @param {{version:Range,ignores:Set<string>}} options The options.
 * @returns {object} The defined visitor.
 */
function defineVisitor(context, options) {
    return ruleMap
        .filter(
            rule =>
                options.ignores.has(rule.ruleId) === false &&
                options.ignores.has(rule.ruleId.slice(3)) === false &&
                rangeSubset(options.version, rule.supported) === false
        )
        .map(rule => {
            // console.info(options.version, rule.supported);
            const esRule = esRules[rule.ruleId]
            const esContext = {
                report(descriptor) {
                    delete descriptor.fix

                    if (descriptor.data == null) {
                        descriptor.data = {}
                    }

                    descriptor.data.name = rule.ruleId
                    descriptor.data.version = options.version.raw
                    descriptor.data.supported = rule.supported.raw

                    descriptor.messageId =
                        rule.supported.raw === "<0"
                            ? "not-supported-yet"
                            : "not-supported-till"

                    super.report(descriptor)
                },
            }

            Object.setPrototypeOf(esContext, context)

            return esRule.create(esContext)
        })
        .reduce(mergeVisitorsInPlace, {})
}

module.exports = {
    meta: {
        docs: {
            description:
                "disallow unsupported ECMAScript syntax on the specified version",
            recommended: true,
            url: "https://github.com/eslint-community/eslint-plugin-n/blob/HEAD/docs/rules/no-unsupported-features/es-syntax.md",
        },
        type: "problem",
        fixable: null,
        schema: [
            {
                type: "object",
                properties: {
                    version: getConfiguredNodeVersion.schema,
                    ignores: {
                        type: "array",
                        items: {
                            enum: Object.keys(features),
                        },
                        uniqueItems: true,
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            "not-supported-till": [
                "'{{name}}' is not supported until Node.js {{supported}}.",
                "The configured version range is '{{version}}'.",
            ].join(" "),
            "not-supported-yet": [
                "'{{name}}' is not supported in Node.js.",
                "The configured version range is '{{version}}'.",
            ].join(" "),
        },
    },
    create(context) {
        return defineVisitor(context, parseOptions(context))
    },
}
