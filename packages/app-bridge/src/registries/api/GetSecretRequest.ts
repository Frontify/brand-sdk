/* (c) Copyright Frontify Ltd., all rights reserved. */

export type GetSecretRequestPayload = {
    id: string;
    requestParams: unknown;
};

export type GetSecretRequestResponse = {
    data: unknown;
};

export const getSecretRequest = (payload: GetSecretRequestPayload) => ({
    name: 'getSecretRequest',
    payload,
});
