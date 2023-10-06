/**
 * @author Matt DuVall <http://www.mattduvall.com>
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const dedent = require("dedent")
const rule = require("../../../lib/rules/no-sync")

new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
}).run("no-sync", rule, {
    valid: [
        "var foo = readFile();",
        dedent`
            import { readFile as readFileSync } from 'node:fs';
            readFileSync();
        `,
        {
            code: dedent`
                import { readFileSync } from 'node:fs';
                readFileSync();
            `,
            options: [{ allowAtRootLevel: true }],
        },
        {
            code: dedent`
                import { readFileSync } from 'fs';
                readFileSync();
            `,
            options: [{ allowAtRootLevel: true }],
        },
        {
            code: dedent`
                import { readFileSync } from 'fs';
                if (true) {
                    readFileSync();
                }
            `,
            options: [{ allowAtRootLevel: true }],
        },
    ],
    invalid: [
        {
            code: dedent`
                import { readFileSync } from 'fs';
                readFileSync();
            `,
            errors: [
                {
                    messageId: "noSyncMember",
                    data: { importName: "readFileSync" },
                },
            ],
        },
        {
            code: dedent`
                import { readFileSync } from 'fs';
                if (true) {
                    readFileSync();
                }
            `,
            errors: [
                {
                    messageId: "noSyncMember",
                    data: { importName: "readFileSync" },
                },
            ],
        },
        {
            code: dedent`
                import { readFileSync } from 'fs';
                function soSomethingSync() {
                    readFileSync();
                }
            `,
            errors: [
                {
                    messageId: "noSyncMember",
                    data: { importName: "readFileSync" },
                },
            ],
        },

        {
            code: dedent`
                import { readFileSync } from 'node:fs';
                readFileSync();
            `,
            errors: [
                {
                    messageId: "noSyncMember",
                    data: { importName: "readFileSync" },
                },
            ],
        },
        {
            code: dedent`
                import fs from 'node:fs';
                fs.readFileSync();
            `,
            errors: [
                {
                    messageId: "noSyncMember",
                    data: { importName: "readFileSync" },
                },
            ],
        },
        {
            code: dedent`
                import * as fs from 'node:fs';
                fs.readFileSync();
            `,
            errors: [
                {
                    messageId: "noSyncMember",
                    data: { importName: "readFileSync" },
                },
            ],
        },
        {
            code: dedent`
                const { readFileSync } = require('node:fs');
                readFileSync();
            `,
            errors: [
                {
                    messageId: "noSyncMember",
                    data: { importName: "readFileSync" },
                },
            ],
        },
        {
            code: dedent`
                const fs = require('node:fs');
                fs.readFileSync();
            `,
            errors: [
                {
                    messageId: "noSyncMember",
                    data: { importName: "readFileSync" },
                },
            ],
        },

        {
            code: dedent`
                import { readFileSync as readFile } from 'node:fs';
                readFile();
            `,
            errors: [
                {
                    messageId: "noSyncAlias",
                    data: {
                        importName: "readFileSync",
                        aliasName: "readFile",
                    },
                },
            ],
        },
        {
            code: dedent`
                const { readFileSync: readFile } = require('node:fs');
                readFile();
            `,
            errors: [
                {
                    messageId: "noSyncAlias",
                    data: {
                        importName: "readFileSync",
                        aliasName: "readFile",
                    },
                },
            ],
        },

        {
            code: dedent`
                import { readFileSync } from 'fs';
                function something() {
                    readFileSync();
                }
            `,
            options: [{ allowAtRootLevel: true }],
            errors: [
                {
                    messageId: "noSyncMember",
                    data: { importName: "readFileSync" },
                },
            ],
        },
        {
            code: dedent`
                const { readFileSync } = require('fs');
                function something() {
                    readFileSync();
                }
            `,
            options: [{ allowAtRootLevel: true }],
            errors: [
                {
                    messageId: "noSyncMember",
                    data: { importName: "readFileSync" },
                },
            ],
        },
        {
            code: dedent`
                import fs from 'node:fs';
                function something() {
                    fs.readFileSync();
                }
            `,
            options: [{ allowAtRootLevel: true }],
            errors: [
                {
                    messageId: "noSyncMember",
                    data: { importName: "readFileSync" },
                },
            ],
        },
        {
            code: dedent`
                const fs = require('fs');
                function something() {
                    fs.readFileSync();
                }
            `,
            options: [{ allowAtRootLevel: true }],
            errors: [
                {
                    messageId: "noSyncMember",
                    data: { importName: "readFileSync" },
                },
            ],
        },

        {
            code: dedent`
                import { readFileSync } from 'fs';
                readFileSync.apply(null, '/something');
            `,
            errors: [
                {
                    messageId: "noSyncMember",
                    data: { importName: "readFileSync" },
                },
            ],
        },

        {
            code: dedent`
                import * as fs from 'fs';
                fs.readFileSync.apply(null, '/something');
            `,
            errors: [
                {
                    messageId: "noSyncMember",
                    data: { importName: "readFileSync" },
                },
            ],
        },
    ],
})
