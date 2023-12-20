/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { platformAppManifestSchemaV1, verifyManifest } from '../../src/utils/verifyManifest';

const VALID_MANIFEST = {
    appType: 'platform-app',
    appId: 'abcdabcdabcdabcdabcdabcda',
    surfaces: {
        mediaLibrary: {
            assetAction: {
                type: ['image', 'video'],
                filenameExtension: ['png'],
            },
            assetCreation: {},
        },
    },
    metadata: {
        version: 1,
    },
};

const MANIFEST_WITH_SHORT_ID = {
    appType: 'platform-app',
    appId: 'tooShortId',
    surfaces: {
        mediaLibrary: {
            assetAction: {
                type: ['image', 'video'],
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
        iconLibrary: {
            assetAction: {
                type: ['image'],
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
        logoLibrary: {
            assetAction: {
                type: ['video'],
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
        mediaLibrary: {
            assetAction: {
                type: ['image'],
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
        mediaLibrary: {
            assetAction: {
                type: ['image'],
                filenameExtension: ['png'],
            },
        },
    },
    metadata: {
        version: 1.1,
    },
};

describe('Verify Platform App Manifest', () => {
    it('should validate a valid manifest', () => {
        const verifiedManifest = verifyManifest(VALID_MANIFEST, platformAppManifestSchemaV1);
        expect(verifiedManifest).toStrictEqual(VALID_MANIFEST);
    });

    it('should throw error when wrong file extension is present in IconLibrary', () => {
        expect(() => verifyManifest(ICON_LIBRARY_MANIFEST, platformAppManifestSchemaV1)).toThrow();
    });

    it('should throw error when forbidden extensions are in the manifest', () => {
        expect(() => verifyManifest(MEDIA_LIBRARY_FORBIDDEN_EXTENSIONS, platformAppManifestSchemaV1)).toThrow();
    });

    it('should throw error when forbidden extensions are in the Logo Library manifest', () => {
        expect(() => verifyManifest(LOGO_LIBRARY_MANIFEST, platformAppManifestSchemaV1)).toThrow();
    });

    it('should throw error when version number is a float', () => {
        expect(() => verifyManifest(VERSION_NUMBER_IS_INTEGER_WITH_DECIMAL, platformAppManifestSchemaV1)).toThrow();
    });

    it('should throw error when appId is not of length 25', () => {
        expect(() => verifyManifest(MANIFEST_WITH_SHORT_ID, platformAppManifestSchemaV1)).toThrow();
    });
});
