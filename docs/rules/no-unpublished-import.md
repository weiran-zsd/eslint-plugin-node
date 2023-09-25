# Disallow `import` declarations which import private modules (`n/no-unpublished-import`)

💼 This rule is enabled in the following [configs](https://github.com/eslint-community/eslint-plugin-n#-configs): ☑️ `flat/recommended`, 🟢 `flat/recommended-module`, ✅ `flat/recommended-script`, ☑️ `recommended`, 🟢 `recommended-module`, ✅ `recommended-script`.

<!-- end auto-generated rule header -->

This is similar to [no-unpublished-require](no-unpublished-require.md), but this rule handles `import` declarations.

⚠️ ECMAScript 2015 (ES6) does not define the lookup logic and Node does not support modules yet. So this rule spec might be changed in future.

## 📖 Rule Details

If a source code file satisfies all of the following conditions, the file is \*published\*.

- `"files"` field of `package.json` includes the file or `"files"` field of `package.json` does not exist.
- `.npmignore` does not include the file.

Then this rule warns `import` declarations in \*published\* files if the `import` declaration imports \*unpublished\* files or the packages of `devDependencies`.

> This intends to prevent "Module Not Found" error after `npm publish`.\
> 💡 If you want to import `devDependencies`, please write `.npmignore` or `"files"` field of `package.json`.

### Options

```json
{
    "rules": {
        "n/no-unpublished-import": ["error", {
            "allowModules": [],
            "convertPath": null
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

#### convertPath

This can be configured in the rule options or as a shared setting [`settings.convertPath`](../shared-settings.md#convertpath).
Please see the shared settings documentation for more information.

### ignoreTypeImport

If using typescript, you may want to ignore type imports. This option allows you to do that.

```json
{
    "rules": {
        "n/no-unpublished-import": ["error", {
            "ignoreTypeImport": true
        }]
    }
}
```

In this way, the following code will not be reported:

```ts
import type foo from "foo";
```

## 🔎 Implementation

- [Rule source](../../lib/rules/no-unpublished-import.js)
- [Test source](../../tests/lib/rules/no-unpublished-import.js)
