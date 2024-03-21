/* (c) Copyright Frontify Ltd., all rights reserved. */

export type GetProxyNetworkCallPayload = {
    id: string;
    props: unknown;
};

export type GetProxyNetworkCallResponse = {
    data: unknown;
};

export const getProxyNetworkCall = (payload: GetProxyNetworkCallPayload) => ({ name: 'getProxyNetworkCall', payload });
