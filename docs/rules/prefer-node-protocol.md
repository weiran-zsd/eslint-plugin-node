# Enforce using the `node:` protocol when importing Node.js builtin modules (`n/prefer-node-protocol`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Older built-in Node modules such as fs now can be imported via either their name or `node:` + their name:

```js
import fs from "fs"
import fs from "node:fs"
```

The prefixed versions are nice because they can't be overridden by user modules and are similarly formatted to prefix-only modules such as node:test.

Note that Node.js support for this feature began in:

> v16.0.0, v14.18.0 (`require()`)  
> v14.13.1, v12.20.0 (`import`)

## 📖 Rule Details

This rule enforces that `node:` protocol is prepended to built-in Node modules when importing or exporting built-in Node modules.

👍 Examples of **correct** code for this rule:

```js
/*eslint n/prefer-node-protocol: error */

import fs from "node:fs";
```

👎 Examples of **incorrect** code for this rule:

```js
/*eslint n/prefer-node-protocol: error */

import fs from "fs";
```

## 🔎 Implementation

- [Rule source](../../lib/rules/prefer-node-protocol.js)
- [Test source](../../tests/lib/rules/prefer-node-protocol.js)
