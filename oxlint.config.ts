/* (c) Copyright Frontify Ltd., all rights reserved. */

import { defineConfig } from 'oxlint';

// Root-only: the Oxc language server requires `options.typeAware` here (not in nested package configs).
export default defineConfig({
    options: {
        typeAware: true,
    },
});
