/* (c) Copyright Frontify Ltd., all rights reserved. */

type CreateAssetPayload = {
    name: string;
};

type CurrentUserPayload = void;

type CreateAssetResponse = {
    jobId: string;
};

type CurrentUserResponse = {
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

export type ApiMethodsRegistry = {
    createAsset: { payload: CreateAssetPayload; response: CreateAssetResponse };
    createAttachemnt: { payload: CreateAttachmentPayload; response: CreateAttachmentReponse };
    currentUser: { payload: CurrentUserPayload; response: CurrentUserResponse };
};
