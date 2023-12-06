/* (c) Copyright Frontify Ltd., all rights reserved. */

import { array, number, object, string } from 'zod';

const forbiddenExtensions = ['exe', 'dmg', 'cmd', 'sh', 'bat'];
const getForbiddenExtensionsErrorMessage = (surfaceName: string) =>
    `Invalid file extension, \`${surfaceName}.filenameExtension\` can not include "${forbiddenExtensions}".`;
const AssetCreationShape = object({}).optional();

export const platformAppManifestSchemaV1 = object({
    appId: string().refine((value) => value.trim() !== '', {
        message: '`appId` is required',
    }),
    appType: string().refine((value) => ['content-block', 'platform-app', 'theme'].includes(value), {
        message: '`appType` is required',
    }),
    surfaces: object({
        mediaLibrary: object({
            assetAction: object({
                type: array(
                    string().refine((value) =>
                        ['audio', 'document', 'image', 'video', 'file', 'embeddedContent'].includes(value),
                    ),
                ),
                filenameExtension: array(
                    string().refine((value) => !forbiddenExtensions.includes(value), {
                        message: getForbiddenExtensionsErrorMessage('mediaLibrary'),
                    }),
                ),
            }),
            assetCreation: AssetCreationShape,
        }).optional(),
        iconLibrary: object({
            assetAction: object({
                type: array(string().refine((value) => ['image'].includes(value))),
                filenameExtension: array(string().refine((value) => ['svg'].includes(value))),
            }),
            assetCreation: AssetCreationShape,
        }).optional(),
        logoLibrary: object({
            assetAction: object({
                type: array(string().refine((value) => ['image'].includes(value))),
                filenameExtension: array(
                    string().refine((value) =>
                        ['svg', 'jpg', 'jpeg', 'ai', 'eps', 'png', 'tif', 'tiff'].includes(value),
                    ),
                ),
            }),
            assetCreation: AssetCreationShape,
        }).optional(),
        documentLibrary: object({
            assetAction: object({
                type: array(
                    string().refine((value) =>
                        ['audio', 'document', 'image', 'video', 'file', 'embeddedContent'].includes(value),
                    ),
                ),
                filenameExtension: array(
                    string().refine((value) => !forbiddenExtensions.includes(value), {
                        message: getForbiddenExtensionsErrorMessage('documentLibrary'),
                    }),
                ),
            }),
            assetCreation: AssetCreationShape,
        }).optional(),
        workspaceProject: object({
            assetAction: object({
                type: array(
                    string().refine((value) =>
                        ['audio', 'document', 'image', 'video', 'file', 'embeddedContent'].includes(value),
                    ),
                ),
                filenameExtension: array(
                    string().refine((value) => !forbiddenExtensions.includes(value), {
                        message: getForbiddenExtensionsErrorMessage('workspaceProject'),
                    }),
                ),
            }),
            assetCreation: AssetCreationShape,
        }).optional(),
    }).optional(),
    metadata: object({
        version: number().refine((value) => !isNaN(value) && Number.isInteger(value), {
            message: '`metadata.version` is required and must be an integer without decimals',
        }),
    }),
});

export const verifyManifest = async (manifest: unknown, schema: typeof platformAppManifestSchemaV1) => {
    const validatedManifest = schema.safeParse(manifest);

    if (!validatedManifest.success) {
        throw new Error(validatedManifest.error.message);
    }

    return validatedManifest.data;
};
