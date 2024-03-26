/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';
import { platformAppManifestSchemaV1, verifyManifest } from '../../src/utils/verifyManifest.js';

const VALID_MANIFEST = {
    appType: 'platform-app',
    appId: 'abcdabcdabcdabcdabcdabcda',
    surfaces: {
        mediaLibrary: {
            assetAction: {
                title: 'action title',
                type: ['image', 'video'],
                filenameExtension: ['png'],
            },
            assetCreation: {
                title: 'action title',
            },
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

const MANIFEST_WITH_TOO_LONG_TITLE_ASSET_ACTION = {
    appType: 'platform-app',
    appId: 'abcdabcdabcdabcdabcdabcda',
    surfaces: {
        mediaLibrary: {
            assetAction: {
                title: 'action title action title action title action title action title action title',
                type: ['image', 'video'],
                filenameExtension: ['png'],
            },
            assetCreation: {
                title: 'action title',
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const MANIFEST_WITH_TOO_LONG_TITLE_ASSET_CREATION = {
    appType: 'platform-app',
    appId: 'abcdabcdabcdabcdabcdabcda',
    surfaces: {
        mediaLibrary: {
            assetAction: {
                title: 'action',
                type: ['image', 'video'],
                filenameExtension: ['png'],
            },
            assetCreation: {
                title: 'action title action title action title action title action title action title action title action title action title',
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const VALID_MANIFEST_WITH_SECRETS = {
    appType: 'platform-app',
    appId: 'abcdabcdabcdabcdabcdabcda',
    secrets: [{ label: 'first label', key: 'first-key' }],
    surfaces: {
        mediaLibrary: {
            assetAction: {
                title: 'action title',
                type: ['image', 'video'],
                filenameExtension: ['png'],
            },
            assetCreation: {
                title: 'action title',
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const VALID_MANIFEST_WITH_EMPTY_SECRETS = {
    appType: 'platform-app',
    appId: 'abcdabcdabcdabcdabcdabcda',
    secrets: [],
    surfaces: {
        mediaLibrary: {
            assetAction: {
                title: 'action title',
                type: ['image', 'video'],
                filenameExtension: ['png'],
            },
            assetCreation: {
                title: 'action title',
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const VALID_MANIFEST_WITH_NO_SECRETS = {
    appType: 'platform-app',
    appId: 'abcdabcdabcdabcdabcdabcda',
    surfaces: {
        mediaLibrary: {
            assetAction: {
                title: 'action title',
                type: ['image', 'video'],
                filenameExtension: ['png'],
            },
            assetCreation: {
                title: 'action title',
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const MANIFEST_WITH_WRONG_KEY_FORMAT = {
    appType: 'platform-app',
    appId: 'abcdabcdabcdabcdabcdabcda',
    secrets: [{ label: 'first label', key: 'first key %' }],
    surfaces: {
        mediaLibrary: {
            assetAction: {
                title: 'action title',
                type: ['image', 'video'],
                filenameExtension: ['png'],
            },
            assetCreation: {
                title: 'action title',
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const MANIFEST_WITH_SECRET_BUT_NO_KEY = {
    appType: 'platform-app',
    appId: 'abcdabcdabcdabcdabcdabcda',
    secrets: [{ label: 'first label' }],
    surfaces: {
        mediaLibrary: {
            assetAction: {
                title: 'action title',
                type: ['image', 'video'],
                filenameExtension: ['png'],
            },
            assetCreation: {
                title: 'action title',
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const MANIFEST_WITH_SECRET_BUT_NO_LABEL = {
    appType: 'platform-app',
    appId: 'abcdabcdabcdabcdabcdabcda',
    secrets: [{ key: 'first-key' }],
    surfaces: {
        mediaLibrary: {
            assetAction: {
                title: 'action title',
                type: ['image', 'video'],
                filenameExtension: ['png'],
            },
            assetCreation: {
                title: 'action title',
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const generateManifestWithEndpointNetworkCall = (networkEndpoints) => {
    return {
        appType: 'platform-app',
        appId: 'abcdabcdabcdabcdabcdabcda',
        network: {
            endpoints: networkEndpoints,
        },
        surfaces: {
            mediaLibrary: {
                assetAction: {
                    title: 'action title',
                    type: ['image', 'video'],
                    filenameExtension: ['png'],
                },
                assetCreation: {
                    title: 'action title',
                },
            },
        },
        metadata: {
            version: 1,
        },
    };
};

const MANIFEST_WITH_NETWORK_CALL = generateManifestWithEndpointNetworkCall([
    {
        id: 'frontify-user-api',
        resource: 'https://api.frontify.com/api/user',
        options: {
            method: 'POST',
            headers: {
                'x-frontify-auth-header': '$OPEN_API',
            },
            body: 'example body data',
        },
    },
    {
        id: 'example-user-api',
        resource: 'https://api.example.com/api/user',
        options: {
            method: 'POST',
            headers: {
                'x-frontify-auth-header': '$OPEN_API',
            },
            body: 'example body data',
        },
    },
]);

const MANIFEST_WITH_NOT_ARRAY_NETWORK_CALL = generateManifestWithEndpointNetworkCall({
    id: 'frontify-user-api',
    resource: 'https://api.frontify.com/api/user',
    options: {
        method: 'POST',
        headers: {
            'x-frontify-auth-header': '$OPEN_API',
        },
        body: 'example body data',
    },
});

const MANIFEST_WITH_NETWORK_CALL_NO_ID = generateManifestWithEndpointNetworkCall([
    {
        resource: 'https://api.frontify.com/api/user',
        options: {
            method: 'POST',
            headers: {
                'x-frontify-auth-header': '$OPEN_API',
            },
            body: 'example body data',
        },
    },
]);

const MANIFEST_WITH_NETWORK_CALL_NO_RESOURCE = generateManifestWithEndpointNetworkCall([
    {
        id: 'frontify-user-api',
        options: {
            method: 'POST',
            headers: {
                'x-frontify-auth-header': '$OPEN_API',
            },
            body: 'example body data',
        },
    },
]);

const MANIFEST_WITH_NETWORK_CALL_INCORRECT_RESOURCE = generateManifestWithEndpointNetworkCall([
    {
        id: 'frontify-user-api',
        resource: 'something-random',
        options: {
            method: 'POST',
            headers: {
                'x-frontify-auth-header': '$OPEN_API',
            },
            body: 'example body data',
        },
    },
]);

const MANIFEST_WITH_NETWORK_CALL_NO_OPTIONS = generateManifestWithEndpointNetworkCall([
    {
        id: 'frontify-user-api',
        resource: 'https://api.frontify.com/api/user',
    },
]);

const MANIFEST_WITH_NETWORK_CALL_NO_METHOD = generateManifestWithEndpointNetworkCall([
    {
        id: 'frontify-user-api',
        resource: 'https://api.frontify.com/api/user',
        options: {
            headers: {
                'x-frontify-auth-header': '$OPEN_API',
            },
            body: 'example body data',
        },
    },
]);

describe('Verify Platform App Manifest', () => {
    it('should validate a valid manifest', async () => {
        const verifiedManifest = await verifyManifest(VALID_MANIFEST, platformAppManifestSchemaV1);
        expect(!!verifiedManifest).toBe(true);
    });

    it('should throw error when wrong file extension is present in IconLibrary', async () => {
        await expect(
            async () => await verifyManifest(ICON_LIBRARY_MANIFEST, platformAppManifestSchemaV1),
        ).rejects.toThrow();
    });

    it('should throw error when forbidden extensions are in the manifest', async () => {
        await expect(
            async () => await verifyManifest(MEDIA_LIBRARY_FORBIDDEN_EXTENSIONS, platformAppManifestSchemaV1),
        ).rejects.toThrow();
    });

    it('should throw error when forbidden extensions are in the Logo Library manifest', async () => {
        await expect(
            async () => await verifyManifest(LOGO_LIBRARY_MANIFEST, platformAppManifestSchemaV1),
        ).rejects.toThrow();
    });

    it('should throw error when version number is a float', async () => {
        await expect(
            async () => await verifyManifest(VERSION_NUMBER_IS_INTEGER_WITH_DECIMAL, platformAppManifestSchemaV1),
        ).rejects.toThrow();
    });

    it('should throw error when appId is not of length 25', async () => {
        await expect(
            async () => await verifyManifest(MANIFEST_WITH_SHORT_ID, platformAppManifestSchemaV1),
        ).rejects.toThrow();
    });

    it('should throw error when asset action title is too long', async () => {
        await expect(
            async () => await verifyManifest(MANIFEST_WITH_TOO_LONG_TITLE_ASSET_ACTION, platformAppManifestSchemaV1),
        ).rejects.toThrow();
    });

    it('should throw error when asset creation title is too long', async () => {
        await expect(
            async () => await verifyManifest(MANIFEST_WITH_TOO_LONG_TITLE_ASSET_CREATION, platformAppManifestSchemaV1),
        ).rejects.toThrow();
    });

    it('should accept a secret array with label and key', async () => {
        const verifiedManifest = await verifyManifest(VALID_MANIFEST_WITH_SECRETS, platformAppManifestSchemaV1);
        expect(!!verifiedManifest).toBe(true);
    });

    it('should accept an empty secrets array', async () => {
        const verifiedManifest = await verifyManifest(VALID_MANIFEST_WITH_EMPTY_SECRETS, platformAppManifestSchemaV1);
        expect(!!verifiedManifest).toBe(true);
    });

    it('should validate when no secret property is present', async () => {
        const verifiedManifest = await verifyManifest(VALID_MANIFEST_WITH_NO_SECRETS, platformAppManifestSchemaV1);
        expect(!!verifiedManifest).toBe(true);
    });

    it('should throw when secret object is not correct without key', async () => {
        await expect(
            async () => await verifyManifest(MANIFEST_WITH_SECRET_BUT_NO_KEY, platformAppManifestSchemaV1),
        ).rejects.toThrow();
    });

    it('should throw when secret object is not correct without label', async () => {
        await expect(
            async () => await verifyManifest(MANIFEST_WITH_SECRET_BUT_NO_LABEL, platformAppManifestSchemaV1),
        ).rejects.toThrow();
    });

    it('should throw error when key formatting is invalid', async () => {
        await expect(
            async () => await verifyManifest(MANIFEST_WITH_WRONG_KEY_FORMAT, platformAppManifestSchemaV1),
        ).rejects.toThrow();
    });

    it('should accept an array of network endpoint objects', async () => {
        const verifiedManifest = await verifyManifest(MANIFEST_WITH_NETWORK_CALL, platformAppManifestSchemaV1);
        expect(!!verifiedManifest).toBe(true);
    });

    it('should throw error when network endpoint is not an array', async () => {
        await expect(
            async () => await verifyManifest(MANIFEST_WITH_NOT_ARRAY_NETWORK_CALL, platformAppManifestSchemaV1),
        ).rejects.toThrow();
    });

    it('should throw error when network endpoint object is not correct without id', async () => {
        await expect(
            async () => await verifyManifest(MANIFEST_WITH_NETWORK_CALL_NO_ID, platformAppManifestSchemaV1),
        ).rejects.toThrow();
    });

    it('should throw error when network endpoint object is not correct without resource', async () => {
        await expect(
            async () => await verifyManifest(MANIFEST_WITH_NETWORK_CALL_NO_RESOURCE, platformAppManifestSchemaV1),
        ).rejects.toThrow();
    });

    it('should throw an error when resource is incorrect', async () => {
        await expect(
            async () =>
                await verifyManifest(MANIFEST_WITH_NETWORK_CALL_INCORRECT_RESOURCE, platformAppManifestSchemaV1),
        ).rejects.toThrow();
    });

    it('should throw error when network endpoint object is not correct without options', async () => {
        await expect(
            async () => await verifyManifest(MANIFEST_WITH_NETWORK_CALL_NO_OPTIONS, platformAppManifestSchemaV1),
        ).rejects.toThrow();
    });

    it('should throw error when network endpoint object is not correct without method', async () => {
        await expect(
            async () => await verifyManifest(MANIFEST_WITH_NETWORK_CALL_NO_METHOD, platformAppManifestSchemaV1),
        ).rejects.toThrow();
    });
});
