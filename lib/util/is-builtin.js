"use strict"

const {
    NodeBuiltinModules,
} = require("../unsupported-features/node-builtins.js")

const builtins = new Set(Object.keys(NodeBuiltinModules))

/**
 * @param {string} name The name of the module
 * @returns {boolean}
 */
function isBuiltin(name) {
    return builtins.has(name)
}

module.exports = { isBuiltin }
