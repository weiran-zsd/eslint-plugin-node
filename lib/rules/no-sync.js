/**
 * @author Matt DuVall<http://mattduvall.com/>
 * See LICENSE file in root directory for full license.
 */
"use strict"

const selectors = [
    // fs.readFileSync()
    // readFileSync.call(null, 'path')
    "CallExpression > MemberExpression.callee Identifier[name=/Sync$/]",
    // readFileSync()
    "CallExpression > Identifier[name=/Sync$/]",
]

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "disallow synchronous methods",
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
            noSync: "Unexpected sync method: '{{propertyName}}'.",
        },
    },

    create(context) {
        const options = context.options[0] ?? {}

        const selector = options.allowAtRootLevel
            ? selectors.map(selector => `:function ${selector}`)
            : selectors
        return {
            /**
             * @param {import('estree').Identifier & {parent: import('estree').Node}} node
             * @returns {void}
             */
            [selector.join(",")](node) {
                context.report({
                    node: node.parent,
                    messageId: "noSync",
                    data: {
                        propertyName: node.name,
                    },
                })
            },
        }
    },
}
