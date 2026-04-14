/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { Availability, publishApp } from '../../src/commands/publish';
import { Configuration, Logger } from '../../src/utils/index';

const TEST_BASE_URL = 'testing.frontify.test';
const TEST_APP_ID = 'test-app-id';
const TEST_ACCESS_TOKEN = 'some_access_token';

const DUMMY_TOKENS = {
    token_type: 'Bearer',
    expires_in: 2592000,
    access_token: TEST_ACCESS_TOKEN,
    refresh_token: 'some_refresh_token',
};

const TEST_USER = {
    email: 'test@frontify.test',
    name: 'Test User',
};

const { mockGetUser, mockHttpPost } = vi.hoisted(() => ({
    mockGetUser: vi.fn(),
    mockHttpPost: vi.fn(),
}));

vi.mock('../../src/utils/reactiveJson', () => ({
    reactiveJson: () => ({ appId: TEST_APP_ID }),
}));

vi.mock('../../src/utils/user', () => ({
    getUser: mockGetUser,
}));

vi.mock('../../src/utils/httpClient', () => {
    const MockHttpClient = vi.fn();
    MockHttpClient.prototype.post = mockHttpPost;
    return { HttpClient: MockHttpClient };
});

describe('Publish command', () => {
    let oldTokens: unknown;
    let oldInstanceUrl: unknown;
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    const errorSpy = vi.spyOn(Logger, 'error').mockImplementation(() => {});
    const infoSpy = vi.spyOn(Logger, 'info').mockImplementation(() => {});
    const successSpy = vi.spyOn(Logger, 'success').mockImplementation(() => {});

    beforeEach(() => {
        oldTokens = Configuration.get('tokens') || {};
        oldInstanceUrl = Configuration.get('instanceUrl') || '';
        vi.clearAllMocks();
    });

    afterEach(() => {
        Configuration.set('tokens', oldTokens);
        Configuration.set('instanceUrl', oldInstanceUrl);
    });

    test('should publish app successfully with token and instance options', async () => {
        mockGetUser.mockResolvedValue(TEST_USER);
        mockHttpPost.mockResolvedValue({ data: { publishMarketplaceApp: { id: 'published-app-id' } } });

        await publishApp({
            releaseNotes: 'Initial release',
            availability: Availability.PRIVATE,
            token: TEST_ACCESS_TOKEN,
            instance: TEST_BASE_URL,
        });

        expect(mockGetUser).toHaveBeenCalledWith(TEST_BASE_URL, TEST_ACCESS_TOKEN);
        expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('Test User'));
        expect(successSpy).toHaveBeenCalledWith('The app has been published successfully.');
        expect(exitSpy).not.toHaveBeenCalled();
    });

    test('should publish app with COMMUNITY availability', async () => {
        mockGetUser.mockResolvedValue(TEST_USER);
        mockHttpPost.mockResolvedValue({ data: { publishMarketplaceApp: { id: 'published-app-id' } } });

        await publishApp({
            releaseNotes: 'Community release',
            availability: Availability.COMMUNITY,
            token: TEST_ACCESS_TOKEN,
            instance: TEST_BASE_URL,
        });

        expect(successSpy).toHaveBeenCalledWith('The app has been published successfully.');
    });

    test('should use stored configuration when no token/instance provided', async () => {
        Configuration.set('tokens', DUMMY_TOKENS);
        Configuration.set('instanceUrl', TEST_BASE_URL);

        mockGetUser.mockResolvedValue(TEST_USER);
        mockHttpPost.mockResolvedValue({ data: { publishMarketplaceApp: { id: 'published-app-id' } } });

        await publishApp({ releaseNotes: 'Release notes' });

        expect(mockGetUser).toHaveBeenCalledWith(TEST_BASE_URL, undefined);
        expect(successSpy).toHaveBeenCalledWith('The app has been published successfully.');
    });

    test('should exit with error when not logged in and no token provided', async () => {
        Configuration.delete('tokens');
        Configuration.delete('instanceUrl');

        await publishApp({ releaseNotes: 'Release notes' });

        expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('not logged in'));
        expect(exitSpy).toHaveBeenCalledWith(-1);
    });

    test('should exit with error when getUser returns undefined', async () => {
        mockGetUser.mockResolvedValue(undefined);

        await publishApp({
            releaseNotes: 'Release notes',
            token: TEST_ACCESS_TOKEN,
            instance: TEST_BASE_URL,
        });

        expect(exitSpy).toHaveBeenCalledWith(-1);
    });

    test('should exit with error when GraphQL publish mutation fails', async () => {
        mockGetUser.mockResolvedValue(TEST_USER);
        mockHttpPost.mockRejectedValue({ responseBody: { error: 'Publish failed' } });

        await publishApp({
            releaseNotes: 'Release notes',
            token: TEST_ACCESS_TOKEN,
            instance: TEST_BASE_URL,
        });

        expect(errorSpy).toHaveBeenCalledWith('An error occurred while publishing:', 'Publish failed');
        expect(exitSpy).toHaveBeenCalledWith(-1);
    });

    test('should default availability to PRIVATE', async () => {
        mockGetUser.mockResolvedValue(TEST_USER);
        mockHttpPost.mockResolvedValue({ data: { publishMarketplaceApp: { id: 'published-app-id' } } });

        await publishApp({
            releaseNotes: 'Release notes',
            token: TEST_ACCESS_TOKEN,
            instance: TEST_BASE_URL,
        });

        expect(mockHttpPost).toHaveBeenCalledWith(
            '/graphql',
            expect.objectContaining({ query: expect.stringContaining('PRIVATE') }),
            expect.any(Object),
        );
        expect(successSpy).toHaveBeenCalledWith('The app has been published successfully.');
    });
});
