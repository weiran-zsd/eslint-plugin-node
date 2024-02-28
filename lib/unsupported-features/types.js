"use strict"

/**
 * @typedef {Object} SupportInfo
 * @property {string[]} experimental  The node versions in which experimental support was added
 * @property {string[]} supported     The node versions in which stable support was added
 * @property {string[]} deprecated    The node versions in which support was removed
 */
/**
 * @typedef {{
 *   [key: readonly unique symbol]: SupportInfo | undefined;
 *   [key: string]: SupportVersionTree | undefined;
 * }} SupportVersionTree
 */

module.exports = {}
