"use strict"

/**
 * @param {import('typescript').Type | null} type
 * @returns {string | null}
 */
module.exports = function getFullTypeName(type) {
    if (type === null) {
        return null
    }

    /**
     * @type {string[]}
     */
    let nameParts = []
    let currentSymbol = type.getSymbol()
    while (currentSymbol !== undefined) {
        nameParts.unshift(currentSymbol.getName())
        currentSymbol =
            /** @type {import('typescript').Symbol & {parent: import('typescript').Symbol | undefined}} */ (
                currentSymbol
            ).parent
    }

    if (nameParts.length === 0) {
        return null
    }

    return nameParts.join(".")
}
