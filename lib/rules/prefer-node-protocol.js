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

        return {
            Literal(node) {
                if (!isSourceForImportOrExport(node)) {
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
