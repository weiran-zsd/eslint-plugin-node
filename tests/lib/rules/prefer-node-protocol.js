/**
 * @author Yusuke Iinuma
 * See LICENSE file in root directory for full license.
 */
"use strict"

const { RuleTester } = require("#eslint-rule-tester")
const rule = require("../../../lib/rules/prefer-node-protocol.js")

new RuleTester({
    languageOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
    },
}).run("prefer-node-protocol", rule, {
    valid: [
        'import nodePlugin from "eslint-plugin-n";',
        'import fs from "./fs";',
        'import fs from "unknown-builtin-module";',
        'import fs from "node:fs";',
        `
            async function foo() {
			    const fs = await import(fs);
		    }
        `,
        `
            async function foo() {
                const fs = await import(0);
            }
        `,
        `
            async function foo() {
                const fs = await import(\`fs\`);
            }
        `,
        'import "punycode/";',
        // https://bun.sh/docs/runtime/bun-apis
        'import "bun";',
        'import "bun:jsc";',
        'import "bun:sqlite";',
    ],
    invalid: [
        {
            code: 'import fs from "fs";',
            output: 'import fs from "node:fs";',
            errors: ["Prefer `node:{{moduleName}}` over `{{moduleName}}`."],
        },
        {
            code: 'export {promises} from "fs";',
            output: 'export {promises} from "node:fs";',
            errors: ["Prefer `node:{{moduleName}}` over `{{moduleName}}`."],
        },
        {
            code: `
                async function foo() {
                    const fs = await import('fs');
                }
            `,
            output: `
                async function foo() {
                    const fs = await import('node:fs');
                }
            `,
            errors: ["Prefer `node:{{moduleName}}` over `{{moduleName}}`."],
        },
        {
            code: 'import fs from "fs/promises";',
            output: 'import fs from "node:fs/promises";',
            errors: ["Prefer `node:{{moduleName}}` over `{{moduleName}}`."],
        },
        {
            code: 'export {default} from "fs/promises";',
            output: 'export {default} from "node:fs/promises";',
            errors: ["Prefer `node:{{moduleName}}` over `{{moduleName}}`."],
        },
        {
            code: `
                async function foo() {
                    const fs = await import('fs/promises');
                }
            `,
            output: `
                async function foo() {
                    const fs = await import('node:fs/promises');
                }
            `,
            errors: ["Prefer `node:{{moduleName}}` over `{{moduleName}}`."],
        },
        {
            code: 'import {promises} from "fs";',
            output: 'import {promises} from "node:fs";',
            errors: ["Prefer `node:{{moduleName}}` over `{{moduleName}}`."],
        },
        {
            code: 'export {default as promises} from "fs";',
            output: 'export {default as promises} from "node:fs";',
            errors: ["Prefer `node:{{moduleName}}` over `{{moduleName}}`."],
        },
        {
            code: "import {promises} from 'fs';",
            output: "import {promises} from 'node:fs';",
            errors: ["Prefer `node:{{moduleName}}` over `{{moduleName}}`."],
        },
        {
            code: `
                async function foo() {
                    const fs = await import("fs/promises");
                }
            `,
            output: `
                async function foo() {
                    const fs = await import("node:fs/promises");
                }
            `,
            errors: ["Prefer `node:{{moduleName}}` over `{{moduleName}}`."],
        },
        {
            code: `
                async function foo() {
                    const fs = await import(/* escaped */"\\u{66}s/promises");
                }
            `,
            output: `
                async function foo() {
                    const fs = await import(/* escaped */"node:\\u{66}s/promises");
                }
            `,
            errors: ["Prefer `node:{{moduleName}}` over `{{moduleName}}`."],
        },
        {
            code: 'import "buffer";',
            output: 'import "node:buffer";',
            errors: ["Prefer `node:{{moduleName}}` over `{{moduleName}}`."],
        },
        {
            code: 'import "child_process";',
            output: 'import "node:child_process";',
            errors: ["Prefer `node:{{moduleName}}` over `{{moduleName}}`."],
        },
        {
            code: 'import "timers/promises";',
            output: 'import "node:timers/promises";',
            errors: ["Prefer `node:{{moduleName}}` over `{{moduleName}}`."],
        },
    ],
})
