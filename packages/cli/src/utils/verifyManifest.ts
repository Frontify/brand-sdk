/* (c) Copyright Frontify Ltd., all rights reserved. */

import { array, number, object, string, z } from 'zod';

const forbiddenExtensions = ['exe', 'dmg', 'cmd', 'sh', 'bat'];
const getForbiddenExtensionsErrorMessage = (surfaceName: string) =>
    `Invalid file extension, \`${surfaceName}.filenameExtension\` can not include: ${forbiddenExtensions.join(', ')}.`;

const assetCreationShape = object({
    title: string().min(1).max(40),
}).optional();

const completeAssetType = z.enum(['audio', 'document', 'image', 'video', 'file', 'embeddedContent']);
const imageAssetType = completeAssetType.exclude(['audio', 'document', 'video', 'file', 'embeddedContent']);

const iconLibraryFilenameExtension = z.enum(['svg']);
const logoLibraryFilenameExtension = z.enum(['svg', 'jpg', 'jpeg', 'ai', 'eps', 'png', 'tif', 'tiff']);

const appType = z.enum(['content-block', 'platform-app', 'theme']);

const secretIdSet = new Set();
export function resetSecretIdSet() {
    secretIdSet.clear();
}

const secretSchema = object({
    label: string(),
    key: string().refine(
        (key) => {
            if (secretIdSet.has(key)) {
                return false;
            }

            secretIdSet.add(key);
            return /^[\w-]+$/.test(key);
        },
        {
            message:
                "The key should only contain letters from a-z, A-Z, numbers from 0-9, '-' and '_' without any spaces",
        },
    ),
});
const secretsArraySchema = array(secretSchema);

const requestOptionsSchema = object({
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
    headers: z.record(string()).optional(),
    body: z.any().optional(),
});

const endpointIdSet = new Set();
export function resetEndpointIdSet() {
    endpointIdSet.clear();
}
const endpointCallSchema = object({
    id: string().refine(
        (id) => {
            if (endpointIdSet.has(id)) {
                return false;
            }

            endpointIdSet.add(id);
            return true;
        },
        {
            message: 'Endpoint ID must be unique',
        },
    ),
    resource: string().url(),
    options: requestOptionsSchema,
});

export const platformAppManifestSchemaV1 = object({
    appId: string().length(25),
    appType,
    secrets: secretsArraySchema.optional(),
    network: object({
        endpoints: array(endpointCallSchema).optional(),
    }).optional(),
    surfaces: object({
        mediaLibrary: object({
            assetAction: object({
                title: string().min(2).max(28),
                type: array(completeAssetType),
                filenameExtension: array(
                    string().refine((value) => !forbiddenExtensions.includes(value), {
                        message: getForbiddenExtensionsErrorMessage('mediaLibrary'),
                    }),
                ),
            }).optional(),
            assetCreation: assetCreationShape,
        }).optional(),
        iconLibrary: object({
            assetAction: object({
                title: string().min(2).max(28),
                type: array(imageAssetType),
                filenameExtension: array(iconLibraryFilenameExtension),
            }).optional(),
            assetCreation: assetCreationShape,
        }).optional(),
        logoLibrary: object({
            assetAction: object({
                title: string().min(2).max(28),
                type: array(imageAssetType),
                filenameExtension: array(logoLibraryFilenameExtension),
            }).optional(),
            assetCreation: assetCreationShape,
        }).optional(),
        documentLibrary: object({
            assetAction: object({
                title: string().min(2).max(28),
                type: array(completeAssetType),
                filenameExtension: array(
                    string().refine((value) => !forbiddenExtensions.includes(value), {
                        message: getForbiddenExtensionsErrorMessage('documentLibrary'),
                    }),
                ),
            }).optional(),
            assetCreation: assetCreationShape,
        }).optional(),
        workspace: object({
            assetAction: object({
                title: string().min(2).max(28),
                type: array(completeAssetType),
                filenameExtension: array(
                    string().refine((value) => !forbiddenExtensions.includes(value), {
                        message: getForbiddenExtensionsErrorMessage('workspaceProject'),
                    }),
                ),
            }).optional(),
            assetCreation: assetCreationShape,
        }).optional(),
    }).optional(),
    metadata: object({
        version: number().int(),
    }),
});

export const verifyManifest = (manifest: unknown, schema: typeof platformAppManifestSchemaV1) => {
    const validatedManifest = schema.safeParse(manifest);

    if (!validatedManifest.success) {
        throw new Error(validatedManifest.error.message);
    }

    return validatedManifest.data;
};
