window.require = (moduleName) => {
    switch (moduleName) {
        case "react":
            return window["React"];
        case "quill":
            return window["Quill"];
        default:
            throw new Error(`Could not resolve module: ${moduleName}`);
    }
};
