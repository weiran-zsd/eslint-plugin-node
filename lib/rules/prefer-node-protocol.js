/**
 * @author Yusuke Iinuma
 * See LICENSE file in root directory for full license.
 */
"use strict"

const isBuiltinModule = require("is-builtin-module")
const getConfiguredNodeVersion = require("../util/get-configured-node-version")
const getSemverRange = require("../util/get-semver-range")
const visitImport = require("../util/visit-import")
const visitRequire = require("../util/visit-require")
const mergeVisitorsInPlace = require("../util/merge-visitors-in-place")

const messageId = "preferNodeProtocol"

module.exports = {
    meta: {
        docs: {
            description:
                "enforce using the `node:` protocol when importing Node.js builtin modules.",
            recommended: false,
            url: "https://github.com/eslint-community/eslint-plugin-n/blob/HEAD/docs/rules/prefer-node-protocol.md",
        },
        fixable: "code",
        messages: {
            [messageId]: "Prefer `node:{{moduleName}}` over `{{moduleName}}`.",
        },
        schema: [
            {
                type: "object",
                properties: {
                    version: getConfiguredNodeVersion.schema,
                },
                additionalProperties: false,
            },
        ],
        type: "suggestion",
    },
    create(context) {
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

        function isEnablingThisRule(context, moduleStyle) {
            const version = getConfiguredNodeVersion(context)

            const supportedVersionForEsm = "^12.20.0 || >= 14.13.1"
            // Only check Node.js version because this rule is meaningless if configured Node.js version doesn't match semver range.
            if (!version.intersects(getSemverRange(supportedVersionForEsm))) {
                return false
            }

            const supportedVersionForCjs = "^14.18.0 || >= 16.0.0"
            // Only check when using `require`
            if (
                moduleStyle === "require" &&
                !version.intersects(getSemverRange(supportedVersionForCjs))
            ) {
                return false
            }

            return true
        }

        const targets = []
        return [
            visitImport(context, { includeCore: true }, importTargets => {
                targets.push(...importTargets)
            }),
            visitRequire(context, { includeCore: true }, requireTargets => {
                targets.push(
                    ...requireTargets.filter(target =>
                        isStaticRequire(target.node.parent)
                    )
                )
            }),
            {
                "Program:exit"() {
                    for (const { node, moduleStyle } of targets) {
                        if (!isEnablingThisRule(context, moduleStyle)) {
                            continue
                        }

                        if (node.type === "TemplateLiteral") {
                            continue
                        }

                        const { value } = node
                        if (
                            typeof value !== "string" ||
                            value.startsWith("node:") ||
                            !isBuiltinModule(value) ||
                            !isBuiltinModule(`node:${value}`)
                        ) {
                            continue
                        }

                        context.report({
                            node,
                            messageId,
                            data: {
                                moduleName: value,
                            },
                            fix(fixer) {
                                const firstCharacterIndex = node.range[0] + 1
                                return fixer.replaceTextRange(
                                    [firstCharacterIndex, firstCharacterIndex],
                                    "node:"
                                )
                            },
                        })
                    }
                },
            },
        ].reduce(
            (mergedVisitor, thisVisitor) =>
                mergeVisitorsInPlace(mergedVisitor, thisVisitor),
            {}
        )
    },
}
