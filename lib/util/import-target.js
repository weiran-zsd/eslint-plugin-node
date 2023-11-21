/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const { resolve } = require("path")
const isBuiltin = require("is-builtin-module")
const resolver = require("enhanced-resolve")

/**
 * @typedef {Object} Options
 * @property {string[]} [extensions]
 * @property {string[]} [paths]
 * @property {string} basedir
 */
/**
 * @typedef { 'unknown' | 'relative' | 'absolute' | 'node' | 'npm' | 'http' } ModuleType
 * @typedef { 'import' | 'require' | 'type' } ModuleStyle
 */

/**
 * Resolve the given id to file paths.
 * @param {string} id The id to resolve.
 * @param {Options} options The options of node-resolve module.
 * @param {ModuleType} moduleType - whether the target was require-ed or imported
 * @param {ModuleStyle} moduleStyle - whether the target was require-ed or imported
 * @returns {string | null} The resolved path.
 */
function getFilePath(id, options, moduleType, moduleStyle) {
    const conditionNames = ["node", "require"]
    const { extensions } = options
    const mainFields = []
    const mainFiles = []

    if (moduleStyle === "import") {
        conditionNames.push("import")
    }

    if (moduleStyle === "type") {
        conditionNames.push("import", "types")
    }

    if (moduleStyle === "require" || moduleType === "npm") {
        mainFields.push("main")
        mainFiles.push("index")
    }

    const requireResolve = resolver.create.sync({
        conditionNames,
        extensions,
        mainFields,
        mainFiles,
    })

    const directories = Array.isArray(options.paths)
        ? [...options.paths, options.basedir]
        : [options.basedir]

    for (const directory of directories) {
        try {
            const baseDir = resolve(process.cwd(), directory)
            return requireResolve(baseDir, id)
        } catch {
            continue
        }
    }

    if (moduleType === "absolute" || moduleType === "relative") {
        return resolve(options.basedir, id)
    }

    return null
}

function trimAfter(string, matcher, count = 1) {
    return string.split(matcher).slice(0, count).join(matcher)
}

/**
 * Information of an import target.
 */
module.exports = class ImportTarget {
    /**
     * Initialize this instance.
     * @param {import('eslint').Rule.Node} node - The node of a `require()` or a module declaraiton.
     * @param {string} name - The name of an import target.
     * @param {Options} options - The options of `node-resolve` module.
     * @param {'import' | 'require'} moduleType - whether the target was require-ed or imported
     */
    constructor(node, name, options, moduleType) {
        /**
         * The node of a `require()` or a module declaraiton.
         * @type {import('eslint').Rule.Node}
         */
        this.node = node

        /**
         * The name of this import target.
         * @type {string}
         */
        this.name = name

        /**
         * The import target options.
         * @type {Options}
         */
        this.options = options

        /**
         * What type of module are we looking for?
         * @type {ModuleType}
         */
        this.moduleType = this.getModuleType()

        /**
         * What import style are we using
         * @type {ModuleStyle}
         */
        this.moduleStyle = this.getModuleStyle(moduleType)

        /**
         * The module name of this import target.
         * If the target is a relative path then this is `null`.
         * @type {string | null}
         */
        this.moduleName = this.getModuleName()

        /**
         * The full path of this import target.
         * If the target is a module and it does not exist then this is `null`.
         * @type {string | null}
         */
        this.filePath = getFilePath(
            name,
            options,
            this.moduleType,
            this.moduleStyle
        )
    }

    /**
     * What type of module is this
     * @returns {ModuleType}
     */
    getModuleType() {
        if (/^\.{1,2}([\\/]|$)/.test(this.name)) {
            return "relative"
        }

        if (/^[\\/]/.test(this.name)) {
            return "absolute"
        }

        if (isBuiltin(this.name)) {
            return "node"
        }

        if (/^(@[\w~-][\w.~-]*\/)?[\w~-][\w.~-]*/.test(this.name)) {
            return "npm"
        }

        if (/^https?:\/\//.test(this.name)) {
            return "http"
        }

        return "unknown"
    }

    /**
     * What module import style is used
     * @param {'import' | 'require'} fallback
     * @returns {ModuleStyle}
     */
    getModuleStyle(fallback) {
        /** @type {import('eslint').Rule.Node} */
        let node = { parent: this.node }

        do {
            node = node.parent

            // `const {} = require('')`
            if (
                node.type === "CallExpression" &&
                node.callee.name === "require"
            ) {
                return "require"
            }

            // `import type {} from '';`
            if (
                node.type === "ImportDeclaration" &&
                node.importKind === "type"
            ) {
                return "type"
            }

            // `import {} from '';`
            if (
                node.type === "ImportDeclaration" &&
                node.importKind === "value"
            ) {
                return "import"
            }
        } while (node.parent)

        return fallback
    }

    /**
     * Get the node or npm module name
     * @returns {string}
     */
    getModuleName() {
        if (this.moduleType === "relative") return

        if (this.moduleType === "npm") {
            if (this.name.startsWith("@")) {
                return trimAfter(this.name, "/", 2)
            }

            return trimAfter(this.name, "/")
        }

        if (this.moduleType === "node") {
            if (this.name.startsWith("node:")) {
                return trimAfter(this.name.slice(5), "/")
            }

            return trimAfter(this.name, "/")
        }
    }
}
