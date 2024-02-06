const { READ } = require("@eslint-community/eslint-utils")

// TODO: https://nodejs.org/docs/latest/api/webstreams.html

const Readable = {
    [READ]: { supported: ["0.9.4"] },
    from: { [READ]: { supported: ["12.3.0", "10.17.0"] } },
    isDisturbed: { [READ]: { experimental: ["16.8.0"] } },
    fromWeb: { [READ]: { experimental: ["17.0.0"] } },
    toWeb: { [READ]: { experimental: ["17.0.0"] } },
}

const Writable = {
    [READ]: { supported: ["0.9.4"] },
    fromWeb: { [READ]: { experimental: ["17.0.0"] } },
    toWeb: { [READ]: { experimental: ["17.0.0"] } },
}

const Duplex = {
    [READ]: { supported: ["0.9.4"] },
    from: { [READ]: { experimental: ["16.8.0"] } },
    fromWeb: { [READ]: { experimental: ["17.0.0"] } },
    toWeb: { [READ]: { experimental: ["17.0.0"] } },
}

const Transform = Duplex

const promises_api = {
    pipeline: { [READ]: { supported: ["15.0.0"] } },
    finished: { [READ]: { supported: ["15.0.0"] } },
}

const stream = {
    promises: {
        [READ]: { supported: ["15.0.0"] },
        ...promises_api,
    },
    finished: { [READ]: { supported: ["10.0.0"] } },
    pipeline: { [READ]: { supported: ["10.0.0"] } },
    compose: { [READ]: { supported: ["16.9.0"] } },

    Readable,
    Writable,
    Duplex,
    Transform,

    isErrored: { [READ]: { experimental: ["17.3.0", "16.14.0"] } },
    isReadable: { [READ]: { experimental: ["17.4.0", "16.14.0"] } },
    addAbortSignal: { [READ]: { supported: ["15.4.0"] } },
    getDefaultHighWaterMark: { [READ]: { supported: ["19.9.0", "18.17.0"] } },
    setDefaultHighWaterMark: { [READ]: { supported: ["19.9.0", "18.17.0"] } },
}

module.exports = {
    stream: {
        [READ]: { supported: ["0.9.4"] },
        ...stream,
    },
    "node:stream": {
        [READ]: { supported: ["14.13.1", "12.20.0"] },
        ...stream,
    },

    "stream/promises": {
        [READ]: { experimental: ["15.0.0"] },
        ...promises_api,
    },
    "node:stream/promises": {
        [READ]: { experimental: ["15.0.0"] },
        ...promises_api,
    },
}
