# Disallow `import` declarations which import non-existence modules (`n/no-missing-import`)

💼 This rule is enabled in the following [configs](https://github.com/eslint-community/eslint-plugin-n#-configs): ☑️ `flat/recommended`, 🟢 `flat/recommended-module`, ✅ `flat/recommended-script`, ☑️ `recommended`, 🟢 `recommended-module`, ✅ `recommended-script`.

<!-- end auto-generated rule header -->

This is similar to [no-missing-require](no-missing-require.md), but this rule handles `import` and `export` declarations.

⚠️ ECMAScript 2015 (ES6) does not define the lookup logic and Node does not support modules yet. So this rule spec might be changed in future.

## 📖 Rule Details

This rule checks the file paths of `import` and `export` declarations.
If the file paths don't exist, this reports these.

Examples of 👎 **incorrect** code for this rule:

```js
/*eslint n/no-missing-import: "error" */

import typoFile from "./typo-file";   /*ERROR: "./typo-file" is not found.*/
import typoModule from "typo-module"; /*ERROR: "typo-module" is not found.*/
```

Examples of 👍 **correct** code for this rule:

```js
/*eslint n/no-missing-import: "error" */

import existingFile from "./existing-file";
import existingModule from "existing-module";
```

### Options

```json
{
    "rules": {
        "n/no-missing-import": ["error", {
            "allowModules": [],
            "resolvePaths": ["/path/to/a/modules/directory"]
        }]
    }
}
```

#### allowModules

This can be configured in the rule options or as a shared setting [`settings.allowModules`](../shared-settings.md#allowmodules).
Please see the shared settings documentation for more information.

#### resolvePaths

This can be configured in the rule options or as a shared setting [`settings.resolvePaths`](../shared-settings.md#resolvepaths).
Please see the shared settings documentation for more information.

#### tsconfigPath

This can be configured in the rule options or as a shared setting [`settings.tsconfigPath`](../shared-settings.md#tsconfigpath).
Please see the shared settings documentation for more information.

#### typescriptExtensionMap

This can be configured in the rule options or as a shared setting [`settings.typescriptExtensionMap`](../shared-settings.md#typescriptextensionmap).
Please see the shared settings documentation for more information.

## 🔎 Implementation

- [Rule source](../../lib/rules/no-missing-import.js)
- [Test source](../../tests/lib/rules/no-missing-import.js)
