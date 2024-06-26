/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type ApiMethodNameValidator } from '@frontify/app-bridge';

import { type CreateAssetPayload, type CreateAssetResponse } from './CreateAsset';
import {
    type GetAssetResourceInformationPayload,
    type GetAssetResourceInformationResponse,
} from './GetAssetResourceInformation';
import { type GetCurrentUserPayload, type GetCurrentUserResponse } from './GetCurrentUser';
import { type GetSecureRequestPayload, type GetSecureRequestResponse } from './GetSecureRequest.ts';

export type ApiMethodRegistry = ApiMethodNameValidator<{
    getCurrentUser: { payload: GetCurrentUserPayload; response: GetCurrentUserResponse };
    createAsset: { payload: CreateAssetPayload; response: CreateAssetResponse };
    getAssetResourceInformation: {
        payload: GetAssetResourceInformationPayload;
        response: GetAssetResourceInformationResponse;
    };
    getSecureRequest: { payload: GetSecureRequestPayload; response: GetSecureRequestResponse };
}>;
