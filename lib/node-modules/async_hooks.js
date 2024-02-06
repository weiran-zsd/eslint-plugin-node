const { READ } = require("@eslint-community/eslint-utils")

const async_hooks = {
    createHook: { [READ]: { supported: ["8.1.0"] } },
    executionAsyncResource: { [READ]: { supported: ["13.9.0", "12.17.0"] } },
    executionAsyncId: { [READ]: { supported: ["8.1.0"] } },
    triggerAsyncId: { [READ]: { supported: ["8.1.0"] } },
    AsyncLocalStorage: {
        [READ]: {
            experimental: ["13.10.0", "12.17.0"],
            supported: ["16.4.0"],
        },
    },
    AsyncResource: {
        [READ]: {
            experimental: ["9.6.0", "8.12.0"],
            supported: ["16.4.0"],
        },
    },
}

module.exports = {
    async_hooks: {
        [READ]: { supported: ["8.1.0"] },
        ...async_hooks,
    },
    "node:async_hooks": {
        [READ]: { supported: ["14.13.1", "12.20.0"] },
        ...async_hooks,
    },
}
