/* (c) Copyright Frontify Ltd., all rights reserved. */

export type ExecuteSecureRequestPayload = {
    endpoint: string;
    requestParams: unknown;
};

export type ExecuteSecureRequestResponse = Response;

export const exeucteSecureRequest = (payload: ExecuteSecureRequestPayload) => ({
    name: 'executeSecureRequest',
    payload,
});
