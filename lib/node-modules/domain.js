const { READ } = require("@eslint-community/eslint-utils")

const domain = {
    create: { [READ]: { supported: ["0.7.8"] } },
    Domain: { [READ]: { supported: ["0.7.8"] } },
}

module.exports = {
    domain: {
        [READ]: {
            supported: ["0.7.8"],
            deprecated: ["1.4.2"],
        },
        ...domain,
    },
}
