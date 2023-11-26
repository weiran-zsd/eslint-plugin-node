/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

require("util").inspect.defaultOptions.depth = null

const { resolve } = require("path")
const isBuiltin = require("is-builtin-module")
const resolver = require("enhanced-resolve")

const isTypescript = require("./is-typescript")
const { getTSConfigForContext } = require("./get-tsconfig.js")
const getTypescriptExtensionMap = require("./get-typescript-extension-map")

function removeTrailWildcard(input) {
    if (Array.isArray(input)) {
        return [...input].map(removeTrailWildcard)
    }

    return input.replace(/[/\\*]+$/, "")
}

/**
 * Initialize this instance.
 * @param {import('eslint').Rule.RuleContext} context - The context for the import origin.
 * @returns {import('enhanced-resolve').ResolveOptions['alias'] | undefined}
 */
function getTSConfigAliases(context) {
    const tsConfig = getTSConfigForContext(context)

    const paths = tsConfig?.config?.compilerOptions?.paths

    if (paths == null) {
        return
    }

    return Object.entries(paths).map(([name, alias]) => ({
        name: removeTrailWildcard(name),
        alias: removeTrailWildcard(alias),
    }))
}

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

function trimAfter(string, matcher, count = 1) {
    return string.split(matcher).slice(0, count).join(matcher)
}

/**
 * Information of an import target.
 */
module.exports = class ImportTarget {
    /**
     * Initialize this instance.
     * @param {import('eslint').Rule.RuleContext} context - The context for the import origin.
     * @param {import('eslint').Rule.Node} node - The node of a `require()` or a module declaraiton.
     * @param {string} name - The name of an import target.
     * @param {Options} options - The options of `node-resolve` module.
     * @param {'import' | 'require'} moduleType - whether the target was require-ed or imported
     */
    constructor(context, node, name, options, moduleType) {
        /**
         * The context for the import origin
         * @type {import('eslint').Rule.Node}
         */
        this.context = context

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
        this.filePath = this.getFilePath()
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

    getPaths() {
        if (Array.isArray(this.options.paths)) {
            return [...this.options.paths, this.options.basedir]
        }

        return [this.options.basedir]
    }

    /**
     * Resolve the given id to file paths.
     * @returns {string | null} The resolved path.
     */
    getFilePath() {
        const conditionNames = ["node", "require"]
        const { extensions } = this.options
        const mainFields = []
        const mainFiles = []

        if (this.moduleStyle === "import") {
            conditionNames.push("import")
        }

        if (this.moduleStyle === "type") {
            conditionNames.push("import", "types")
        }

        if (
            this.moduleStyle === "require" ||
            this.moduleType === "npm" ||
            this.moduleType === "node"
        ) {
            mainFields.push("main")
            mainFiles.push("index")
        }

        let alias = undefined
        let extensionAlias = undefined

        if (isTypescript(this.context)) {
            alias = getTSConfigAliases(this.context)
            extensionAlias = getTypescriptExtensionMap(this.context).backward
        }

        const requireResolve = resolver.create.sync({
            conditionNames,
            extensions,
            mainFields,
            mainFiles,

            extensionAlias,
            alias,
        })

        for (const directory of this.getPaths()) {
            try {
                const baseDir = resolve(process.cwd(), directory)
                return requireResolve(baseDir, this.name)
            } catch {
                continue
            }
        }

        if (this.moduleType === "absolute" || this.moduleType === "relative") {
            return resolve(this.options.basedir, this.name)
        }

        return null
    }
}
