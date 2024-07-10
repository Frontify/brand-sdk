/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { executeGraphQl } from './ExecuteGraphQl';

describe('ExecuteGraphQl', () => {
    it('should return correct method name', () => {
        const TEST_QUERY = 'query SomeQuery {}';
        const TEST_VARIABLES = { someVariable: 'someValue' };

        const graphQlCall = executeGraphQl({
            query: TEST_QUERY,
            variables: TEST_VARIABLES,
        });

        expect(graphQlCall.name).toBe('executeGraphQl');
        expect(graphQlCall.payload).toStrictEqual({
            query: TEST_QUERY,
            variables: TEST_VARIABLES,
        });
    });
});
