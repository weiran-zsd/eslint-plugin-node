"use strict"

const { READ } = require("@eslint-community/eslint-utils")

/**
 * @satisfies {import('../types.js').SupportVersionTraceMap}
 */
const sqlite = {
    DatabaseSync: { [READ]: { supported: ["22.5.0"] } },
    StatementSync: { [READ]: { supported: ["22.5.0"] } },
    SQLITE_CHANGESET_OMIT: { [READ]: { supported: ["22.12.0"] } },
    SQLITE_CHANGESET_REPLACE: { [READ]: { supported: ["22.12.0"] } },
    SQLITE_CHANGESET_ABORT: { [READ]: { supported: ["22.12.0"] } },
}

/**
 * @satisfies {import('../types.js').SupportVersionTraceMap}
 */
module.exports = {
    "node:sqlite": {
        [READ]: { experimental: ["22.5.0"] },
        ...sqlite,
    },
}
