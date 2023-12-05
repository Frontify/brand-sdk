/* (c) Copyright Frontify Ltd., all rights reserved. */

import { array, number, object, string } from 'zod';
import { Logger } from './logger.js';

const forbiddenExtensions = ['exe', 'dmg', 'cmd', 'sh', 'bat'];
const forbiddenExtensionsErrorMessage = `Invalid file extension. Cannot include filenameExtensions: ${forbiddenExtensions}.`;
const AssetCreationShape = object({}).optional();

export const platformAppManifestSchemaV1 = object({
    appId: string().refine((value) => value.trim() !== '', {
        message: 'AppId is required',
    }),
    appType: string().refine((value) => ['content-block', 'platform-app', 'theme'].includes(value), {
        message: 'AppType is required',
    }),
    surfaces: object({
        MediaLibrary: object({
            assetAction: object({
                type: array(
                    string().refine((value) =>
                        ['AUDIO', 'DOCUMENT', 'IMAGE', 'VIDEO', 'FILE', 'EMBEDDED_CONTENT'].includes(value),
                    ),
                ),
                filenameExtension: array(
                    string().refine((value) => !forbiddenExtensions.includes(value), {
                        message: forbiddenExtensionsErrorMessage,
                    }),
                ),
            }),
            assetCreation: AssetCreationShape,
        }).optional(),
        IconLibrary: object({
            assetAction: object({
                type: array(string().refine((value) => ['IMAGE'].includes(value))),
                filenameExtension: array(string().refine((value) => ['svg'].includes(value))),
            }),
            assetCreation: AssetCreationShape,
        }).optional(),
        LogoLibrary: object({
            assetAction: object({
                type: array(string().refine((value) => ['IMAGE'].includes(value))),
                filenameExtension: array(
                    string().refine((value) =>
                        ['svg', 'jpg', 'jpeg', 'ai', 'eps', 'png', 'tif', 'tiff'].includes(value),
                    ),
                ),
            }),
            assetCreation: AssetCreationShape,
        }).optional(),
        DocumentLibrary: object({
            assetAction: object({
                type: array(
                    string().refine((value) =>
                        ['AUDIO', 'DOCUMENT', 'IMAGE', 'VIDEO', 'FILE', 'EMBEDDED_CONTENT'].includes(value),
                    ),
                ),
                filenameExtension: array(
                    string().refine((value) => !forbiddenExtensions.includes(value), {
                        message: forbiddenExtensionsErrorMessage,
                    }),
                ),
            }),
            assetCreation: AssetCreationShape,
        }).optional(),
        WorkspaceProject: object({
            assetAction: object({
                type: array(
                    string().refine((value) =>
                        ['AUDIO', 'DOCUMENT', 'IMAGE', 'VIDEO', 'FILE', 'EMBEDDED_CONTENT'].includes(value),
                    ),
                ),
                filenameExtension: array(
                    string().refine((value) => !forbiddenExtensions.includes(value), {
                        message: forbiddenExtensionsErrorMessage,
                    }),
                ),
            }),
            assetCreation: AssetCreationShape,
        }).optional(),
    }).optional(),
    metadata: object({
        version: number().refine((value) => !isNaN(value) && Number.isInteger(value), {
            message: 'Version is required and must be an integer without decimals',
        }),
    }),
});

export const verifyManifest = async (manifest: unknown, schema: typeof platformAppManifestSchemaV1) => {
    const validatedManifest = schema.safeParse(manifest);

    if (!validatedManifest.success) {
        Logger.error(validatedManifest.error.message);
    }

    return validatedManifest.success;
};
