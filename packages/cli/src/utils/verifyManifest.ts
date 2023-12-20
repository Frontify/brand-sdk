/* (c) Copyright Frontify Ltd., all rights reserved. */

import { array, number, object, string, z } from 'zod';

const forbiddenExtensions = ['exe', 'dmg', 'cmd', 'sh', 'bat'];
const getForbiddenExtensionsErrorMessage = (surfaceName: string) =>
    `Invalid file extension, \`${surfaceName}.filenameExtension\` can not include "${forbiddenExtensions.join(
        '", "',
    )}".`;

const assetCreationShape = object({}).optional();

const completeAssetType = z.enum(['audio', 'document', 'image', 'video', 'file', 'embeddedContent']);
const imageAssetType = completeAssetType.exclude(['audio', 'document', 'video', 'file', 'embeddedContent']);

const iconLibraryFilenameExtension = z.enum(['svg']);
const logoLibraryFilenameExtension = z.enum(['svg', 'jpg', 'jpeg', 'ai', 'eps', 'png', 'tif', 'tiff']);

const appType = z.enum(['content-block', 'platform-app', 'theme']);
export const platformAppManifestSchemaV1 = object({
    appId: string().length(25),
    appType,
    surfaces: object({
        mediaLibrary: object({
            assetAction: object({
                type: array(completeAssetType),
                filenameExtension: array(
                    string().refine((value) => !forbiddenExtensions.includes(value), {
                        message: getForbiddenExtensionsErrorMessage('mediaLibrary'),
                    }),
                ),
            }),
            assetCreation: assetCreationShape,
        }).optional(),
        iconLibrary: object({
            assetAction: object({
                type: array(imageAssetType),
                filenameExtension: array(iconLibraryFilenameExtension),
            }),
            assetCreation: assetCreationShape,
        }).optional(),
        logoLibrary: object({
            assetAction: object({
                type: array(imageAssetType),
                filenameExtension: array(logoLibraryFilenameExtension),
            }),
            assetCreation: assetCreationShape,
        }).optional(),
        documentLibrary: object({
            assetAction: object({
                type: array(completeAssetType),
                filenameExtension: array(
                    string().refine((value) => !forbiddenExtensions.includes(value), {
                        message: getForbiddenExtensionsErrorMessage('documentLibrary'),
                    }),
                ),
            }),
            assetCreation: assetCreationShape,
        }).optional(),
        workspaceProject: object({
            assetAction: object({
                type: array(completeAssetType),
                filenameExtension: array(
                    string().refine((value) => !forbiddenExtensions.includes(value), {
                        message: getForbiddenExtensionsErrorMessage('workspaceProject'),
                    }),
                ),
            }),
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
