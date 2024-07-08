/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { getAccountId } from './GetAccountId.ts';

describe('GetAccountId', () => {
    it('should return correct method name', () => {
        const currentUser = getAccountId();
        expect(currentUser.name).toBe('getAccountId');
    });
});
