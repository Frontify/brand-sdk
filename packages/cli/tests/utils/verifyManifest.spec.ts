/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';
import { platformAppManifestSchemaV1, verifyManifest } from '../../src/utils/verifyManifest.js';

const VALID_MANIFEST = {
    appType: 'platform-app',
    appId: 'abcd',
    surfaces: {
        MediaLibrary: {
            assetAction: {
                type: ['IMAGE'],
                filenameExtension: ['png'],
            },
            assetCreation: {},
        },
    },
    metadata: {
        version: 1,
    },
};

const ICON_LIBRARY_MANIFEST = {
    appType: 'platform-app',
    appId: 'abcd',
    surfaces: {
        IconLibrary: {
            assetAction: {
                type: ['IMAGE'],
                filenameExtension: ['png'],
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const LOGO_LIBRARY_MANIFEST = {
    appType: 'platform-app',
    appId: 'abcd',
    surfaces: {
        LogoLibrary: {
            assetAction: {
                type: ['VIDEO'],
                filenameExtension: ['exe'],
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const MEDIA_LIBRARY_FORBIDDEN_EXTENSIONS = {
    appType: 'platform-app',
    appId: 'abcd',
    surfaces: {
        MediaLibrary: {
            assetAction: {
                type: ['IMAGE'],
                filenameExtension: ['exe'],
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const VERSION_NUMBER_IS_INTEGER_WITH_DECIMAL = {
    appType: 'platform-app',
    appId: 'abcd',
    surfaces: {
        MediaLibrary: {
            assetAction: {
                type: ['IMAGE'],
                filenameExtension: ['png'],
            },
        },
    },
    metadata: {
        version: 1.1,
    },
};

describe('Verify Platform App Manifest', () => {
    it('should validate a valid manfiest', async () => {
        const verifiedManifest = await verifyManifest(VALID_MANIFEST, platformAppManifestSchemaV1);
        expect(verifiedManifest).toBe(true);
    });

    it('should throw error when wrong file extension is present in IconLibrary', async () => {
        const verifiedManifest = await verifyManifest(ICON_LIBRARY_MANIFEST, platformAppManifestSchemaV1);
        expect(verifiedManifest).toBe(false);
    });

    it('should throw error when forbidden extensions are in the manifest', async () => {
        const verifiedManifest = await verifyManifest(MEDIA_LIBRARY_FORBIDDEN_EXTENSIONS, platformAppManifestSchemaV1);
        expect(verifiedManifest).toBe(false);
    });

    it('should throw error when forbidden extensions are in the Logo Library manifest', async () => {
        const verifiedManifest = await verifyManifest(LOGO_LIBRARY_MANIFEST, platformAppManifestSchemaV1);
        expect(verifiedManifest).toBe(false);
    });

    it('should throw error when version number is a float', async () => {
        const verifiedManifest = await verifyManifest(
            VERSION_NUMBER_IS_INTEGER_WITH_DECIMAL,
            platformAppManifestSchemaV1,
        );
        expect(verifiedManifest).toBe(false);
    });

    it('should throw error when version number is not an integer without decimal', async () => {
        const verifiedManifest = await verifyManifest(
            VERSION_NUMBER_IS_INTEGER_WITH_DECIMAL,
            platformAppManifestSchemaV1,
        );
        expect(verifiedManifest).toBe(false);
    });
});
