/* (c) Copyright Frontify Ltd., all rights reserved. */

import nock from 'nock';
import { beforeAll, describe, expect, test } from 'vitest';

import { Configuration } from '../../src/utils/configuration';
import { getUser } from '../../src/utils/user';

const DUMMY_TOKENS = {
    tokens: {
        token_type: 'Bearer',
        expires_in: 2592000,
        access_token: 'some_access_token',
        refresh_token: 'some_refresh_token',
    },
};

const GET_USER_API_RESPONSE = {
    data: {
        currentUser: DUMMY_TOKENS,
    },
};

const TEST_BASE_URL = 'testing.frontify.test';

describe('User utils', () => {
    beforeAll(() => {
        const testMockApi = nock(`https://${TEST_BASE_URL}`);
        testMockApi.post('/graphql', { query: '{ currentUser { email name } }' }).reply(200, GET_USER_API_RESPONSE);
    });

    describe('getUser', () => {
        test('should get user object', async () => {
            // TODO: We shall have a different object for test and prod/dev as it would override existing tokens from the user if testing locally
            const oldTokens = Configuration.get('tokens') || {};
            Configuration.set('tokens', DUMMY_TOKENS.tokens);
            expect(await getUser(TEST_BASE_URL)).toEqual(DUMMY_TOKENS);
            Configuration.set('tokens', oldTokens);
        });
    });
});
