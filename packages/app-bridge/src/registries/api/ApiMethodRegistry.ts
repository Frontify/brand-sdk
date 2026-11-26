/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type ApiMethodNameValidator } from '../../AppBridge';

import { type CreateAssetBulkDownloadPayload, type CreateAssetBulkDownloadResponse } from './CreateAssetBulkDownload';
import { type CreateAssetsPayload, type CreateAssetsResponse } from './CreateAssets';
import {
    type GetAssetBulkDownloadTokenPayload,
    type GetAssetBulkDownloadTokenResponse,
} from './GetAssetBulkDownloadToken';
import { type GetCurrentUserPayload, type GetCurrentUserResponse } from './GetCurrentUser';
import { type GetLinkDestinationsPayload, type GetLinkDestinationsResponse } from './GetLinkDestinations';
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
    /**
     * @deprecated This will be removed in version 5.0.0 of `@frontify/app-bridge`.
     * Use the `createAssetBulkDownload` API method instead, or the `useAssetBulkDownload` hook. They wait until the download is ready.
     */
    getAssetBulkDownloadToken: {
        payload: GetAssetBulkDownloadTokenPayload;
        response: GetAssetBulkDownloadTokenResponse;
    };
    getLinkDestinations: { payload: GetLinkDestinationsPayload; response: GetLinkDestinationsResponse };
    setAssetIdsByBlockAssetKey: {
        payload: SetAssetIdsByBlockAssetKeyPayload;
        response: SetAssetIdsByBlockAssetKeyResponse;
    };
}>;
