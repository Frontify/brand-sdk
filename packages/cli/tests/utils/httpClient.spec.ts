/* (c) Copyright Frontify Ltd., all rights reserved. */

import nock from 'nock';
import { beforeAll, describe, expect, test } from 'vitest';

import { HttpClient } from '../../src/utils/httpClient';

const BODY_OBJECT = { some: 'body', told: 'me' };
const TEST_BASE_URL = 'testing.frontify.test';

describe('HttpClient utils', () => {
    beforeAll(() => {
        const testMockApi = nock(`https://${TEST_BASE_URL}`);
        testMockApi.get('/api/get-test').reply(200);
        testMockApi.post('/api/post-test-without-body').reply(200, BODY_OBJECT);
        testMockApi.post('/api/post-test-with-body', BODY_OBJECT).reply(200, BODY_OBJECT);
        testMockApi.put('/api/put-test-without-body').reply(200, BODY_OBJECT);
        testMockApi.put('/api/put-test-with-body', BODY_OBJECT).reply(200, BODY_OBJECT);
        testMockApi.delete('/api/delete-test').reply(200);
        testMockApi.get('/api/error-400').reply(400);
        testMockApi.get('/api/error-500').reply(500);
    });

    const httpClient = new HttpClient(TEST_BASE_URL);

    test('should make GET call and resolve the response', async () => {
        expect(await httpClient.get('/api/get-test')).toEqual(undefined);
    });

    test('should make POST call with a body and resolve the response', async () => {
        expect(await httpClient.post('/api/post-test-with-body', BODY_OBJECT)).toEqual(BODY_OBJECT);
    });

    test('should make POST call without body and resolve the response', async () => {
        expect(await httpClient.post('/api/post-test-without-body')).toEqual(BODY_OBJECT);
    });

    test('should make PUT call with a body and resolve the response', async () => {
        expect(await httpClient.put('/api/put-test-with-body', BODY_OBJECT)).toEqual(BODY_OBJECT);
    });

    test('should make PUT call without body and resolve the response', async () => {
        expect(await httpClient.put('/api/put-test-without-body')).toEqual(BODY_OBJECT);
    });

    test('should make DELETE call and resolve the response', async () => {
        expect(await httpClient.delete('/api/delete-test')).toEqual(undefined);
    });

    test("should throw error when host doesn't exist", async () => {
        await expect(httpClient.get('/api/doesnt-exist-url')).rejects.toThrowError();
    });

    test('should throw error when 4XX', async () => {
        await expect(httpClient.get('/api/error-400')).rejects.toThrowError();
    });

    test('should throw error when 5XX', async () => {
        await expect(httpClient.get('/api/error-500')).rejects.toThrowError();
    });
});
