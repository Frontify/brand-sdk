/* (c) Copyright Frontify Ltd., all rights reserved. */

import { array, number, object, string, z } from 'zod';

const forbiddenExtensions = ['exe', 'dmg', 'cmd', 'sh', 'bat'];
const getForbiddenExtensionsErrorMessage = (surfaceName: string) =>
    `Invalid file extension, \`${surfaceName}.filenameExtension\` can not include "${forbiddenExtensions}".`;

const assetCreationShape = object({
    title: string().min(1).max(40),
}).optional();

const completeAssetType = z.enum(['audio', 'document', 'image', 'video', 'file', 'embeddedContent']);
const imageAssetType = completeAssetType.exclude(['audio', 'document', 'video', 'file', 'embeddedContent']);

const iconLibraryFilenameExtension = z.enum(['svg']);
const logoLibraryFilenameExtension = z.enum(['svg', 'jpg', 'jpeg', 'ai', 'eps', 'png', 'tif', 'tiff']);

const appType = z.enum(['content-block', 'platform-app', 'theme']);

const SecretSchema = object({
    label: string(),
    key: string().refine((value) => /^[\w-]+$/.test(value), {
        message: "The key should only contain letters from a-z, A-Z, numbers from 0-9, '-' and '_' without any spaces",
    }),
});
const SecretsArraySchema = array(SecretSchema);

export const platformAppManifestSchemaV1 = object({
    appId: string().length(25),
    appType,
    secrets: SecretsArraySchema.optional(),
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

export const verifyManifest = async (manifest: unknown, schema: typeof platformAppManifestSchemaV1) => {
    const validatedManifest = schema.safeParse(manifest);

    if (!validatedManifest.success) {
        throw new Error(validatedManifest.error.message);
    }

    return validatedManifest.data;
};
