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
 * @typedef DeprecatedInfo
 * @property {string} since
 * @property {string|{ name: string, supported: string }[]|null} replacedBy
 */

/** @typedef {import('@eslint-community/eslint-utils').TraceMap<DeprecatedInfo>} DeprecatedInfoTraceMap */
/** @typedef {import('@eslint-community/eslint-utils').TraceMap<SupportInfo>} SupportVersionTraceMap */

/**
 * @typedef SupportVersionBuiltins
 * @property {SupportVersionTraceMap} globals
 * @property {SupportVersionTraceMap} modules
 */

module.exports = {}
