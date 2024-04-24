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
 * Parses the options.
 * @param {import('eslint').Rule.RuleContext} context The rule context.
 * @returns {Readonly<{
 *   version: import('semver').Range,
 *   ignores: Set<string>
 * }>} Parsed value.
 */
function parseOptions(context) {
    const raw = context.options[0] || {}
    const version = getConfiguredNodeVersion(context)
    const ignores = new Set(raw.ignores || [])

    return Object.freeze({ version, ignores })
}

/**
 * Check if it has been supported.
 * @param {import('../unsupported-features/types.js').SupportInfo} info The support info.
 * @param {import('semver').Range} configured The configured version range.
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

    if (range == null) {
        return false
    }

    return configured.intersects(range)
}

/**
 * Get the formatted text of a given supported version.
 * @param {import('../unsupported-features/types.js').SupportInfo} info The support info.
 * @returns {string | undefined}
 */
function supportedVersionToString({ supported }) {
    if (supported == null || supported.length === 0) {
        return
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
 * @param {import('eslint').Rule.RuleContext} context The rule context.
 * @param {import('../unsupported-features/types.js').SupportVersionBuiltins} traceMap The map for APIs to report.
 * @returns {void}
 */
module.exports.checkUnsupportedBuiltins = function checkUnsupportedBuiltins(
    context,
    traceMap
) {
    const options = parseOptions(context)
    const sourceCode = context.sourceCode ?? context.getSourceCode() // TODO: just use context.sourceCode when dropping eslint < v9
    const scope = sourceCode.getScope?.(sourceCode.ast) ?? context.getScope() //TODO: remove context.getScope() when dropping support for ESLint < v9
    const tracker = new ReferenceTracker(scope, { mode: "legacy" })
    const references = [
        ...tracker.iterateCjsReferences(traceMap.modules ?? {}),
        ...tracker.iterateEsmReferences(traceMap.modules ?? {}),
        ...tracker.iterateGlobalReferences(traceMap.globals ?? {}),
    ]

    for (const { node, path, info } of references) {
        const name = unprefixNodeColon(path.join("."))
        const supported = isSupported(info, options.version)

        if (supported === true || options.ignores.has(name)) {
            continue
        }
        const supportedVersion = supportedVersionToString(info)
        context.report({
            node,
            messageId: supportedVersion
                ? "not-supported-till"
                : "not-supported-yet",
            data: {
                name: path.join("."),
                supported: /** @type string */ (supportedVersion),
                version: options.version.raw,
            },
        })
    }
}

exports.messages = {
    "not-supported-till": [
        "The '{{name}}' is still an experimental feature",
        "and is not supported until Node.js {{supported}}.",
        "The configured version range is '{{version}}'.",
    ].join(" "),
    "not-supported-yet": [
        "The '{{name}}' is still an experimental feature",
        "The configured version range is '{{version}}'.",
    ].join(" "),
}
