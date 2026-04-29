/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { verifyManifest } from '../../src/commands/verifyManifest';
import { Configuration, Logger } from '../../src/utils/index';

const TEST_BASE_URL = 'testing.frontify.test';
const TEST_APP_ID = 'cle76j1n70001cyw40exodwao';
const TEST_ACCESS_TOKEN = 'some_access_token';

const { mockHttpPost, mockManifest, mockReactiveJson } = vi.hoisted(() => {
    const manifest = { appId: 'cle76j1n70001cyw40exodwao' } as Record<string, unknown>;
    return {
        mockHttpPost: vi.fn(),
        mockManifest: manifest,
        mockReactiveJson: vi.fn(() => manifest),
    };
});

vi.mock('../../src/utils/reactiveJson', () => ({
    reactiveJson: mockReactiveJson,
}));

vi.mock('../../src/utils/httpClient', () => {
    const MockHttpClient = vi.fn();
    MockHttpClient.prototype.post = mockHttpPost;
    return { HttpClient: MockHttpClient };
});

describe('VerifyManifest command', () => {
    let oldTokens: unknown;
    let oldInstanceUrl: unknown;
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    const errorSpy = vi.spyOn(Logger, 'error').mockImplementation(() => {});
    vi.spyOn(Logger, 'info').mockImplementation(() => {});
    const successSpy = vi.spyOn(Logger, 'success').mockImplementation(() => {});

    beforeEach(() => {
        oldTokens = Configuration.get('tokens') || {};
        oldInstanceUrl = Configuration.get('instanceUrl') || '';
        vi.clearAllMocks();
        mockManifest.appId = TEST_APP_ID;
        delete mockManifest.appType;
        mockReactiveJson.mockImplementation(() => mockManifest);
    });

    afterEach(() => {
        Configuration.set('tokens', oldTokens);
        Configuration.set('instanceUrl', oldInstanceUrl);
    });

    test('should report valid manifest via the validation endpoint', async () => {
        mockHttpPost.mockResolvedValue({ success: true, data: { valid: true } });

        await verifyManifest({ token: TEST_ACCESS_TOKEN, instance: TEST_BASE_URL });

        expect(mockHttpPost).toHaveBeenCalledWith(
            '/api/marketplace/app/manifest/validate',
            { appType: 'CONTENT_BLOCK', manifest: mockManifest },
            { headers: { Authorization: `Bearer ${TEST_ACCESS_TOKEN}` } },
        );
        expect(successSpy).toHaveBeenCalledWith('The manifest is valid.');
        expect(exitSpy).not.toHaveBeenCalled();
    });

    test('should exit with error when manifest is invalid', async () => {
        mockHttpPost.mockResolvedValue({
            success: true,
            data: { valid: false, error: 'Invalid manifest: appId missing' },
        });

        await verifyManifest({ token: TEST_ACCESS_TOKEN, instance: TEST_BASE_URL });

        expect(errorSpy).toHaveBeenCalledWith('The manifest is invalid:', 'Invalid manifest: appId missing');
        expect(exitSpy).toHaveBeenCalledWith(-1);
    });

    test('should map platform-app manifest to PLATFORM_APP enum', async () => {
        mockManifest.appType = 'platform-app';
        mockHttpPost.mockResolvedValue({ success: true, data: { valid: true } });

        await verifyManifest({ token: TEST_ACCESS_TOKEN, instance: TEST_BASE_URL });

        expect(mockHttpPost).toHaveBeenCalledWith(
            '/api/marketplace/app/manifest/validate',
            { appType: 'PLATFORM_APP', manifest: mockManifest },
            expect.any(Object),
        );
    });

    test('should prefer explicit appType option over manifest value', async () => {
        mockManifest.appType = 'content-block';
        mockHttpPost.mockResolvedValue({ success: true, data: { valid: true } });

        await verifyManifest({ appType: 'theme', token: TEST_ACCESS_TOKEN, instance: TEST_BASE_URL });

        expect(mockHttpPost).toHaveBeenCalledWith(
            '/api/marketplace/app/manifest/validate',
            { appType: 'THEME', manifest: mockManifest },
            expect.any(Object),
        );
    });

    test('should exit when an unknown app type is passed', async () => {
        await verifyManifest({ appType: 'unknown-type', token: TEST_ACCESS_TOKEN, instance: TEST_BASE_URL });

        expect(errorSpy).toHaveBeenCalledWith(
            'An error occurred while verifying the manifest:',
            expect.stringContaining('Unknown app type'),
        );
        expect(exitSpy).toHaveBeenCalledWith(-1);
    });

    test('should exit with error when not logged in and no token provided', async () => {
        Configuration.delete('tokens');
        Configuration.delete('instanceUrl');

        await verifyManifest({});

        expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('not logged in'));
        expect(exitSpy).toHaveBeenCalledWith(-1);
    });

    test('should surface HTTP errors', async () => {
        mockHttpPost.mockRejectedValue({ responseBody: { error: 'Server down' } });

        await verifyManifest({ token: TEST_ACCESS_TOKEN, instance: TEST_BASE_URL });

        expect(errorSpy).toHaveBeenCalledWith('An error occurred while verifying the manifest:', 'Server down');
        expect(exitSpy).toHaveBeenCalledWith(-1);
    });

    test('should report Error message when manifest loading throws an Error', async () => {
        mockReactiveJson.mockImplementation(() => {
            throw new Error('manifest.json not found');
        });

        await verifyManifest({ token: TEST_ACCESS_TOKEN, instance: TEST_BASE_URL });

        expect(errorSpy).toHaveBeenCalledWith(
            'The manifest verification has failed due to an error:',
            'manifest.json not found',
        );
        expect(exitSpy).toHaveBeenCalledWith(-1);
    });

    test('should report string thrown from manifest loading', async () => {
        mockReactiveJson.mockImplementation(() => {
            // eslint-disable-next-line @typescript-eslint/only-throw-error
            throw 'unreadable manifest';
        });

        await verifyManifest({ token: TEST_ACCESS_TOKEN, instance: TEST_BASE_URL });

        expect(errorSpy).toHaveBeenCalledWith(
            'The manifest verification has failed due to an error:',
            'unreadable manifest',
        );
        expect(exitSpy).toHaveBeenCalledWith(-1);
    });

    test('should report unknown failure when a non-string non-Error is thrown', async () => {
        mockReactiveJson.mockImplementation(() => {
            // eslint-disable-next-line @typescript-eslint/only-throw-error
            throw 42;
        });

        await verifyManifest({ token: TEST_ACCESS_TOKEN, instance: TEST_BASE_URL });

        expect(errorSpy).toHaveBeenCalledWith('The manifest verification has failed due to an unknown error.');
        expect(exitSpy).toHaveBeenCalledWith(-1);
    });
});
