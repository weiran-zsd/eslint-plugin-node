"use strict"
const config = {
    urlConfigs: "https://github.com/eslint-community/eslint-plugin-n#-configs",
    ignoreConfig: ["flat/recommended", "flat/recommended-script","flat/recommended-module", "flat/mixed-esm-and-cjs"],
    configEmoji: [
        ["recommended-script", "✅"],
        ["recommended-module", "🟢"],
        ["recommended", "☑️"],
    ],
    ruleDocSectionOptions: false,
}

module.exports = config
