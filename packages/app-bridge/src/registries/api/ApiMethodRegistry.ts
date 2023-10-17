/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { ApiMethodNameValidator } from '../../AppBridge';
import type { GetAssetBulkDownloadTokenPayload, GetAssetBulkDownloadTokenResponse } from './GetAssetBulkDownloadToken';
import type { GetCurrentUserPayload, GetCurrentUserResponse } from './GetCurrentUser';
import { CreateAssetPayload, CreateAssetResponse } from './CreateAsset';
import type {
    GetAssetResourceInformationPayload,
    GetAssetResourceInformationResponse,
} from './GetAssetResourceInformation';

export type ApiMethodRegistry = ApiMethodNameValidator<{
    getAssetBulkDownloadToken: {
        payload: GetAssetBulkDownloadTokenPayload;
        response: GetAssetBulkDownloadTokenResponse;
    };
    getCurrentUser: { payload: GetCurrentUserPayload; response: GetCurrentUserResponse };
    createAsset: { payload: CreateAssetPayload; response: CreateAssetResponse };
    getAssetResourceInformation: {
        payload: GetAssetResourceInformationPayload;
        response: GetAssetResourceInformationResponse;
    };
}>;
