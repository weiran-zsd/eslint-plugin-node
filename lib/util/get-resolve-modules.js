/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

/** @type {string[]} */
const DEFAULT_VALUE = ["node_modules"]

/**
 * Gets `resolveModules` property from a given option object.
 *
 * @param {{ resolveModules: unknown[] } | undefined} option - An option object to get.
 * @returns {string[] | undefined} The `allowModules` value, or `null`.
 */
function get(option) {
    if (Array.isArray(option?.resolveModules)) {
        return option.resolveModules.map(String)
    }
}

/**
 * Gets "resolveModules" setting.
 *
 * 1. This checks `options` property, then returns it if exists.
 * 2. This checks `settings.n` | `settings.node` property, then returns it if exists.
 * 3. This returns `[]`.
 *
 * @param {import('eslint').Rule.RuleContext} context - The rule context.
 * @returns {string[]} A list of modules paths.
 */
module.exports = function getResolveModules(context, optionIndex = 0) {
    return (
        get(context.options?.[optionIndex]) ??
        get(context.settings?.n) ??
        get(context.settings?.node) ??
        DEFAULT_VALUE
    )
}

module.exports.schema = {
    type: "array",
    items: { type: "string" },
    uniqueItems: true,
}
