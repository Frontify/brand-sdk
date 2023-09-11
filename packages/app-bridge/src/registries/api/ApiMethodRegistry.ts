/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { ApiMethodNameValidator } from '../../AppBridge';
import type { GetCurrentUserPayload, GetCurrentUserResponse } from './GetCurrentUser';
import { GetCreateAssetPayload, GetCreateAssetResponse } from './CreateAsset';
import type { GetAssetResourceInfoPayload, GetAssetResourceInfoResponse } from './GetAssetResourceInfo';

export type ApiMethodRegistry = ApiMethodNameValidator<{
    getCurrentUser: { payload: GetCurrentUserPayload; response: GetCurrentUserResponse };
    createAsset: { payload: GetCreateAssetPayload; response: GetCreateAssetResponse };
    getAssetResourceInfo: { payload: GetAssetResourceInfoPayload; response: GetAssetResourceInfoResponse };
}>;
