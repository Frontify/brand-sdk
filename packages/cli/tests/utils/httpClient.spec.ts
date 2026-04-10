/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { HttpClient } from '../../src/utils/httpClient';

const BODY_OBJECT = { some: 'body', told: 'me' };
const TEST_BASE_URL = 'testing.frontify.test';

const mockFetch = vi.fn();

describe('HttpClient utils', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', mockFetch);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const httpClient = new HttpClient(TEST_BASE_URL);

    test('should make GET call and resolve the response', async () => {
        mockFetch.mockResolvedValue(new Response(null, { status: 200 }));

        expect(await httpClient.get('/api/get-test')).toEqual(undefined);
        expect(mockFetch).toHaveBeenCalledWith(
            `https://${TEST_BASE_URL}/api/get-test`,
            expect.objectContaining({ method: 'GET' }),
        );
    });

    test('should make POST call with a body and resolve the response', async () => {
        mockFetch.mockResolvedValue(
            new Response(JSON.stringify(BODY_OBJECT), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }),
        );

        expect(await httpClient.post('/api/post-test-with-body', BODY_OBJECT)).toEqual(BODY_OBJECT);
        expect(mockFetch).toHaveBeenCalledWith(
            `https://${TEST_BASE_URL}/api/post-test-with-body`,
            expect.objectContaining({ method: 'POST', body: JSON.stringify(BODY_OBJECT) }),
        );
    });

    test('should make POST call without body and resolve the response', async () => {
        mockFetch.mockResolvedValue(
            new Response(JSON.stringify(BODY_OBJECT), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }),
        );

        expect(await httpClient.post('/api/post-test-without-body')).toEqual(BODY_OBJECT);
    });

    test('should make PUT call with a body and resolve the response', async () => {
        mockFetch.mockResolvedValue(
            new Response(JSON.stringify(BODY_OBJECT), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }),
        );

        expect(await httpClient.put('/api/put-test-with-body', BODY_OBJECT)).toEqual(BODY_OBJECT);
        expect(mockFetch).toHaveBeenCalledWith(
            `https://${TEST_BASE_URL}/api/put-test-with-body`,
            expect.objectContaining({ method: 'PUT', body: JSON.stringify(BODY_OBJECT) }),
        );
    });

    test('should make PUT call without body and resolve the response', async () => {
        mockFetch.mockResolvedValue(
            new Response(JSON.stringify(BODY_OBJECT), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }),
        );

        expect(await httpClient.put('/api/put-test-without-body')).toEqual(BODY_OBJECT);
    });

    test('should make DELETE call and resolve the response', async () => {
        mockFetch.mockResolvedValue(new Response(null, { status: 200 }));

        expect(await httpClient.delete('/api/delete-test')).toEqual(undefined);
        expect(mockFetch).toHaveBeenCalledWith(
            `https://${TEST_BASE_URL}/api/delete-test`,
            expect.objectContaining({ method: 'DELETE' }),
        );
    });

    test('should throw error when fetch rejects', async () => {
        mockFetch.mockRejectedValue(new Error('Network error'));

        await expect(httpClient.get('/api/doesnt-exist-url')).rejects.toThrowError();
    });

    test('should throw error when 4XX', async () => {
        mockFetch.mockResolvedValue(
            new Response(JSON.stringify({ success: false, error: 'Bad Request' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            }),
        );

        await expect(httpClient.get('/api/error-400')).rejects.toThrowError();
    });

    test('should throw error when 5XX', async () => {
        mockFetch.mockResolvedValue(
            new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }),
        );

        await expect(httpClient.get('/api/error-500')).rejects.toThrowError();
    });
});
