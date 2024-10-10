/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { getAccountId } from './GetAccountId.ts';

describe('GetAccountId', () => {
    it('should return correct method name of AccountId', () => {
        const accountIdMethod = getAccountId();
        expect(accountIdMethod.name).toBe('getAccountId');
    });
});
