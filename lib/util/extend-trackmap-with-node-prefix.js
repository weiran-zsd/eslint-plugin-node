"use strict"

const isBuiltinModule = require("is-builtin-module")

/**
 * Extend trackMap.modules with `node:` prefixed modules
 * @param {import('@eslint-community/eslint-utils').TraceMap} modules Like `{assert: foo}`
 * @returns {import('@eslint-community/eslint-utils').TraceMap} Like `{assert: foo}, "node:assert": foo}`
 */
module.exports = function extendTrackMapWithNodePrefix(modules) {
    const ret = {
        ...modules,
        ...Object.fromEntries(
            Object.entries(modules)
                .map(([name, value]) => [`node:${name}`, value])
                .filter(([name]) =>
                    isBuiltinModule(/** @type {string} */ (name))
                )
        ),
    }
    return ret
}
