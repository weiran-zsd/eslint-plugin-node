/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const path = require("path")
const exists = require("./exists")
const getAllowModules = require("./get-allow-modules")
const isTypescript = require("./is-typescript")
const mapTypescriptExtension = require("../util/map-typescript-extension")

/**
 * Reports a missing file from ImportTarget
 * @param {RuleContext} context - A context to report.
 * @param {import('../util/import-target.js')} target - A list of target information to check.
 * @returns {void}
 */
function markMissing(context, target) {
    context.report({
        node: target.node,
        loc: target.node.loc,
        messageId: "notFound",
        data: target,
    })
}

/**
 * Checks whether or not each requirement target exists.
 *
 * It looks up the target according to the logic of Node.js.
 * See Also: https://nodejs.org/api/modules.html
 *
 * @param {RuleContext} context - A context to report.
 * @param {import('../util/import-target.js')[]} targets - A list of target information to check.
 * @returns {void}
 */
exports.checkExistence = function checkExistence(context, targets) {
    const allowed = new Set(getAllowModules(context))

    for (const target of targets) {
        if (
            target.moduleName != null &&
            !allowed.has(target.moduleName) &&
            target.filePath == null
        ) {
            markMissing(context, target)
            continue
        }

        if (target.moduleName != null) {
            continue
        }

        let missingFile =
            target.filePath == null ? false : !exists(target.filePath)

        if (missingFile && isTypescript(context)) {
            const parsed = path.parse(target.filePath)
            const pathWithoutExt = path.resolve(parsed.dir, parsed.name)

            const reversedExts = mapTypescriptExtension(
                context,
                target.filePath,
                parsed.ext,
                true
            )
            const reversedPaths = reversedExts.map(
                reversedExt => pathWithoutExt + reversedExt
            )
            missingFile = reversedPaths.every(
                reversedPath =>
                    target.moduleName == null && !exists(reversedPath)
            )
        }

        if (missingFile) {
            markMissing(context, target)
        }
    }
}

exports.messages = {
    notFound: '"{{name}}" is not found.',
}
