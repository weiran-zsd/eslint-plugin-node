/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * See LICENSE file in root directory for full license.
 */
"use strict"

const { CALL, CONSTRUCT, READ } = require("@eslint-community/eslint-utils")
const unprefixNodeColon = require("./unprefix-node-colon")

/**
 * @typedef DeprecatedInfo
 * @property {string} since
 * @property {string|{ name: string, supported: string }[]|null} replacedBy
 */
/** @typedef {import('@eslint-community/eslint-utils').TraceMap<DeprecatedInfo>} DeprecatedInfoTraceMap */

/**
 * Enumerate property names of a given object recursively.
 * @param {import('../unsupported-features/types.js').SupportVersionTree | DeprecatedInfoTraceMap} trackMap The map for APIs to enumerate.
 * @param {string[]} [path] The path to the current map.
 * @param {WeakSet<any>} [recursionSet] A WeakSet used to block recursion (eg Module, Module.Module, Module.Module.Module)
 * @returns {IterableIterator<string>} The property names of the map.
 */
function* enumeratePropertyNames(
    trackMap,
    path = [],
    recursionSet = new WeakSet()
) {
    if (recursionSet.has(trackMap)) {
        return
    }

    for (const key of Object.getOwnPropertyNames(trackMap)) {
        const childValue = trackMap[key]
        const childPath = [...path, key]
        const childName = unprefixNodeColon(childPath.join("."))

        if (childValue == null) {
            continue
        }

        if (childValue[CALL]) {
            yield `${childName}()`
        }

        if (childValue[CONSTRUCT]) {
            yield `new ${childName}()`
        }

        if (childValue[READ]) {
            yield childName
        }

        yield* enumeratePropertyNames(
            childValue,
            childPath,
            recursionSet.add(trackMap)
        )
    }
}

module.exports = enumeratePropertyNames
