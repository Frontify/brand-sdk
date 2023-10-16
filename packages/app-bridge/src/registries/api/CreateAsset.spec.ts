/* (c) Copyright Frontify Ltd., all rights reserved. */

/* (c) Copyright Frontify Ltd., all rights reserved. */
import { describe, expect, it } from 'vitest';
import { createAsset } from './CreateAsset';

describe('CreateAsset', () => {
    it('should return correct method name and payload', () => {
        const payload = {
            data: 'test',
            filename: 'test',
            parentId: 'test',
            description: 'test',
            externalId: 'test',
            tags: [{ value: 'test' }],
        };
        const currentUser = createAsset(payload);
        expect(currentUser.name).toBe('createAsset');
        expect(currentUser.payload).toBe(payload);
    });
});
