/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { exeucteSecureRequest } from './ExecuteSecureRequest.ts';

describe('ExecuteSecureRequest', () => {
    it('should return correct method name', () => {
        const TEST_ID = 'user-api';
        const secureRequest = exeucteSecureRequest({ endpoint: TEST_ID, requestParams: 'data' });
        expect(secureRequest.name).toBe('executeSecureRequest');
        expect(secureRequest.payload).toStrictEqual({
            endpoint: TEST_ID,
            requestParams: 'data',
        });
    });
});
