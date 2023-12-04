/* (c) Copyright Frontify Ltd., all rights reserved. */

import { array, number, object, string } from 'yup';
import { Logger } from './logger.js';

type SchemaError = {
    errors: string[];
};
const forbiddenExtensions = ['exe', 'dmg', 'cmd', 'sh', 'bat'];
const forbiddenExtensionsErrorMessage = `Invalid file extension. Cannot include filenameExtensions: ${forbiddenExtensions}.`;
export const platformAppManfiestSchemaV1 = object().shape({
    appId: string().required('AppId is required'),
    appType: string().oneOf(['content-block', 'platform-app', 'theme']).required('AppType is required'),
    surfaces: object().shape({
        MediaLibrary: object().shape({
            assetAction: object().shape({
                type: array().of(string().oneOf(['AUDIO', 'DOCUMENT', 'IMAGE', 'VIDEO', 'FILE', 'EMBEDDED_CONTENT'])),
                filenameExtension: array().of(string().notOneOf(forbiddenExtensions, forbiddenExtensionsErrorMessage)),
            }),
            assetCreation: object(),
        }),
        IconLibrary: object().shape({
            assetAction: object().shape({
                type: array().of(string().oneOf(['IMAGE'])),
                filenameExtension: array().of(string().oneOf(['svg'])),
            }),
            assetCreation: object(),
        }),
        LogoLibrary: object().shape({
            assetAction: object().shape({
                type: array().of(string().oneOf(['IMAGE'])),
                filenameExtension: array().of(
                    string().oneOf(['svg', 'jpg', 'jpeg', 'ai', 'eps', 'png', 'tif', 'tiff']),
                ),
            }),
            assetCreation: object(),
        }),
        DocumentLibrary: object().shape({
            assetAction: object().shape({
                type: array().of(string().oneOf(['AUDIO', 'DOCUMENT', 'IMAGE', 'VIDEO', 'FILE', 'EMBEDDED_CONTENT'])),
                filenameExtension: array().of(string().notOneOf(forbiddenExtensions, forbiddenExtensionsErrorMessage)),
            }),
            assetCreation: object(),
        }),
        workspaceProject: object().shape({
            assetAction: object().shape({
                type: array().of(string().oneOf(['AUDIO', 'DOCUMENT', 'IMAGE', 'VIDEO', 'FILE', 'EMBEDDED_CONTENT'])),
                filenameExtension: array().of(string().notOneOf(forbiddenExtensions, forbiddenExtensionsErrorMessage)),
            }),
            assetCreation: object(),
        }),
    }),
    metadata: object().shape({
        version: number().required('Version is required'),
    }),
});

export const verifyManifest = async (manifest: unknown, schema) => {
    let validManifest = false;
    try {
        validManifest = !!(await schema.validate(manifest));
    } catch (error) {
        Logger.error(...(error as SchemaError).errors);
    }

    return validManifest;
};
