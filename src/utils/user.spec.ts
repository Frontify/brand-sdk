/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, test } from 'vitest';
// import { DUMMY_TOKENS, TEST_BASE_URL } from '../tests/server';

import { Configuration } from './configuration';
import { getUser } from './user';

describe.skip('User utils', () => {
    describe('getUser', () => {
        test('should get user object', async () => {
            //TODO: We shall have a different object for test and prod/dev as it would override existing tokens from the user if testing locally
            const oldTokens = Configuration.get('tokens') || {};
            Configuration.set('tokens', DUMMY_TOKENS.tokens);
            expect(await getUser(TEST_BASE_URL)).toEqual(DUMMY_TOKENS);
            Configuration.set('tokens', oldTokens);
        });
    });
});
