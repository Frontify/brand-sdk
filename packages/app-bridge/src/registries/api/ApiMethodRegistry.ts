/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type ApiMethodNameValidator } from '../../AppBridge';

import { type CreateAssetBulkDownloadPayload, type CreateAssetBulkDownloadResponse } from './CreateAssetBulkDownload';
import { type CreateAssetsPayload, type CreateAssetsResponse } from './CreateAssets';
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
    createAssetBulkDownload: {
        payload: CreateAssetBulkDownloadPayload;
        response: CreateAssetBulkDownloadResponse;
    };
    createAssets: { payload: CreateAssetsPayload; response: CreateAssetsResponse };
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
