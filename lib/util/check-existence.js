/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const path = require("path")
const exists = require("./exists")
const getAllowModules = require("./get-allow-modules")
const isTypescript = require("./is-typescript")
const { convertJsExtensionToTs } = require("../util/map-typescript-extension")

/**
 * Reports a missing file from ImportTarget
 * @param {import('eslint').Rule.RuleContext} context - A context to report.
 * @param {import('../util/import-target.js')} target - A list of target information to check.
 * @returns {void}
 */
function markMissing(context, target) {
    context.report({
        node: target.node,
        loc: /** @type {import('eslint').AST.SourceLocation} */ (
            target.node.loc
        ),
        messageId: "notFound",
        data: /** @type {Record<string, *>} */ (target),
    })
}

/**
 * Checks whether or not each requirement target exists.
 *
 * It looks up the target according to the logic of Node.js.
 * See Also: https://nodejs.org/api/modules.html
 *
 * @param {import('eslint').Rule.RuleContext} context - A context to report.
 * @param {import('../util/import-target.js')[]} targets - A list of target information to check.
 * @returns {void}
 */
exports.checkExistence = function checkExistence(context, targets) {
    const allowed = new Set(getAllowModules(context))

    target: for (const target of targets) {
        if (
            target.moduleName != null &&
            !allowed.has(target.moduleName) &&
            target.filePath == null
        ) {
            markMissing(context, target)
            continue
        }

        if (
            target.moduleName != null ||
            target.filePath == null ||
            exists(target.filePath)
        ) {
            continue
        }

        if (isTypescript(context) === false) {
            markMissing(context, target)
            continue
        }

        const parsed = path.parse(target.filePath)
        const pathWithoutExt = path.resolve(parsed.dir, parsed.name)

        const reversedExtensions = convertJsExtensionToTs(
            context,
            target.filePath,
            parsed.ext
        )

        for (const reversedExtension of reversedExtensions) {
            const reversedPath = pathWithoutExt + reversedExtension

            if (exists(reversedPath)) {
                continue target
            }
        }

        markMissing(context, target)
    }
}

exports.messages = {
    notFound: '"{{name}}" is not found.',
}
