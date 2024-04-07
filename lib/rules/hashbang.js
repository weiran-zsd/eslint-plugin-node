/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const path = require("path")
const matcher = require("ignore").default

const getConvertPath = require("../util/get-convert-path")
const { getPackageJson } = require("../util/get-package-json")
const getNpmignore = require("../util/get-npmignore")
const { isBinFile } = require("../util/is-bin-file")

const NODE_SHEBANG = "#!/usr/bin/env node\n"
const SHEBANG_PATTERN = /^(#!.+?)?(\r)?\n/u
const NODE_SHEBANG_PATTERN =
    /^#!\/usr\/bin\/env(?: -\S+)*(?: [^\s=-]+=\S+)* node(?: [^\r\n]+?)?\n/u

/**
 * Gets the shebang line (includes a line ending) from a given code.
 *
 * @param {import('eslint').SourceCode} sourceCode - A source code object to check.
 * @returns {{length: number, bom: boolean, shebang: string, cr: boolean}}
 *      shebang's information.
 *      `retv.shebang` is an empty string if shebang doesn't exist.
 */
function getShebangInfo(sourceCode) {
    const m = SHEBANG_PATTERN.exec(sourceCode.text)

    return {
        bom: sourceCode.hasBOM,
        cr: Boolean(m && m[2]),
        length: (m && m[0].length) || 0,
        shebang: (m && m[1] && `${m[1]}\n`) || "",
    }
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        docs: {
            description: "require correct usage of hashbang",
            recommended: true,
            url: "https://github.com/eslint-community/eslint-plugin-n/blob/HEAD/docs/rules/hashbang.md",
        },
        type: "problem",
        fixable: "code",
        schema: [
            {
                type: "object",
                properties: {
                    convertPath: getConvertPath.schema,
                    ignoreUnpublished: { type: "boolean" },
                    additionalExecutables: {
                        type: "array",
                        items: { type: "string" },
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            unexpectedBOM: "This file must not have Unicode BOM.",
            expectedLF: "This file must have Unix linebreaks (LF).",
            expectedHashbangNode:
                'This file needs shebang "#!/usr/bin/env node".',
            expectedHashbang: "This file needs no shebang.",
        },
    },
    create(context) {
        const sourceCode = context.sourceCode ?? context.getSourceCode() // TODO: just use context.sourceCode when dropping eslint < v9
        const filePath = context.filename ?? context.getFilename()
        if (filePath === "<input>") {
            return {}
        }

        const packageJson = getPackageJson(filePath)
        if (typeof packageJson?.filePath !== "string") {
            return {}
        }

        const packageDirectory = path.dirname(packageJson.filePath)

        const originalAbsolutePath = path.resolve(filePath)
        const originalRelativePath = path
            .relative(packageDirectory, originalAbsolutePath)
            .replace(/\\/gu, "/")

        const convertedRelativePath =
            getConvertPath(context)(originalRelativePath)
        const convertedAbsolutePath = path.resolve(
            packageDirectory,
            convertedRelativePath
        )

        /** @type {{ additionalExecutables: string[] }} */
        const { additionalExecutables = [] } = context.options?.[0] ?? {}

        const executable = matcher()
        executable.add(additionalExecutables)
        const isExecutable = executable.test(convertedRelativePath)

        if (
            (additionalExecutables.length === 0 ||
                isExecutable.ignored === false) &&
            context.options?.[0]?.ignoreUnpublished === true
        ) {
            const npmignore = getNpmignore(convertedAbsolutePath)

            if (npmignore.match(convertedRelativePath)) {
                return {}
            }
        }

        const needsShebang =
            isExecutable.ignored === true ||
            isBinFile(convertedAbsolutePath, packageJson?.bin, packageDirectory)
        const info = getShebangInfo(sourceCode)

        return {
            Program() {
                const loc = {
                    start: { line: 1, column: 0 },
                    end: {
                        line: 1,
                        column: sourceCode.lines.at(0)?.length ?? 0,
                    },
                }

                if (
                    needsShebang
                        ? NODE_SHEBANG_PATTERN.test(info.shebang)
                        : !info.shebang
                ) {
                    // Good the shebang target.
                    // Checks BOM and \r.
                    if (needsShebang && info.bom) {
                        context.report({
                            loc,
                            messageId: "unexpectedBOM",
                            fix(fixer) {
                                return fixer.removeRange([-1, 0])
                            },
                        })
                    }
                    if (needsShebang && info.cr) {
                        context.report({
                            loc,
                            messageId: "expectedLF",
                            fix(fixer) {
                                const index = sourceCode.text.indexOf("\r")
                                return fixer.removeRange([index, index + 1])
                            },
                        })
                    }
                } else if (needsShebang) {
                    // Shebang is lacking.
                    context.report({
                        loc,
                        messageId: "expectedHashbangNode",
                        fix(fixer) {
                            return fixer.replaceTextRange(
                                [-1, info.length],
                                NODE_SHEBANG
                            )
                        },
                    })
                } else {
                    // Shebang is extra.
                    context.report({
                        loc,
                        messageId: "expectedHashbang",
                        fix(fixer) {
                            return fixer.removeRange([0, info.length])
                        },
                    })
                }
            },
        }
    },
}
