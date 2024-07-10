/* (c) Copyright Frontify Ltd., all rights reserved. */

export type ExecuteGraphQlPayload = {
    query: string;
    variables?: Record<string, any>;
};

export type ExecuteGraphQlResponse = Record<string, any>;

export const executeGraphQl = (
    payload: ExecuteGraphQlPayload,
): { name: 'executeGraphQl'; payload: ExecuteGraphQlPayload } => ({
    name: 'executeGraphQl',
    payload,
});
