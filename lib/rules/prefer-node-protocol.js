/**
 * @author Yusuke Iinuma
 * See LICENSE file in root directory for full license.
 */
"use strict"

const isBuiltinModule = require("is-builtin-module")
const messageId = "preferNodeProtocol"

module.exports = {
    meta: {
        docs: {
            description:
                "enforce using the `node:` protocol when importing Node.js builtin modules.",
            recommended: true,
            url: "https://github.com/eslint-community/eslint-plugin-n/blob/HEAD/docs/rules/prefer-node-protocol.md",
        },
        fixable: "code",
        messages: {
            [messageId]: "Prefer `node:{{moduleName}}` over `{{moduleName}}`.",
        },
        schema: [],
        type: "suggestion",
    },
    create(context) {
        function isSourceForImportOrExport(node) {
            return (
                (node.parent.type === "ImportDeclaration" ||
                    node.parent.type === "ExportNamedDeclaration" ||
                    node.parent.type === "ImportExpression") &&
                node.parent.source === node
            )
        }

        function isCallExpression(node, { name, argumentsLength }) {
            if (node?.type !== "CallExpression") {
                return false
            }

            if (node.optional) {
                return false
            }

            if (node.arguments.length !== argumentsLength) {
                return false
            }

            if (
                node.callee.type !== "Identifier" ||
                node.callee.name !== name
            ) {
                return false
            }

            return true
        }

        function isStringLiteral(node) {
            return node?.type === "Literal" && typeof node.type === "string"
        }

        function isStaticRequire(node) {
            return (
                isCallExpression(node, {
                    name: "require",
                    argumentsLength: 1,
                }) && isStringLiteral(node.arguments[0])
            )
        }

        return {
            Literal(node) {
                if (
                    !(
                        isSourceForImportOrExport(node) ||
                        (isStaticRequire(node.parent) &&
                            node.parent.arguments[0] === node)
                    )
                ) {
                    return
                }

                const { value } = node

                if (
                    typeof value !== "string" ||
                    value.startsWith("node:") ||
                    !isBuiltinModule(value) ||
                    !isBuiltinModule(`node:${value}`)
                ) {
                    return
                }

                context.report({
                    node,
                    messageId,
                    fix(fixer) {
                        const firstCharacterIndex = node.range[0] + 1
                        return fixer.replaceTextRange(
                            [firstCharacterIndex, firstCharacterIndex],
                            "node:"
                        )
                    },
                })
            },
        }
    },
}
