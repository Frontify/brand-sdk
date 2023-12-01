/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';
import { verifyManifest } from '../../src/utils/verifyManifest.js';

const EMPTY_MANIFEST = {};
describe('Verify Manifest', () => {
    it('should return false when provided empty Manifest', async () => {
        const verifiedManifest = await verifyManifest(EMPTY_MANIFEST);
        expect(verifiedManifest).toBe(false);
    });
});
