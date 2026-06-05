/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { executeGraphQlWithErrors } from './ExecuteGraphQlWithErrors';

describe('ExecuteGraphQlWithErrors', () => {
    it('should return correct method name', () => {
        const TEST_QUERY = 'query SomeQuery {}';
        const TEST_VARIABLES = { someVariable: 'someValue' };

        const graphQlCall = executeGraphQlWithErrors({
            query: TEST_QUERY,
            variables: TEST_VARIABLES,
        });

        expect(graphQlCall.name).toBe('executeGraphQlWithErrors');
        expect(graphQlCall.payload).toStrictEqual({
            query: TEST_QUERY,
            variables: TEST_VARIABLES,
        });
    });
});
