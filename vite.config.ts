/* (c) Copyright Frontify Ltd., all rights reserved. */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    resolve: {
        mainFields: ["browser", "module", "main"],
    },
    server: {
        fs: {
            // INFO: Allow linked packages `../..`.
            strict: false,
        },
    },
});
