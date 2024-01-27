/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const { major, rsort } = require("semver")
const { ReferenceTracker } = require("@eslint-community/eslint-utils")
const getConfiguredNodeVersion = require("./get-configured-node-version")
const getSemverRange = require("./get-semver-range")
const unprefixNodeColon = require("./unprefix-node-colon")

/**
 * @typedef {Object} SupportInfo
 * @property {string[]} supported The stably supported version. If `null` is present, it hasn't been supported yet.
 * @property {string} [experimental] The added version as experimental.
 */

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
 * Check if it has been supported.
 * @param {SupportInfo} info The support info.
 * @param {Range} configured The configured version range.
 */
function isSupported({ supported }, configured) {
    if (supported == null || supported.length === 0) {
        return false
    }

    const [latest] = rsort(supported)
    const range = getSemverRange(
        [
            ...supported.map(
                version => `>= ${version} < ${major(version) + 1}`
            ),
            `> ${major(latest)}`,
        ].join("||")
    )

    return configured.intersects(range)
}

/**
 * Get the formatted text of a given supported version.
 * @param {SupportInfo} info The support info.
 */
function supportedVersionToString({ supported }) {
    if (supported == null || supported.length === 0) {
        return "(none yet)"
    }

    const [latest, ...backported] = rsort(supported)

    if (backported.length === 0) {
        return latest
    }

    const backportString = backported.map(version => `^${version}`).join(", ")

    return `${latest} (backported: ${backportString})`
}

/**
 * Verify the code to report unsupported APIs.
 * @param {RuleContext} context The rule context.
 * @param {{modules:object,globals:object}} trackMap The map for APIs to report.
 * @returns {void}
 */
module.exports.checkUnsupportedBuiltins = function checkUnsupportedBuiltins(
    context,
    trackMap
) {
    const options = parseOptions(context)
    const sourceCode = context.sourceCode ?? context.getSourceCode() // TODO: just use context.sourceCode when dropping eslint < v9
    const scope = sourceCode.getScope?.(sourceCode.ast) ?? context.getScope() //TODO: remove context.getScope() when dropping support for ESLint < v9
    const tracker = new ReferenceTracker(scope, { mode: "legacy" })
    const references = [
        ...tracker.iterateCjsReferences(trackMap.modules || {}),
        ...tracker.iterateEsmReferences(trackMap.modules || {}),
        ...tracker.iterateGlobalReferences(trackMap.globals || {}),
    ]

    for (const { node, path, info } of references) {
        const name = unprefixNodeColon(path.join("."))
        const supported = isSupported(info, options.version)

        if (!supported && !options.ignores.has(name)) {
            context.report({
                node,
                messageId: "unsupported",
                data: {
                    name,
                    supported: supportedVersionToString(info),
                    version: options.version.raw,
                },
            })
        }
    }
}

exports.messages = {
    unsupported:
        "The '{{name}}' is not supported until Node.js {{supported}}. The configured version range is '{{version}}'.",
}
