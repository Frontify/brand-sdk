/* (c) Copyright Frontify Ltd., all rights reserved. */

import { defineConfig } from "cypress";

export default defineConfig({
    video: false,
    retries: {
        runMode: 2,
    },
    component: {
        devServer: {
            framework: "react",
            bundler: "vite",
        },
        viewportHeight: 1280,
        viewportWidth: 800,
        specPattern: "{packages,examples}/**/*.spec.ct.{ts,tsx}",
        experimentalSingleTabRunMode: true,
    },
});
