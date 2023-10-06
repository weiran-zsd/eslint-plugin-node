/**
 * @author Matt DuVall<http://mattduvall.com/>
 * See LICENSE file in root directory for full license.
 */
"use strict"

const { builtinModules } = require("node:module")

const modules = builtinModules
    .filter(name => name.startsWith("_") === false)
    .flatMap(name => [name, `node:${name}`])

/*
 * Build functional imports
 * const fs = require('node:fs');
 * const fs = await import('node:fs');
 */
const RequireDeclareExpressions = modules.map(name =>
    [
        `VariableDeclarator`,
        `[init.callee.name="require"]`,
        `[init.arguments.0.value="${name}"]`,
        `[id.type="Identifier"]`,
    ].join("")
)
const BabelImportDeclareExpressions = modules.map(name =>
    [
        `VariableDeclarator`,
        `[init.argument.callee.type="Import"]`,
        `[init.argument.arguments.0.value="${name}"]`,
        `[id.type="Identifier"]`,
    ].join("")
)
const EspreeImportDeclareExpressions = modules.map(name =>
    [
        `VariableDeclarator`,
        `[init.argument.type="ImportExpression"]`,
        `[init.argument.source.value="${name}"]`,
        `[id.type="Identifier"]`,
    ].join("")
)

/*
 * Build ns/default imports
 * import fs from 'node:fs';
 * import * as fs from 'node:fs';
 */
const ImportDefaultSpecifiers = modules.map(
    name => `ImportDeclaration[source.value="${name}"] ImportDefaultSpecifier`
)
const ImportNamespaceSpecifiers = modules.map(
    name => `ImportDeclaration[source.value="${name}"] ImportNamespaceSpecifier`
)

/*
 * Build aliasable imports
 * import { readFileSync } from 'node:fs';
 * import { readFileSync as readFile } from 'node:fs';
 */
const ImportAliasSpecifiers = modules.map(
    name =>
        `ImportDeclaration[source.value="${name}"] ImportSpecifier[imported.name=/Sync$/]`
)

/*
 * Build functional deconstructed imports
 * const { readFileSync } = require('node:fs');
 * const { readFileSync: readFile } = require('node:fs');
 * const { readFileSync } = await import('node:fs');
 * const { readFileSync: readFile } = await import('node:fs');
 */
const RequireDeconstructExpressions = modules.map(name =>
    [
        `VariableDeclarator`,
        `[init.callee.name="require"]`,
        `[init.arguments.0.value="${name}"]`,
        `[id.type="ObjectPattern"]`,
    ].join("")
)
const BabelImportDeconstructExpressions = modules.map(name =>
    [
        `VariableDeclarator`,
        `[init.argument.callee.type="Import"]`,
        `[init.argument.arguments.0.value="${name}"]`,
        `[id.type="ObjectPattern"]`,
    ].join("")
)
const EspreeImportDeconstructExpressions = modules.map(name =>
    [
        `VariableDeclarator`,
        `[init.argument.type="ImportExpression"]`,
        `[init.argument.source.value="${name}"]`,
        `[id.type="ObjectPattern"]`,
    ].join("")
)

const ModuleDeclarations = [
    RequireDeclareExpressions,
    BabelImportDeclareExpressions,
    EspreeImportDeclareExpressions,
    ImportDefaultSpecifiers,
    ImportNamespaceSpecifiers,
].flat()

const AliasDeclarations = [ImportAliasSpecifiers].flat()

const DeconstructDeclarations = [
    RequireDeconstructExpressions,
    BabelImportDeconstructExpressions,
    EspreeImportDeconstructExpressions,
].flat()

/**
 * @param {import('eslint').Scope.Scope} scope The scope to check
 * @returns {Boolean}
 */
function isFunctionScope(scope) {
    while (scope != null) {
        if (scope.type === "function") {
            return true
        }

        scope = scope.upper
    }

    return false
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "disallow synchronous methods",
            category: "Stylistic Issues",
            recommended: false,
            url: "https://github.com/eslint-community/eslint-plugin-n/blob/HEAD/docs/rules/no-sync.md",
        },
        fixable: null,
        schema: [
            {
                type: "object",
                properties: {
                    allowAtRootLevel: {
                        type: "boolean",
                        default: false,
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            noSyncMember: "Unexpected sync method: '{{importName}}'.",
            noSyncAlias:
                "Unexpected sync method: '{{aliasName}}' ({{importName}}).",
        },
    },

    create(context) {
        const [options] = context.options
        const syncRegex = /Sync$/u

        return {
            [ModuleDeclarations](node) {
                const variables =
                    context.sourceCode?.getDeclaredVariables?.(node) ??
                    context.getDeclaredVariables?.(node)

                for (const variable of variables) {
                    for (const reference of variable.references) {
                        if (
                            options?.allowAtRootLevel === true &&
                            isFunctionScope(reference.from) === false
                        ) {
                            continue
                        }

                        /** @type {import('eslint').Rule.Node} */
                        const memberExpression = reference.identifier.parent
                        if (
                            memberExpression.type !== "MemberExpression" ||
                            syncRegex.test(memberExpression.property.name) ===
                                false
                        ) {
                            continue
                        }

                        context.report({
                            node: memberExpression.property,
                            messageId: "noSyncMember",
                            data: {
                                importName: memberExpression.property.name,
                            },
                        })
                    }
                }
            },
            [AliasDeclarations](node) {
                const variables =
                    context.sourceCode?.getDeclaredVariables?.(node) ??
                    context.getDeclaredVariables?.(node)

                for (const variable of variables) {
                    for (const reference of variable.references ?? []) {
                        if (
                            options?.allowAtRootLevel === true &&
                            isFunctionScope(reference.from) === false
                        ) {
                            continue
                        }

                        if (node.imported.name === node.local.name) {
                            context.report({
                                node: reference.identifier,
                                messageId: "noSyncMember",
                                data: { importName: node.imported.name },
                            })
                        } else {
                            context.report({
                                node: reference.identifier,
                                messageId: "noSyncAlias",
                                data: {
                                    importName: node.imported.name,
                                    aliasName: variables.at(0)?.name,
                                },
                            })
                        }
                    }
                }
            },
            [DeconstructDeclarations](node) {
                const variables =
                    context.sourceCode?.getDeclaredVariables?.(node) ??
                    context.getDeclaredVariables?.(node)

                for (const variable of variables) {
                    const [identifier] = variable.identifiers
                    const importName = identifier.parent.key.name

                    for (const reference of variable?.references ?? []) {
                        if (
                            options?.allowAtRootLevel === true &&
                            isFunctionScope(reference.from) === false
                        ) {
                            continue
                        }

                        if (
                            reference.identifier.parent.type !==
                            "CallExpression"
                        ) {
                            continue
                        }

                        if (importName === variable.name) {
                            context.report({
                                node: reference.identifier,
                                messageId: "noSyncMember",
                                data: { importName: importName },
                            })
                        } else {
                            context.report({
                                node: reference.identifier,
                                messageId: "noSyncAlias",
                                data: {
                                    importName: importName,
                                    aliasName: variable.name,
                                },
                            })
                        }
                    }
                }
            },
        }
    },
}
