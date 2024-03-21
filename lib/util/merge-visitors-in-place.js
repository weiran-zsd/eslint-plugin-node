/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * See LICENSE file in root directory for full license.
 */
"use strict"

/**
 * Merge two visitors.
 * This function modifies `visitor1` directly to merge.
 * @param {import('eslint').Rule.RuleListener} visitor1 The visitor which is assigned.
 * @param {import('eslint').Rule.RuleListener} visitor2 The visitor which is assigning.
 * @returns {import('eslint').Rule.RuleListener} `visitor1`.
 */
module.exports = function mergeVisitorsInPlace(visitor1, visitor2) {
    for (const key of Object.keys(visitor2)) {
        const handler1 = visitor1[key]
        const handler2 = visitor2[key]

        if (typeof handler1 === "function") {
            // @ts-expect-error
            if (handler1._handlers) {
                // @ts-expect-error
                handler1._handlers.push(handler2)
            } else {
                const handlers = [handler1, handler2]
                // @ts-expect-error
                visitor1[key] = Object.assign(
                    // @ts-expect-error
                    dispatch.bind(null, handlers),
                    { _handlers: handlers }
                )
            }
        } else {
            visitor1[key] = handler2
        }
    }

    return visitor1
}

/**
 * Dispatch all given functions with a node.
 * @param {function[]} handlers The function list to call.
 * @param {Node} node The AST node to be handled.
 * @returns {void}
 */
function dispatch(handlers, node) {
    for (const h of handlers) {
        h(node)
    }
}
