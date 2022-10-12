/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, test } from 'vitest';
import { logoutUser } from './logout';
import { Configuration } from '../utils';
// import { DUMMY_TOKENS } from '../tests/server';

describe.skip('Logout command', () => {
    describe('logoutUser', () => {
        test('should disconnect user and delete tokens', async () => {
            //TODO: We shall have a different object for test and prod/dev as it would override existing tokens from the user if testing locally
            const oldTokens = Configuration.get('tokens') || {};
            Configuration.set('tokens', DUMMY_TOKENS);
            logoutUser();
            expect(Configuration.get('tokens')).toBeUndefined();
            Configuration.set('tokens', oldTokens);
        });
    });
});
