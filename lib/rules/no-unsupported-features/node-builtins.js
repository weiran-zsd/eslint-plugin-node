/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const { READ } = require("@eslint-community/eslint-utils")
const {
    checkUnsupportedBuiltins,
    messages,
} = require("../../util/check-unsupported-builtins")
const enumeratePropertyNames = require("../../util/enumerate-property-names")
const getConfiguredNodeVersion = require("../../util/get-configured-node-version")

const {
    NodeBuiltinModules,
} = require("../../unsupported-features/node-builtins.js")

/**
 * @typedef TraceMap
 * @property {import('@eslint-community/eslint-utils').TraceMap<boolean>} globals
 * @property {import('@eslint-community/eslint-utils').TraceMap<boolean>} modules
 */
const traceMap = {
    globals: {
        queueMicrotask: {
            [READ]: { supported: ["12.0.0"], experimental: ["11.0.0"] },
        },
        require: {
            resolve: {
                paths: { [READ]: { supported: ["8.9.0"] } },
            },
        },
    },
    modules: NodeBuiltinModules,
}
Object.assign(traceMap.globals, {
    Buffer: traceMap.modules.buffer.Buffer,
    TextDecoder: {
        ...traceMap.modules.util.TextDecoder,
        [READ]: { supported: ["11.0.0"] },
    },
    TextEncoder: {
        ...traceMap.modules.util.TextEncoder,
        [READ]: { supported: ["11.0.0"] },
    },
    URL: {
        ...traceMap.modules.url.URL,
        [READ]: { supported: ["10.0.0"] },
    },
    URLSearchParams: {
        ...traceMap.modules.url.URLSearchParams,
        [READ]: { supported: ["10.0.0"] },
    },
    console: traceMap.modules.console,
    process: traceMap.modules.process,
})

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        docs: {
            description:
                "disallow unsupported Node.js built-in APIs on the specified version",
            recommended: true,
            url: "https://github.com/eslint-community/eslint-plugin-n/blob/HEAD/docs/rules/no-unsupported-features/node-builtins.md",
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
                            enum: Array.from(
                                new Set([
                                    ...enumeratePropertyNames(traceMap.globals),
                                    ...enumeratePropertyNames(traceMap.modules),
                                ])
                            ),
                        },
                        uniqueItems: true,
                    },
                },
                additionalProperties: false,
            },
        ],
        messages,
    },
    create(context) {
        return {
            "Program:exit"() {
                checkUnsupportedBuiltins(context, traceMap)
            },
        }
    },
}
