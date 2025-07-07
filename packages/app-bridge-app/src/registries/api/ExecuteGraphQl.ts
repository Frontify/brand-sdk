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

export const executeGraphQl = (
    payload: ExecuteGraphQlPayload,
): { name: 'executeGraphQl'; payload: ExecuteGraphQlPayload } => ({
    name: 'executeGraphQl',
    payload,
});
