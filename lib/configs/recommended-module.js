"use strict"

const { commonGlobals, commonRules } = require("./_commons")

// flat config: https://eslint.org/docs/latest/use/configure/configuration-files-new
module.exports.flat = {
    meta: {name: "eslint-plugin-n recommended-module config", type: "flat"},
    languageOptions: {
        sourceType: "module",
        globals: {
            ...commonGlobals,
            __dirname: "off",
            __filename: "off",
            exports: "off",
            module: "off",
            require: "off",
        },
    },
    rules: {
        ...commonRules,
        "n/no-unsupported-features/es-syntax": [
            "error",
            { ignores: ["modules"] },
        ],
    },
}


// eslintrc config: https://eslint.org/docs/latest/use/configure/configuration-files
module.exports.eslintrc = {
    meta: {name: "eslint-plugin-n recommended-module config", type: "eslintrc"},
    globals: module.exports.flat.languageOptions.globals,
    parserOptions: {
        ecmaFeatures: { globalReturn: false },
        ecmaVersion: 2021,
        sourceType: "module",
    },
    rules: module.exports.flat.rules,
}
