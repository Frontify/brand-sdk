module.exports = {
    content: ["./{packages,examples}/*/src/**/*.{ts,tsx}"],
    prefix: "tw-",
    corePlugins: {
        preflight: false,
    },
};
