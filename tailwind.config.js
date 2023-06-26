module.exports = {
    presets: [require("@frontify/fondue/tailwind")],
    content: ["./{packages,examples}/*/src/**/*.{ts,tsx}"],
    corePlugins: {
        preflight: false,
    },
};
