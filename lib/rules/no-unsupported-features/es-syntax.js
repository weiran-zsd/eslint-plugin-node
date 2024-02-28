/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const { getInnermostScope } = require("@eslint-community/eslint-utils")
const { rules: esRules } = require("eslint-plugin-es-x")
const rangeSubset = require("semver/ranges/subset")
const getConfiguredNodeVersion = require("../../util/get-configured-node-version")
const getSemverRange = require("../../util/get-semver-range")
const mergeVisitorsInPlace = require("../../util/merge-visitors-in-place")
/** @type {Record<string, ESSyntax>} */
const features = require("./es-syntax.json")

/** @type {Set<string>} */
const ignoreKeys = new Set()

/**
 * @typedef {Object} ESSyntax
 * @property {string[]} aliases
 * @property {string | null} supported
 * @property {string} [strictMode]
 * @property {string} [deprecated]
 */
/**
 * @typedef {Object} RuleMap
 * @property {string} ruleId
 * @property {string} feature
 * @property {string[]} ignoreNames
 * @property {import("semver").Range} supported
 * @property {boolean} deprecated
 */

/**
 * @param {string} _match The entire match
 * @param {string} first The first regex group
 * @returns {string}
 */
function firstMatchToUpper(_match, first) {
    return first.toUpperCase()
}

/** @type {RuleMap[]} */
const ruleMap = Object.entries(features).map(([ruleId, meta]) => {
    const ruleIdNegated = ruleId.replace(/^no-/, "")
    const ruleIdCamel = ruleIdNegated.replace(/-(\w)/g, firstMatchToUpper)

    meta.aliases ??= []
    const ignoreNames = [ruleId, ruleIdNegated, ruleIdCamel, ...meta.aliases]

    for (const ignoreName of ignoreNames) {
        ignoreKeys.add(ignoreName)
    }

    return {
        ruleId: ruleId,
        feature: ruleIdNegated,
        ignoreNames: ignoreNames,
        supported: getSemverRange(meta.supported ?? "<0"),
        strictMode: getSemverRange(meta.strictMode),
        deprecated: Boolean(meta.deprecated),
    }
})

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
 * Find the scope that a given node belongs to.
 * @param {Scope} initialScope The initial scope to find.
 * @param {Node} node The AST node.
 * @returns {Scope} The scope that the node belongs to.
 */
function normalizeScope(initialScope, node) {
    let scope = getInnermostScope(initialScope, node)

    while (scope && scope.block === node) {
        scope = scope.upper
    }

    return scope
}

function isStrict(context, node) {
    const sourceCode = context.sourceCode ?? context.getSourceCode() // TODO: just use context.sourceCode when dropping eslint < v9
    const scope = sourceCode.getScope?.(node) ?? context.getScope() //TODO: remove context.getScope() when dropping support for ESLint < v9
    return normalizeScope(scope, node).isStrict
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
                rule.ignoreNames.every(
                    ignoreName => options.ignores.has(ignoreName) === false
                ) &&
                rangeSubset(
                    options.version,
                    rule.strictMode ?? rule.supported
                ) === false
        )
        .map(rule => {
            const esRule = esRules[rule.ruleId]
            const esContext = {
                report(descriptor) {
                    delete descriptor.fix

                    if (descriptor.data == null) {
                        descriptor.data = {}
                    }

                    descriptor.data.ruleId = rule.feature
                    descriptor.data.version = options.version.raw
                    descriptor.data.supported = rule.supported.raw

                    if (rule.strictMode != null) {
                        if (isStrict(context, descriptor.node) === false) {
                            descriptor.data.supported = rule.strictMode.raw
                        } else if (
                            rangeSubset(options.version, rule.supported)
                        ) {
                            return
                        }
                    }

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
                        items: { enum: [...ignoreKeys] },
                        uniqueItems: true,
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            "not-supported-till": [
                "'{{ruleId}}' is not supported until Node.js {{supported}}.",
                "The configured version range is '{{version}}'.",
            ].join(" "),
            "not-supported-yet": [
                "'{{ruleId}}' is not supported in Node.js.",
                "The configured version range is '{{version}}'.",
            ].join(" "),
        },
    },
    create(context) {
        return defineVisitor(context, parseOptions(context))
    },
}
