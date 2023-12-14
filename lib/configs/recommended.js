"use strict"

const getPackageJson = require("../util/get-package-json")
const moduleConfig = require("./recommended-module")
const scriptConfig = require("./recommended-script")

const packageJson = getPackageJson()
const isModule = (packageJson && packageJson.type) === "module"
const recommendedConfig = isModule ? moduleConfig : scriptConfig

module.exports.flat = recommendedConfig.flat

module.exports.eslintrc = {
    meta: {name: "eslint-plugin-n recommended config", type: "eslintrc"},
    ...recommendedConfig.eslintrc,
    overrides: [
        { files: ["*.cjs", ".*.cjs"], ...scriptConfig.eslintrc },
        { files: ["*.mjs", ".*.mjs"], ...moduleConfig.eslintrc },
    ],
}

