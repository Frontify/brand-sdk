module.exports = {
    presets: [require("@frontify/fondue/legacyTokens/tailwind")],
    content: ["./{packages,examples}/*/src/**/*.{ts,tsx}"],
    prefix: "tw-",
    corePlugins: {
        preflight: false,
    },
};
