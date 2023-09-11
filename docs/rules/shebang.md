# Require correct usage of shebang (`n/shebang`)

💼 This rule is enabled in the following [configs](https://github.com/eslint-community/eslint-plugin-n#-configs): ☑️ `flat/recommended`, 🟢 `flat/recommended-module`, ✅ `flat/recommended-script`, ☑️ `recommended`, 🟢 `recommended-module`, ✅ `recommended-script`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

When we make a CLI tool with Node.js, we add `bin` field to `package.json`, then we add a shebang the entry file.
This rule suggests correct usage of shebang.

## 📖 Rule Details

This rule looks up `package.json` file from each linting target file.
Starting from the directory of the target file, it goes up ancestor directories until found.

If `package.json` was not found, this rule does nothing.

This rule checks `bin` field of `package.json`, then if a target file matches one of `bin` files, it checks whether or not there is a correct shebang.
Otherwise it checks whether or not there is not a shebang.

The following patterns are considered problems for files in `bin` field of `package.json`:

```js
console.log("hello"); /*error This file needs shebang "#!/usr/bin/env node".*/
```

```js
#!/usr/bin/env node  /*error This file must not have Unicode BOM.*/
console.log("hello");
// If this file has Unicode BOM.
```

```js
#!/usr/bin/env node  /*error This file must have Unix linebreaks (LF).*/
console.log("hello");
// If this file has Windows' linebreaks (CRLF).
```

The following patterns are considered problems for other files:

```js
#!/usr/bin/env node   /*error This file needs no shebang.*/
console.log("hello");
```

The following patterns are not considered problems for files in `bin` field of `package.json`:

```js
#!/usr/bin/env node
console.log("hello");
```

The following patterns are not considered problems for other files:

```js
console.log("hello");
```

### Options

```json
{
    "n/shebang": ["error", {"convertPath": null}]
}
```

#### convertPath

This can be configured in the rule options or as a shared setting [`settings.convertPath`](../shared-settings.md#convertpath).
Please see the shared settings documentation for more information.

## 🔎 Implementation

- [Rule source](../../lib/rules/shebang.js)
- [Test source](../../tests/lib/rules/shebang.js)
