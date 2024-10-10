/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { graphQl } from './GraphQl';

describe('GraphQl', () => {
    it('should return correct method name', () => {
        const TEST_QUERY = 'query SomeQuery {}';
        const TEST_VARIABLES = { someVariable: 'someValue' };

        const graphQlCall = graphQl({
            query: TEST_QUERY,
            variables: TEST_VARIABLES,
        });

        expect(graphQlCall.name).toBe('graphQl');
        expect(graphQlCall.payload).toStrictEqual({
            query: TEST_QUERY,
            variables: TEST_VARIABLES,
        });
    });
});
