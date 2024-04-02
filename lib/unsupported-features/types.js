"use strict"

/**
 * @typedef {(
 *   | import("@eslint-community/eslint-utils").READ
 *   | import("@eslint-community/eslint-utils").CALL
 *   | import("@eslint-community/eslint-utils").CONSTRUCT
 * )} UTIL_SYMBOL
 */

/**
 * @typedef SupportInfo
 * @property {string[]} [experimental]  The node versions in which experimental support was added
 * @property {string[]} [supported]     The node versions in which stable support was added
 * @property {string[]} [deprecated]    The node versions in which support was removed
 */

/**
 * @typedef {import('@eslint-community/eslint-utils').TraceMap<SupportInfo>} SupportVersionTree
 */
/**
 * @typedef SupportVersionTraceMap
 * @property {SupportVersionTree} globals
 * @property {SupportVersionTree} modules
 */

module.exports = {}
