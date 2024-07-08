/* (c) Copyright Frontify Ltd., all rights reserved. */

export type GetAccountIdPayload = void;

export type GetAccountIdResponse = {
    id: string;
};

export const getAccountId = (payload: GetAccountIdPayload) => ({ name: 'getAccountId', payload });
