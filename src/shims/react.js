window.require = (moduleName) => {
    switch (moduleName) {
        case "react":
            return window["React"];
        default:
            throw new Error(`Could not resolve module: ${moduleName}`);
    }
};
