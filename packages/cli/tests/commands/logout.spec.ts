/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, test } from 'vitest';
import { logoutUser } from '../../src/commands/logout.js';
import { Configuration } from '../../src/utils/index.js';

const DUMMY_TOKENS = {
    token_type: 'Bearer',
    expires_in: 2592000,
    access_token: 'some_access_token',
    refresh_token: 'some_refresh_token',
};

describe('Logout command', () => {
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
