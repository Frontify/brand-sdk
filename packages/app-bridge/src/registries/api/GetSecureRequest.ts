/* (c) Copyright Frontify Ltd., all rights reserved. */

export type GetSecureRequestPayload = {
    endpoint: string;
    requestParams: unknown;
};

export type GetSecureRequestResponse = {
    data: unknown;
    header: Record<string, string>;
    status: string;
};

export const getSecureRequest = (payload: GetSecureRequestPayload) => ({
    name: 'getSecureRequest',
    payload,
});
