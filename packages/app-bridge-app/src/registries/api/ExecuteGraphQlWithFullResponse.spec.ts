/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { executeGraphQlWithFullResponse } from './ExecuteGraphQlWithFullResponse';

describe('ExecuteGraphQlWithFullResponse', () => {
    it('should return correct method name', () => {
        const TEST_QUERY = 'query SomeQuery {}';
        const TEST_VARIABLES = { someVariable: 'someValue' };

        const graphQlCall = executeGraphQlWithFullResponse({
            query: TEST_QUERY,
            variables: TEST_VARIABLES,
        });

        expect(graphQlCall.name).toBe('executeGraphQlWithFullResponse');
        expect(graphQlCall.payload).toStrictEqual({
            query: TEST_QUERY,
            variables: TEST_VARIABLES,
        });
    });
});
