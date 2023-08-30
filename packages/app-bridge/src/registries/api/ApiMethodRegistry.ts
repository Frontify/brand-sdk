/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { ApiMethodNameValidator } from '../../AppBridge';
import type { GetCurrentUserPayload, GetCurrentUserResponse } from './GetCurrentUser';
import { GetAssetResourceInfoPayload, GetAssetResourceInfoResponse } from './GetAssetResourceInfo';

export type ApiMethodRegistry = ApiMethodNameValidator<{
    getCurrentUser: { payload: GetCurrentUserPayload; response: GetCurrentUserResponse };
    getAssetResourceUrl: { payload: GetAssetResourceInfoPayload; response: GetAssetResourceInfoResponse };
}>;
