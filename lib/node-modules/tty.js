const { READ } = require("@eslint-community/eslint-utils")

const tty = {
    isatty: { [READ]: { supported: ["0.5.8"] } },
    ReadStream: { [READ]: { supported: ["0.5.8"] } },
    WriteStream: { [READ]: { supported: ["0.5.8"] } },
}

module.exports = {
    tty: {
        [READ]: { supported: ["0.5.8"] },
        ...tty,
    },
    "node:tty": {
        [READ]: { supported: ["14.13.1", "12.20.0"] },
        ...tty,
    },
}
