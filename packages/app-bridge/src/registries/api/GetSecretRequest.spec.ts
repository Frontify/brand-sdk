/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { getSecureRequest } from './GetSecureRequest';

describe('GetSecureRequest', () => {
    it('should return correct method name', () => {
        const TEST_ID = 'user-api';
        const secureRequest = getSecureRequest({ endpoint: TEST_ID, requestParams: 'data' });
        expect(secureRequest.name).toBe('getSecureRequest');
        expect(secureRequest.payload).toStrictEqual({
            endpoint: TEST_ID,
            requestParams: 'data',
        });
    });
});
