/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { createAsset } from './CreateAsset';

describe('CreateAsset', () => {
    it('should return correct method name and payload', () => {
        const TEST_DATA = 'test';
        const payload = {
            data: TEST_DATA,
            filename: TEST_DATA,
            parentId: TEST_DATA,
            description: TEST_DATA,
            externalId: TEST_DATA,
            tags: [{ value: TEST_DATA }],
        };
        const currentUser = createAsset(payload);
        expect(currentUser.name).toBe('createAsset');
        expect(currentUser.payload).toBe(payload);
    });
});
