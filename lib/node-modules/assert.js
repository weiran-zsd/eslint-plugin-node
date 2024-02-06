const { READ } = require("@eslint-community/eslint-utils")

const assert = {
    assert: { [READ]: { supported: ["0.5.9"] } },
    deepEqual: { [READ]: { supported: ["0.1.21"] } },
    deepStrictEqual: { [READ]: { supported: ["1.2.0"] } },
    doesNotMatch: {
        [READ]: {
            experimental: ["13.6.0", "12.16.0"],
            supported: ["16.0.0"],
        },
    },
    doesNotReject: { [READ]: { supported: ["10.0.0"] } },
    doesNotThrow: { [READ]: { supported: ["0.1.21"] } },
    equal: { [READ]: { supported: ["0.1.21"] } },
    fail: { [READ]: { supported: ["0.1.21"] } },
    ifError: { [READ]: { supported: ["0.1.97"] } },
    match: {
        [READ]: {
            experimental: ["13.6.0", "12.16.0"],
            supported: ["16.0.0"],
        },
    },
    notDeepEqual: { [READ]: { supported: ["0.1.21"] } },
    notDeepStrictEqual: { [READ]: { supported: ["1.2.0"] } },
    notEqual: { [READ]: { supported: ["0.1.21"] } },
    notStrictEqual: { [READ]: { supported: ["0.1.21"] } },
    ok: { [READ]: { supported: ["0.1.21"] } },
    rejects: { [READ]: { supported: ["10.0.0"] } },
    strictEqual: { [READ]: { supported: ["0.1.21"] } },
    throws: { [READ]: { supported: ["0.1.21"] } },
    CallTracker: {
        [READ]: {
            experimental: ["14.2.0", "12.19.0"],
            deprecated: ["20.1.0"],
        },
    },
}

assert.strict = {
    [READ]: { supported: ["9.9.0", "8.13.0"] },
    ...assert,
}

module.exports = {
    assert: {
        [READ]: { supported: ["0.1.21"] },
        ...assert,
    },
    "node:assert": {
        [READ]: { supported: ["14.13.1", "12.20.0"] },
        ...assert,
    },
    "assert/strict": {
        [READ]: { supported: ["15.0.0"] },
        ...assert.strict,
    },
    "node:assert/strict": {
        [READ]: { supported: ["15.0.0"] },
        ...assert.strict,
    },
}
