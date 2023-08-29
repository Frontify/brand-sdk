/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { ApiMethodNameValidator } from '../../AppBridge';
import type { GetAssetBulkDownloadTokenPayload, GetAssetBulkDownloadTokenResponse } from './GetAssetBulkDownloadToken';
import type { GetCurrentUserPayload, GetCurrentUserResponse } from './GetCurrentUser';

export type ApiMethodRegistry = ApiMethodNameValidator<{
    getAssetBulkDownloadToken: {
        payload: GetAssetBulkDownloadTokenPayload;
        response: GetAssetBulkDownloadTokenResponse;
    };
    getCurrentUser: { payload: GetCurrentUserPayload; response: GetCurrentUserResponse };
}>;
