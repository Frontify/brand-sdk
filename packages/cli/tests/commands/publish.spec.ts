/* (c) Copyright Frontify Ltd., all rights reserved. */

import nock from 'nock';
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

const CURRENT_USER_RESPONSE = {
    data: {
        currentUser: {
            email: 'test@frontify.test',
            name: 'Test User',
        },
    },
};

const PUBLISH_SUCCESS_RESPONSE = {
    data: {
        publishMarketplaceApp: {
            id: 'published-app-id',
        },
    },
};

vi.mock('../../src/utils/reactiveJson', () => ({
    reactiveJson: () => ({ appId: TEST_APP_ID }),
}));

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
        nock.cleanAll();
    });

    test('should publish app successfully with token and instance options', async () => {
        const testMockApi = nock(`https://${TEST_BASE_URL}`);
        testMockApi.post('/graphql', { query: '{ currentUser { email name } }' }).reply(200, CURRENT_USER_RESPONSE);
        testMockApi.post('/graphql').reply(200, PUBLISH_SUCCESS_RESPONSE);

        await publishApp({
            releaseNotes: 'Initial release',
            availability: Availability.PRIVATE,
            token: TEST_ACCESS_TOKEN,
            instance: TEST_BASE_URL,
        });

        expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('Test User'));
        expect(successSpy).toHaveBeenCalledWith('The app has been published successfully.');
        expect(exitSpy).not.toHaveBeenCalled();
    });

    test('should publish app with COMMUNITY availability', async () => {
        const testMockApi = nock(`https://${TEST_BASE_URL}`);
        testMockApi.post('/graphql', { query: '{ currentUser { email name } }' }).reply(200, CURRENT_USER_RESPONSE);
        testMockApi.post('/graphql').reply(200, PUBLISH_SUCCESS_RESPONSE);

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

        const testMockApi = nock(`https://${TEST_BASE_URL}`);
        testMockApi.post('/graphql', { query: '{ currentUser { email name } }' }).reply(200, CURRENT_USER_RESPONSE);
        testMockApi.post('/graphql').reply(200, PUBLISH_SUCCESS_RESPONSE);

        await publishApp({ releaseNotes: 'Release notes' });

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
        const testMockApi = nock(`https://${TEST_BASE_URL}`);
        testMockApi
            .post('/graphql', { query: '{ currentUser { email name } }' })
            .reply(200, { data: { currentUser: null } });

        await publishApp({
            releaseNotes: 'Release notes',
            token: TEST_ACCESS_TOKEN,
            instance: TEST_BASE_URL,
        });

        expect(exitSpy).toHaveBeenCalledWith(-1);
    });

    test('should exit with error when GraphQL publish mutation fails', async () => {
        const testMockApi = nock(`https://${TEST_BASE_URL}`);
        testMockApi.post('/graphql', { query: '{ currentUser { email name } }' }).reply(200, CURRENT_USER_RESPONSE);
        testMockApi.post('/graphql').reply(400, { error: 'Publish failed' });

        await publishApp({
            releaseNotes: 'Release notes',
            token: TEST_ACCESS_TOKEN,
            instance: TEST_BASE_URL,
        });

        expect(errorSpy).toHaveBeenCalledWith('An error occurred while publishing:', expect.any(String));
        expect(exitSpy).toHaveBeenCalledWith(-1);
    });

    test('should default availability to PRIVATE', async () => {
        const testMockApi = nock(`https://${TEST_BASE_URL}`);
        testMockApi.post('/graphql', { query: '{ currentUser { email name } }' }).reply(200, CURRENT_USER_RESPONSE);
        testMockApi
            .post('/graphql', (body: { query: string }) => body.query.includes('PRIVATE'))
            .reply(200, PUBLISH_SUCCESS_RESPONSE);

        await publishApp({
            releaseNotes: 'Release notes',
            token: TEST_ACCESS_TOKEN,
            instance: TEST_BASE_URL,
        });

        expect(successSpy).toHaveBeenCalledWith('The app has been published successfully.');
    });
});
