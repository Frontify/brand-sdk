/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type ApiMethodNameValidator } from '../../AppBridge';

import { type CreateAssetPayload, type CreateAssetResponse } from './CreateAsset';
import {
    type GetAssetBulkDownloadTokenPayload,
    type GetAssetBulkDownloadTokenResponse,
} from './GetAssetBulkDownloadToken';
import {
    type GetAssetResourceInformationPayload,
    type GetAssetResourceInformationResponse,
} from './GetAssetResourceInformation';
import { type GetCurrentUserPayload, type GetCurrentUserResponse } from './GetCurrentUser';
import { type GetDocumentNavigationPayload, type GetDocumentNavigationResponse } from './GetDocumentNavigation';
import { type GetPortalNavigationResponse } from './GetPortalNavigation';
import { type GetSecretRequestPayload, type GetSecretRequestResponse } from './GetSecretRequest.ts';
import {
    type SetAssetIdsByBlockAssetKeyPayload,
    type SetAssetIdsByBlockAssetKeyResponse,
} from './SetAssetIdsByBlockAssetKey';

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
    setAssetIdsByBlockAssetKey: {
        payload: SetAssetIdsByBlockAssetKeyPayload;
        response: SetAssetIdsByBlockAssetKeyResponse;
    };
    getSecretRequest: { payload: GetSecretRequestPayload; response: GetSecretRequestResponse };
    getDocumentNavigation: { payload: GetDocumentNavigationPayload; response: GetDocumentNavigationResponse };
    getPortalNavigation: { payload: void; response: GetPortalNavigationResponse };
}>;
