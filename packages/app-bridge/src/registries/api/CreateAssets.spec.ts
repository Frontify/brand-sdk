/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it, vi } from 'vitest';

import { createAssets } from './CreateAssets';

describe('CreateAssets', () => {
    it('should return the method name with the payload', () => {
        const files = [new File(['abc'], 'image.png')];
        const onProgress = vi.fn();

        const method = createAssets({ files, onProgress });

        expect(method.name).toBe('createAssets');
        expect(method.payload).toStrictEqual({ files, onProgress });
    });
});
