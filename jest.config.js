process.env.TZ = "GMT";
process.env.INSTANCE_URL = "test.frontify.com";

module.exports = {
    roots: ["<rootDir>/src"],
    transform: {
        "^.+\\.ts$": "ts-jest",
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts$",
    moduleFileExtensions: ["ts", "js", "json", "node"],
};
