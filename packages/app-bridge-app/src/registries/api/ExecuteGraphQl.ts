/* (c) Copyright Frontify Ltd., all rights reserved. */

export type ExecuteGraphQlPayload = {
    query: string;
    variables?: Record<string, any>;
    /**
     * @property beta - If set to true, beta features will be enabled.
     * Attention: All Beta APIs can and will change without any warning. Be advised not to use those in production, see them as a preview of what is to come.
     */
    beta?: boolean;
    previewFeatures?: string[];
};

export type ExecuteGraphQlResponse = Record<string, any>;

/**
 * @deprecated Use `executeGraphQlWithErrors` instead. `executeGraphQl` resolves only the
 * `data` field of the GraphQL response, so the top-level `errors` array is not accessible
 * to the consuming app. `executeGraphQlWithErrors` resolves the full response envelope,
 * including `errors`.
 */
export const executeGraphQl = (
    payload: ExecuteGraphQlPayload,
): { name: 'executeGraphQl'; payload: ExecuteGraphQlPayload } => ({
    name: 'executeGraphQl',
    payload,
});
