/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { ApiMethodNameValidator } from './AppBridge';

type CreateAssetPayload = {
    name: string;
};

type GetCurrentUserPayload = void;

type CreateAssetResponse = {
    jobId: string;
};

type GetCurrentUserResponse = {
    id: string;
    name: string | null;
    avatar: string;
    email: string;
};

type CreateAttachmentPayload = {
    name: string;
};

type CreateAttachmentReponse = {
    attachmentId: string;
};

export type ApiMethodRegistry = ApiMethodNameValidator<{
    createAsset: { payload: CreateAssetPayload; response: CreateAssetResponse };
    createAttachment: { payload: CreateAttachmentPayload; response: CreateAttachmentReponse };
    getCurrentUser: { payload: GetCurrentUserPayload; response: GetCurrentUserResponse };
}>;
