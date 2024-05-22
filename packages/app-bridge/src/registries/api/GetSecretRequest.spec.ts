/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { getSecretRequest } from './GetSecretRequest.ts';

describe('GetSecretRequest', () => {
    it('should return correct method name', () => {
        const TEST_ID = 'user-api';
        const secretRequest = getSecretRequest({ id: TEST_ID, requestParams: 'data' });
        expect(secretRequest.name).toBe('getSecretRequest');
        expect(secretRequest.payload).toStrictEqual({
            id: TEST_ID,
            requestParams: 'data',
        });
    });
});
