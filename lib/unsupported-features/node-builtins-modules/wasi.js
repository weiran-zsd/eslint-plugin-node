"use strict"

const { READ } = require("@eslint-community/eslint-utils")

/** @type {import('../types.js').SupportVersionTree} */
const wasi = {
    WASI: { [READ]: { supported: ["13.3.0", "12.16.0"] } },
}

/** @type {import('../types.js').SupportVersionTree} */
module.exports = {
    wasi: wasi,
    "node:wasi": { ...wasi, [READ]: { supported: ["14.13.1", "12.20.0"] } },
}
