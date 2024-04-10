/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { getCurrentUser } from './GetCurrentUser';

describe('GetCurrentUser', () => {
    it('should return correct method name', () => {
        const currentUser = getCurrentUser();
        expect(currentUser.name).toBe('getCurrentUser');
    });
});
