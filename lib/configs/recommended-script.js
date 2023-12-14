"use strict"

const { commonGlobals, commonRules } = require("./_commons")

// https://eslint.org/docs/latest/use/configure/configuration-files-new
module.exports.flat = {
    meta: {name: "eslint-plugin-n recommended-script config", type: "flat"},
    languageOptions: {
        sourceType: "commonjs",
        globals: {
            ...commonGlobals,
            __dirname: "readonly",
            __filename: "readonly",
            exports: "writable",
            module: "readonly",
            require: "readonly",
        },
    },
    rules: {
        ...commonRules,
        "n/no-unsupported-features/es-syntax": ["error", { ignores: [] }],
    },
}

// eslintrc config: https://eslint.org/docs/latest/use/configure/configuration-files
module.exports.eslintrc = {
    meta: {name: "eslint-plugin-n recommended-script config", type: "eslintrc"},
    globals: module.exports.flat.languageOptions.globals,
    parserOptions: {
        ecmaFeatures: { globalReturn: true },
        ecmaVersion: 2021,
        sourceType: "script",
    },
    rules: module.exports.flat.rules,
}

