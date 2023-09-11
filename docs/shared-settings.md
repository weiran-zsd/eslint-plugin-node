# Shared Settings

The following options can be set by [shared settings](http://eslint.org/docs/user-guide/configuring.html#adding-shared-settings).
Several rules have the same option, but we can set this option at once.

`eslint-plugin-n` reads both the `node`, and the `n` settings to allow for backward compatibility with `eslint-plugin-node`.

## version

This rule reads the [`engines`] field of `package.json` but, you can overwrite the version by `version` option.

The `version` option accepts [the valid version range of `node-semver`](https://github.com/npm/node-semver#range-grammar).

### Example version

```json
{ "version": ">= 14" }
```

### Default version

```json
{ "version": ">= 16.0.0" }
```

## allowModules

Some platforms have additional embedded modules.
For example, Electron has `electron` module.

We can specify additional embedded modules with this option.
This option is an array of strings as module names.

### Example allowModules

```json
{ "allowModules": ["electron"] }
```

### Default allowModules

```json
{ "allowModules": [] }
```

## resolvePaths

Adds additional paths to try for when resolving imports.
If a path is relative, it will be resolved from CWD.

### Example resolvePaths

```json
{ "resolvePaths": ["/path/to/somewhere", "../relative/path"] }
```

### Default resolvePaths

```json
{ "resolvePaths": [] }
```

## convertPath

If we use transpilers (e.g. Babel), perhaps the file path to a source code is never published.
`convertPath` option tells to the rule, it needs to convert file paths.

This option has two shapes:

```ts
type ConvertPathObject = {
  [includedFiles: string]: [ pattern: string, replacement: string ]
}
```

```ts
type ConvertPathArray = {
  include: string[],
  exclude?: string[],
  replace: [ pattern: string, replacement: string ]
}[]
```

All replacements use the following code:

```js
path.replace(new RegExp(pattern), replacement);
```

This means the following replacements are permitted:

| Pattern | Inserts |
| --- | --- |
| `$$` | Inserts a "$". |
| `$&` | Inserts the matched substring. |
| `` $` `` | Inserts the portion of the string that precedes the matched substring. |
| `$'` | Inserts the portion of the string that follows the matched substring. |
| `$n` | Inserts the nth (1-indexed) capturing group where n is a positive integer less than 100. |
| `$<Name>` | Inserts the named capturing group where Name is the group name. |

### convertPath - Object

This option has the following shape: `<targetFiles>: [<pattern>, <replacement>]`

- `targetFiles` is a glob pattern matching linted files
- `pattern` is a string escaped regex we pass to `new RegExp`
- `replacement` is the replacement string.

#### Example convertPath - Object

So in this example, `src/bin/index.js` is handled as `bin/index.js`.

```json
{ "convertPath": {
  "src/bin/**/*.js": ["^src/bin/(.+)$", "bin/$1"]
} }
```

### convertPath - Array

This option has the following shape: `{ include: <includedFiles>, exclude: <excludedFiles>, replace: [<pattern>, <replacement>] }`

- `includedFiles` is a glob pattern matching linted files
- `excludedFiles` is a glob pattern matching files in includedFiles that we want to exclude
- `pattern` is a string escaped regex we pass to `new RegExp`
- `replacement` is the replacement string.

#### Example 1 - Basics

So in this example, `src/bin/index.js` is handled as `bin/index.js`.

```json
{ "convertPath": [
  {
    "include": ["src/bin/**/*.js"],
    "replace": ["^src/bin/(.+)$", "bin/$1"]
  }
] }
```

#### Example 2 - Exclude specs

So in this example, `src/bin/index.js` is handled as `bin/index.js` but, we exclude all `.spec.js` from the conversion.

```json
{ "convertPath": [
  {
    "include": ["src/bin/**/*.js"],
    "exclude": ["**/*.spec.js"],
    "replace": ["^src/bin/(.+)$", "bin/$1"]
  }
] }
```

## typescriptExtensionMap

Adds the ability to change the extension mapping when converting between typescript and javascript

You can also use the [typescript compiler jsx options](https://www.typescriptlang.org/tsconfig#jsx) to automatically use the correct mapping.

We perform the following checks to work out what your ts extension mappings should be:

1. This checks `options.typescriptExtensionMap`, if its an array then it gets returned.
2. This checks `options.typescriptExtensionMap`, if its a string, convert to the correct mapping.
3. This checks `options.tsconfigFile`, if its set it check for a `compilerOptions.jsx` property
4. This checks `settings.typescriptExtensionMap`, if its an array then it gets returned.
5. This checks `settings.typescriptExtensionMap`, if its a string, convert to the correct mapping.
6. This checks `settings.tsconfigFile`, if its set it check for a `compilerOptions.jsx` property
7. This tries to find the closest `tsconfig.json`, then checks for a `compilerOptions.jsx` property
8. This returns `PRESERVE_MAPPING`.

### Example - Custom react mappings

```json
{ "typescriptExtensionMap": [
    [ "", ".js" ],
    [ ".ts", ".js" ],
    [ ".cts", ".cjs" ],
    [ ".mts", ".mjs" ],
    [ ".tsx", ".js" ],
] }
```

### Example - Wordy react mappings

```json
{ "typescriptExtensionMap": "react" }
```

### Default typescriptExtensionMap

If we cannot find a tsconfig file, we fall back to using:

```json
{ "typescriptExtensionMap": "preserve" }
```

## tsconfigPath

Adds the ability to specify the tsconfig used by the typescriptExtensionMap tool.

### Example absolute tsconfigPath

```json
{ "tsconfigPath": "/path/to/tsconfig.json" }
```

### Example relative tsconfigPath

```json
{ "tsconfigPath": "./.tsconfig/development.json" }
```

### Default tsconfigPath

By default the `tsconfigPath` is searched for up the file tree from the currently linted file.
