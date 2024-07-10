/* (c) Copyright Frontify Ltd., all rights reserved. */

export type GraphQlPayload = {
    query: string;
    variables?: Record<string, any>;
};

export type GraphQlResponse = Record<string, any>;

export const graphQl = (payload: GraphQlPayload): { name: 'graphQl'; payload: GraphQlPayload } => ({
    name: 'graphQl',
    payload,
});
