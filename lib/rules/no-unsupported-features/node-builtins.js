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

        // General APIs
        AbortController: {
            [READ]: { supported: ["15.0.0"] },
        },
        AbortSignal: {
            [READ]: { supported: ["15.0.0"] },
            abort: { [READ]: { supported: ["15.12.0"] } },
            any: { [READ]: { supported: ["20.3.0"] } },
            timeout: { [READ]: { supported: ["17.3.0"] } },
        },
        Blob: {
            [READ]: { supported: ["18.0.0"] },
        },
        BroadcastChannel: {
            [READ]: { supported: ["15.4.0"] },
        },
        ByteLengthQueuingStrategy: {
            [READ]: { supported: ["18.0.0"] },
        },
        CompressionStream: {
            [READ]: { supported: ["18.0.0"] },
        },
        CountQueuingStrategy: {
            [READ]: { supported: ["18.0.0"] },
        },
        Crypto: {
            [READ]: { supported: ["19.0.0"] },
        },
        CryptoKey: {
            [READ]: { supported: ["15.0.0"] },
        },
        CustomEvent: {
            [READ]: { supported: ["19.0.0"] },
        },
        DOMException: {
            [READ]: { supported: ["17.0.0"] },
        },
        DecompressionStream: {
            [READ]: { supported: ["18.0.0"] },
        },
        Event: {
            [READ]: { supported: ["14.5.0"] },
        },
        EventTarget: {
            [READ]: { supported: ["14.5.0"] },
        },
        FormData: {
            [READ]: { supported: ["18.0.0"] },
        },
        Headers: {
            [READ]: { supported: ["18.0.0"] },
        },
        MessageChannel: {
            [READ]: { supported: ["15.0.0"] },
        },
        MessageEvent: {
            [READ]: { supported: ["15.0.0"] },
        },
        MessagePort: {
            [READ]: { supported: ["14.7.0"] },
        },
        Performance: {
            [READ]: { supported: ["8.5.0"] },
        },
        PerformanceEntry: {
            [READ]: { supported: ["8.5.0"] },
        },
        PerformanceMark: {
            [READ]: { supported: ["8.5.0"] },
        },
        PerformanceMeasure: {
            [READ]: { supported: ["8.5.0"] },
        },
        PerformanceObserver: {
            [READ]: { supported: ["8.5.0"] },
            supportedEntryTypes: { [READ]: { supported: ["8.5.0"] } },
        },
        PerformanceObserverEntryList: {
            [READ]: { supported: ["8.5.0"] },
        },
        ReadableByteStreamController: {
            [READ]: { supported: ["18.0.0"] },
        },
        ReadableStream: {
            [READ]: { supported: ["18.0.0"] },
            from: { [READ]: { supported: ["20.6.0"] } },
        },
        ReadableStreamBYOBReader: {
            [READ]: { supported: ["18.0.0"] },
        },
        ReadableStreamBYOBRequest: {
            [READ]: { supported: ["18.0.0"] },
        },
        ReadableStreamDefaultController: {
            [READ]: { supported: ["18.0.0"] },
        },
        ReadableStreamDefaultReader: {
            [READ]: { supported: ["18.0.0"] },
        },
        Request: {
            [READ]: { supported: ["18.0.0"] },
        },
        Response: {
            [READ]: { supported: ["18.0.0"] },
        },
        SubtleCrypto: {
            [READ]: { supported: ["15.0.0"] },
        },
        TextDecoder: {
            [READ]: { supported: ["11.0.0"] },
        },
        TextDecoderStream: {
            [READ]: { supported: ["18.0.0"] },
        },
        TextEncoder: {
            [READ]: { supported: ["11.0.0"] },
        },
        TextEncoderStream: {
            [READ]: { supported: ["18.0.0"] },
        },
        TransformStream: {
            [READ]: { supported: ["18.0.0"] },
        },
        TransformStreamDefaultController: {
            [READ]: { supported: ["16.5.0"] },
        },
        URL: {
            [READ]: { supported: ["10.0.0"] },
            canParse: { [READ]: { supported: ["19.9.0"] } },
            createObjectURL: { [READ]: { supported: ["16.7.0"] } },
            revokeObjectURL: { [READ]: { supported: ["16.7.0"] } },
        },
        URLSearchParams: {
            [READ]: { supported: ["10.0.0"] },
        },
        Worker: {
            [READ]: { supported: ["12.17.0"] },
        },
        WritableStream: {
            [READ]: { supported: ["18.0.0"] },
        },
        WritableStreamDefaultController: {
            [READ]: { supported: ["18.0.0"] },
        },
        WritableStreamDefaultWriter: {
            [READ]: { supported: ["18.0.0"] },
        },
        atob: {
            [READ]: { supported: ["16.0.0"] },
        },
        btoa: {
            [READ]: { supported: ["16.0.0"] },
        },
        clearInterval: {
            [READ]: { supported: ["0.10.0"] },
        },
        clearTimeout: {
            [READ]: { supported: ["0.10.0"] },
        },
        console: {
            [READ]: { supported: ["0.10.0"] },
            assert: { [READ]: { supported: ["10.0.0"] } },
            clear: { [READ]: { supported: ["8.3.0"] } },
            countReset: { [READ]: { supported: ["8.3.0"] } },
            count: { [READ]: { supported: ["8.3.0"] } },
            debug: { [READ]: { supported: ["8.0.0"] } },
            dir: { [READ]: { supported: ["0.10.0"] } },
            dirxml: { [READ]: { supported: ["9.3.0"] } },
            error: { [READ]: { supported: ["0.10.0"] } },
            groupCollapsed: { [READ]: { supported: ["8.5.0"] } },
            groupEnd: { [READ]: { supported: ["8.5.0"] } },
            group: { [READ]: { supported: ["8.5.0"] } },
            info: { [READ]: { supported: ["0.10.0"] } },
            log: { [READ]: { supported: ["0.10.0"] } },
            table: { [READ]: { supported: ["10.0.0"] } },
            timeEnd: { [READ]: { supported: ["0.10.0"] } },
            timeLog: { [READ]: { supported: ["10.7.0"] } },
            time: { [READ]: { supported: ["0.10.0"] } },
            trace: { [READ]: { supported: ["0.10.0"] } },
            warn: { [READ]: { supported: ["0.10.0"] } },
        },
        fetch: {
            [READ]: { supported: ["18.0.0"] },
        },
        setInterval: {
            [READ]: { supported: ["0.10.0"] },
        },
        setTimeout: {
            [READ]: { supported: ["0.10.0"] },
        },
        structuredClone: {
            [READ]: { supported: ["17.0.0"] },
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
