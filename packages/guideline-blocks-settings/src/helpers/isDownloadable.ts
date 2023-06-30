/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Security } from '../settings/types';

export const isDownloadable = (security: Security, downloadable: boolean, globalAssetDownloadEnabled: boolean) => {
    return security === Security.Custom ? downloadable : globalAssetDownloadEnabled;
};
