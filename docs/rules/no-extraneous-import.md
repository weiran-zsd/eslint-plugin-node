# Disallow `import` declarations which import extraneous modules (`n/no-extraneous-import`)

💼 This rule is enabled in the following [configs](https://github.com/eslint-community/eslint-plugin-n#-configs): 🟢 `recommended-module`, ✅ `recommended-script`.

<!-- end auto-generated rule header -->

If an `import` declaration's source is extraneous (it's not written in `package.json`), the program works in local, but may not work after dependencies are re-installed. It will cause troubles to your team/contributors. If a declaration source is extraneous yet consistently works for you and your team, it may be a transitive dependency (a dependency of a dependency). Transitive dependencies should still be saved as an explicit dependency in `package.json` to avoid the risk of a dependency changing and removing the dependency of a dependency this `import` is relying on.

This rule disallows `import` declarations of extraneous modules.

## 📖 Rule Details

This rule warns `import` declarations of extraneous modules.

### Options

```json
{
    "rules": {
        "n/no-extraneous-import": ["error", {
            "allowModules": [],
            "resolvePaths": []
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

## 🔎 Implementation

- [Rule source](../../lib/rules/no-extraneous-import.js)
- [Test source](../../tests/lib/rules/no-extraneous-import.js)
