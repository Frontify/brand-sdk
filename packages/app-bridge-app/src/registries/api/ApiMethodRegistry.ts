/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type PlatformAppApiMethodNameValidator } from '../../types/Api.ts';

import { type CreateAssetPayload, type CreateAssetResponse } from './CreateAsset';
import { type ExecuteGraphQlPayload, type ExecuteGraphQlResponse } from './ExecuteGraphQl.ts';
import { type ExecuteSecureRequestPayload, type ExecuteSecureRequestResponse } from './ExecuteSecureRequest.ts';
import { type GetAccountIdPayload, type GetAccountIdResponse } from './GetAccountId.ts';
import {
    type GetAssetResourceInformationPayload,
    type GetAssetResourceInformationResponse,
} from './GetAssetResourceInformation';
import { type GetCurrentUserPayload, type GetCurrentUserResponse } from './GetCurrentUser';
import { type GetSecureRequestPayload, type GetSecureRequestResponse } from './GetSecureRequest.ts';

export type ApiMethodRegistry = PlatformAppApiMethodNameValidator<{
    getCurrentUser: { payload: GetCurrentUserPayload; response: GetCurrentUserResponse };
    createAsset: { payload: CreateAssetPayload; response: CreateAssetResponse };
    getAssetResourceInformation: {
        payload: GetAssetResourceInformationPayload;
        response: GetAssetResourceInformationResponse;
    };
    getSecureRequest: { payload: GetSecureRequestPayload; response: GetSecureRequestResponse };
    getAccountId: { payload: GetAccountIdPayload; response: GetAccountIdResponse };
    executeGraphQl: { payload: ExecuteGraphQlPayload; response: ExecuteGraphQlResponse };
    executeSecureRequest: { payload: ExecuteSecureRequestPayload; response: ExecuteSecureRequestResponse };
}>;
