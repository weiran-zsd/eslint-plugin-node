"use strict"

/**
 * @typedef {(
 *   | import("@eslint-community/eslint-utils").READ
 *   | import("@eslint-community/eslint-utils").CALL
 *   | import("@eslint-community/eslint-utils").CONSTRUCT
 * )} UTIL_SYMBOL
 */

/**
 * @typedef {Object} SupportInfo
 * @property {string[]} [experimental]  The node versions in which experimental support was added
 * @property {string[]} [supported]     The node versions in which stable support was added
 * @property {string[]} [deprecated]    The node versions in which support was removed
 */
/**
 * @typedef {{ [key in UTIL_SYMBOL]?: SupportInfo } & { [key: string]: SupportVersionTree }} SupportVersionTree
 */

module.exports = {}
