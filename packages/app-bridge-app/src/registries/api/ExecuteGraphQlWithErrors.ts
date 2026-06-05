/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type ExecuteGraphQlPayload } from './ExecuteGraphQl.ts';

export type ExecuteGraphQlWithErrorsPayload = ExecuteGraphQlPayload;

export type GraphQlError = {
    message: string;
    locations?: { line: number; column: number }[];
    path?: (string | number)[];
    extensions?: Record<string, any>;
};

/**
 * Unlike `executeGraphQl`, which resolves only the `data` field of the GraphQL response,
 * this resolves the full GraphQL response envelope, including the top-level `errors` array
 * (and `extensions`, if present).
 */
export type ExecuteGraphQlWithErrorsResponse = {
    data?: Record<string, any> | null;
    errors?: GraphQlError[];
    extensions?: Record<string, any>;
};

export const executeGraphQlWithErrors = (
    payload: ExecuteGraphQlWithErrorsPayload,
): { name: 'executeGraphQlWithErrors'; payload: ExecuteGraphQlWithErrorsPayload } => ({
    name: 'executeGraphQlWithErrors',
    payload,
});
