/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type ApiMethodNameValidator } from '../../AppBridge';

import {
    type GetAssetBulkDownloadTokenPayload,
    type GetAssetBulkDownloadTokenResponse,
} from './GetAssetBulkDownloadToken';
import { type GetCurrentUserPayload, type GetCurrentUserResponse } from './GetCurrentUser.ts';
import {
    type SetAssetIdsByBlockAssetKeyPayload,
    type SetAssetIdsByBlockAssetKeyResponse,
} from './SetAssetIdsByBlockAssetKey';

export type ApiMethodRegistry = ApiMethodNameValidator<{
    getCurrentUser: { payload: GetCurrentUserPayload; response: GetCurrentUserResponse };
    getAssetBulkDownloadToken: {
        payload: GetAssetBulkDownloadTokenPayload;
        response: GetAssetBulkDownloadTokenResponse;
    };
    setAssetIdsByBlockAssetKey: {
        payload: SetAssetIdsByBlockAssetKeyPayload;
        response: SetAssetIdsByBlockAssetKeyResponse;
    };
}>;
