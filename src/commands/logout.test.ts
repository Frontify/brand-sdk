import { Configuration } from '../utils/configuration';
import { logoutUser } from './logout';
import { describe, expect, test } from 'vitest';

const dummyTokens = {
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
            Configuration.set('tokens', dummyTokens);
            logoutUser();
            expect(Configuration.get('tokens')).toBeUndefined();
            Configuration.set('tokens', oldTokens);
        });
    });
});
