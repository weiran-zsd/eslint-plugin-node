"use strict"

const assert = require("assert")
const path = require("path")
const { ESLint } = require("eslint")
const { gtEslintV8 } = require("../../helpers")

const originalCwd = process.cwd()

// this is needed as `recommended` config was cached
function clearRequireCache() {
    for (const k in require.cache) {
        delete require.cache[k]
    }
}

describe("node/recommended config", () => {
    ;(gtEslintV8 ? describe : describe.skip)("in CJS directory", () => {
        const root = path.resolve(__dirname, "../../fixtures/configs/cjs/")

        /** @type {Linter} */
        let linter = null

        beforeEach(() => {
            process.chdir(root)
            clearRequireCache()
            linter = new ESLint({
                baseConfig: { extends: "plugin:n/recommended" },
                useEslintrc: false,
            })
        })

        afterEach(() => {
            process.chdir(originalCwd)
        })

        it("*.js files should be a script.", async () => {
            const report = await linter.lintText("import 'foo'", {
                filePath: path.join(root, "test.js"),
            })

            assert.deepStrictEqual(report[0].messages, [
                {
                    column: 1,
                    fatal: true,
                    line: 1,
                    message:
                        "Parsing error: 'import' and 'export' may appear only with 'sourceType: module'",
                    ruleId: null,
                    nodeType: null,
                    severity: 2,
                },
            ])
        })

        it("*.cjs files should be a script.", async () => {
            const report = await linter.lintText("import 'foo'", {
                filePath: path.join(root, "test.cjs"),
            })

            assert.deepStrictEqual(report[0].messages, [
                {
                    column: 1,
                    fatal: true,
                    line: 1,
                    message:
                        "Parsing error: 'import' and 'export' may appear only with 'sourceType: module'",
                    ruleId: null,
                    nodeType: null,
                    severity: 2,
                },
            ])
        })

        it("*.mjs files should be a module.", async () => {
            const report = await linter.lintText("import 'foo'", {
                filePath: path.join(root, "test.mjs"),
            })

            assert.deepStrictEqual(report[0].messages, [
                {
                    column: 8,
                    endColumn: 13,
                    endLine: 1,
                    line: 1,
                    messageId: "notFound",
                    message: '"foo" is not found.',
                    nodeType: "Literal",
                    ruleId: "n/no-missing-import",
                    severity: 2,
                },
            ])
        })
    })

    describe("in ESM directory", () => {
        const root = path.resolve(__dirname, "../../fixtures/configs/esm/")

        /** @type {Linter} */
        let linter = null

        beforeEach(() => {
            process.chdir(root)
            clearRequireCache()
            linter = new ESLint({
                baseConfig: { extends: "plugin:n/recommended" },
                useEslintrc: false,
            })
        })

        afterEach(() => {
            process.chdir(originalCwd)
        })

        it("*.js files should be a module.", async () => {
            const report = await linter.lintText("import 'foo'", {
                filePath: path.join(root, "test.js"),
            })

            assert.deepStrictEqual(report[0].messages, [
                {
                    column: 8,
                    endColumn: 13,
                    endLine: 1,
                    line: 1,
                    messageId: "notFound",
                    message: '"foo" is not found.',
                    nodeType: "Literal",
                    ruleId: "n/no-missing-import",
                    severity: 2,
                },
            ])
        })
        ;(gtEslintV8 ? it : it.skip)(
            "*.cjs files should be a script.",
            async () => {
                const report = await linter.lintText("import 'foo'", {
                    filePath: path.join(root, "test.cjs"),
                })

                assert.deepStrictEqual(report[0].messages, [
                    {
                        column: 1,
                        fatal: true,
                        line: 1,
                        message:
                            "Parsing error: 'import' and 'export' may appear only with 'sourceType: module'",
                        ruleId: null,
                        nodeType: null,
                        severity: 2,
                    },
                ])
            }
        )

        it("*.mjs files should be a module.", async () => {
            const report = await linter.lintText("import 'foo'", {
                filePath: path.join(root, "test.mjs"),
            })

            assert.deepStrictEqual(report[0].messages, [
                {
                    column: 8,
                    endColumn: 13,
                    endLine: 1,
                    line: 1,
                    messageId: "notFound",
                    message: '"foo" is not found.',
                    nodeType: "Literal",
                    ruleId: "n/no-missing-import",
                    severity: 2,
                },
            ])
        })
    })
})
