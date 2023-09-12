/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { ApiMethodNameValidator } from '../../AppBridge';
import type { GetCurrentUserPayload, GetCurrentUserResponse } from './GetCurrentUser';
import type { GetAssetResourceInfoPayload, GetAssetResourceInfoResponse } from './GetAssetResourceInfo';

export type ApiMethodRegistry = ApiMethodNameValidator<{
    getCurrentUser: { payload: GetCurrentUserPayload; response: GetCurrentUserResponse };
    getAssetResourceInfo: { payload: GetAssetResourceInfoPayload; response: GetAssetResourceInfoResponse };
}>;
