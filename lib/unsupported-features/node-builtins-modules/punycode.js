const { READ } = require("@eslint-community/eslint-utils")

/** @type {import('../types.js').SupportVersionTree} */
const punycode = {
    ucs2: { [READ]: { supported: ["0.7.0"] } },
    version: { [READ]: { supported: ["0.6.1"] } },
    decode: { [READ]: { supported: ["0.5.1"] } },
    encode: { [READ]: { supported: ["0.5.1"] } },
    toASCII: { [READ]: { supported: ["0.6.1"] } },
    toUnicode: { [READ]: { supported: ["0.6.1"] } },
}

/** @type {import('../types.js').SupportVersionTree} */
module.exports = {
    punycode: {
        [READ]: {
            supported: ["0.5.1"],
            deprecated: ["7.0.0"],
        },
        ...punycode,
    },
}
