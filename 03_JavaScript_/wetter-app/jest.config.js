module.exports = {
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.jsx?$": "babel-jest"
    },
    moduleFileExtensions: ["js", "jsx"],
    coverageProvider: "v8",
    clearMocks: true,
};
