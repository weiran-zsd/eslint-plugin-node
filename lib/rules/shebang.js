/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const path = require("path")

const getConvertPath = require("../util/get-convert-path")
const getPackageJson = require("../util/get-package-json")
const getNpmignore = require("../util/get-npmignore")

const NODE_SHEBANG = "#!/usr/bin/env node\n"
const SHEBANG_PATTERN = /^(#!.+?)?(\r)?\n/u
const NODE_SHEBANG_PATTERN = /#!\/usr\/bin\/env node(?: [^\r\n]+?)?\n/u

function simulateNodeResolutionAlgorithm(filePath, binField) {
    const possibilities = [filePath]
    let newFilePath = filePath.replace(/\.js$/u, "")
    possibilities.push(newFilePath)
    newFilePath = newFilePath.replace(/[/\\]index$/u, "")
    possibilities.push(newFilePath)
    return possibilities.includes(binField)
}

/**
 * Checks whether or not a given path is a `bin` file.
 *
 * @param {string} filePath - A file path to check.
 * @param {string|object|undefined} binField - A value of the `bin` field of `package.json`.
 * @param {string} basedir - A directory path that `package.json` exists.
 * @returns {boolean} `true` if the file is a `bin` file.
 */
function isBinFile(filePath, binField, basedir) {
    if (!binField) {
        return false
    }
    if (typeof binField === "string") {
        return simulateNodeResolutionAlgorithm(
            filePath,
            path.resolve(basedir, binField)
        )
    }
    return Object.keys(binField).some(key =>
        simulateNodeResolutionAlgorithm(
            filePath,
            path.resolve(basedir, binField[key])
        )
    )
}

/**
 * Gets the shebang line (includes a line ending) from a given code.
 *
 * @param {SourceCode} sourceCode - A source code object to check.
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

module.exports = {
    meta: {
        docs: {
            description: "require correct usage of shebang",
            recommended: true,
            url: "https://github.com/eslint-community/eslint-plugin-n/blob/HEAD/docs/rules/shebang.md",
        },
        type: "problem",
        fixable: "code",
        schema: [
            {
                type: "object",
                properties: {
                    convertPath: getConvertPath.schema,
                    ignoreUnpublished: { type: "boolean" },
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

        const p = getPackageJson(filePath)
        if (!p) {
            return {}
        }

        const packageDirectory = path.dirname(p.filePath)

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

        if (context.options?.[0]?.ignoreUnpublished === true) {
            const npmignore = getNpmignore(convertedAbsolutePath)

            if (npmignore.match(convertedRelativePath)) {
                return {}
            }
        }

        const needsShebang = isBinFile(
            convertedAbsolutePath,
            p.bin,
            packageDirectory
        )
        const info = getShebangInfo(sourceCode)

        return {
            Program(node) {
                if (
                    needsShebang
                        ? NODE_SHEBANG_PATTERN.test(info.shebang)
                        : !info.shebang
                ) {
                    // Good the shebang target.
                    // Checks BOM and \r.
                    if (needsShebang && info.bom) {
                        context.report({
                            node,
                            messageId: "unexpectedBOM",
                            fix(fixer) {
                                return fixer.removeRange([-1, 0])
                            },
                        })
                    }
                    if (needsShebang && info.cr) {
                        context.report({
                            node,
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
                        node,
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
                        node,
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
