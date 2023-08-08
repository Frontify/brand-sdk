/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { ApiMethodNameValidator } from '../AppBridge';

type GetCurrentUserPayload = void;

type GetCurrentUserResponse = {
    id: string;
    name?: string | null;
    avatar?: string | null;
    email: string;
};

export type ApiMethodRegistry = ApiMethodNameValidator<{
    getCurrentUser: { payload: GetCurrentUserPayload; response: GetCurrentUserResponse };
}>;
