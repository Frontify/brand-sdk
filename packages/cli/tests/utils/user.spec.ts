/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

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

const { mockHttpPost } = vi.hoisted(() => ({
    mockHttpPost: vi.fn(),
}));

vi.mock('../../src/utils/httpClient', () => {
    const MockHttpClient = vi.fn();
    MockHttpClient.prototype.post = mockHttpPost;
    return { HttpClient: MockHttpClient };
});

describe('User utils', () => {
    beforeEach(() => {
        mockHttpPost.mockResolvedValue(GET_USER_API_RESPONSE);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('getUser', () => {
        test('should get user object', async () => {
            const oldTokens = Configuration.get('tokens') || {};
            Configuration.set('tokens', DUMMY_TOKENS.tokens);
            expect(await getUser(TEST_BASE_URL)).toEqual(DUMMY_TOKENS);
            Configuration.set('tokens', oldTokens);
        });

        test('should get user object with token', async () => {
            expect(await getUser(TEST_BASE_URL, 'some_access_token')).toEqual(DUMMY_TOKENS);
        });
    });
});
