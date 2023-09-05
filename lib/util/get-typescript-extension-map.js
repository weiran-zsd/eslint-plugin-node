"use strict"

const DEFAULT_MAPPING = normalise([
    ["", ".js"],
    [".ts", ".js"],
    [".cts", ".cjs"],
    [".mts", ".mjs"],
    [".tsx", ".jsx"],
])

/**
 * @typedef {Object} ExtensionMap
 * @property {Record<string, string>} forward Convert from typescript to javascript
 * @property {Record<string, string[]>} backward Convert from javascript to typescript
 */

function normalise(typescriptExtensionMap) {
    const forward = {}
    const backward = {}
    for (const [typescript, javascript] of typescriptExtensionMap) {
        forward[typescript] = javascript
        if (!typescript) {
            continue
        }
        backward[javascript] ??= []
        backward[javascript].push(typescript)
    }
    return { forward, backward }
}

/**
 * Gets `typescriptExtensionMap` property from a given option object.
 *
 * @param {object|undefined} option - An option object to get.
 * @returns {ExtensionMap} The `typescriptExtensionMap` value, or `null`.
 */
function get(option) {
    if (
        option &&
        option.typescriptExtensionMap &&
        Array.isArray(option.typescriptExtensionMap)
    ) {
        return normalise(option.typescriptExtensionMap)
    }

    return null
}

/**
 * Gets "typescriptExtensionMap" setting.
 *
 * 1. This checks `options` property, then returns it if exists.
 * 2. This checks `settings.n` | `settings.node` property, then returns it if exists.
 * 3. This returns `DEFAULT_MAPPING`.
 *
 * @param {import('eslint').Rule.RuleContext} context - The rule context.
 * @returns {string[]} A list of extensions.
 */
module.exports = function getTypescriptExtensionMap(context) {
    return (
        get(context.options && context.options[0]) ||
        get(
            context.settings && (context.settings.n || context.settings.node)
        ) ||
        // TODO: Detect tsconfig.json here
        DEFAULT_MAPPING
    )
}

module.exports.schema = {
    type: "array",
    items: {
        type: "array",
        prefixItems: [
            { type: "string", pattern: "^(?:|\\.\\w+)$" },
            { type: "string", pattern: "^\\.\\w+$" },
        ],
        additionalItems: false,
    },
    uniqueItems: true,
}
