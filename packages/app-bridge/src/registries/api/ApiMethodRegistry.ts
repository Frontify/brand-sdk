/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { ApiMethodNameValidator } from '../../AppBridge';
import type { GetAssetBulkDownloadTokenPayload, GetAssetBulkDownloadTokenResponse } from './GetAssetBulkDownloadToken';
import type { GetCurrentUserPayload, GetCurrentUserResponse } from './GetCurrentUser';
import { CreateAssetPayload, CreateAssetResponse } from './CreateAsset';
import type { GetAssetResourceInfoPayload, GetAssetResourceInfoResponse } from './GetAssetResourceInfo';

export type ApiMethodRegistry = ApiMethodNameValidator<{
    getAssetBulkDownloadToken: {
        payload: GetAssetBulkDownloadTokenPayload;
        response: GetAssetBulkDownloadTokenResponse;
    };
    getCurrentUser: { payload: GetCurrentUserPayload; response: GetCurrentUserResponse };
    createAsset: { payload: CreateAssetPayload; response: CreateAssetResponse };
    getAssetResourceInfo: { payload: GetAssetResourceInfoPayload; response: GetAssetResourceInfoResponse };
}>;
