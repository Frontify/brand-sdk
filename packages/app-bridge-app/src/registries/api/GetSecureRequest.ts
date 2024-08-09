/* (c) Copyright Frontify Ltd., all rights reserved. */

export type GetSecureRequestPayload = {
    endpoint: string;
    requestParams: unknown;
};

export type GetSecureRequestResponse = Response;

export const getSecureRequest = (payload: GetSecureRequestPayload) => ({
    name: 'getSecureRequest',
    payload,
});
