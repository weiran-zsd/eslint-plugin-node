"use strict"

const ts = (() => {
    try {
        // eslint-disable-next-line n/no-unpublished-require
        return require("typescript")
    } catch {
        return null
    }
})()

const getTypeOfNode = require("./get-type-of-node")

/**
 * @param {import('estree').Node & {parent?: import('estree').Node}} node
 * @param {import('@typescript-eslint/parser').ParserServices | null} parserServices
 * @returns {string | null}
 */
module.exports = function getNodeScopedName(node, parserServices) {
    if (ts === null || parserServices === null) {
        return null
    }

    if (parserServices !== null) {
        if (node.parent?.type === "MemberExpression") {
            // Find the root node of the expression
            return getNodeScopedName(node.parent, parserServices)
        }
    }

    return getNodeScopedNameHelper(node, parserServices)
}

/**
 * @param {import('estree').Node & {parent?: import('estree').Node}} node
 * @param {import('@typescript-eslint/parser').ParserServices} parserServices
 * @returns {string | null}
 */
function getNodeScopedNameHelper(node, parserServices) {
    if (node.type === "MemberExpression") {
        const objectType = getTypeOfNode(node.object, parserServices)
        const tsNode = objectType?.symbol.valueDeclaration

        if (tsNode === undefined) {
            return null
        }

        // TODO: handle more cases
        const scopeName =
            tsNode.kind ===
            /** @type {import('typescript')} */ (ts).SyntaxKind
                .VariableDeclaration
                ? /** @type {import('typescript').VariableDeclaration} */ (
                      tsNode
                  ).name.getText()
                : null

        if (scopeName === null) {
            return null
        }

        const localName = getNodeScopedNameHelper(node.property, parserServices)

        if (localName === null) {
            return null
        }

        return `${scopeName}.${localName}`
    }

    if (node.type === "Identifier") {
        return node.name
    }

    return null
}
