/* (c) Copyright Frontify Ltd., all rights reserved. */

import { randomFillSync } from 'node:crypto';
import { afterEach, beforeEach, vi } from 'vitest';

const mockGetRandomValues = vi
    .fn()
    .mockImplementation(randomFillSync as unknown as typeof window.crypto.getRandomValues);

beforeEach(() => {
    vi.spyOn(window.crypto, 'getRandomValues').mockImplementation(mockGetRandomValues);
});

afterEach(() => {
    vi.restoreAllMocks();
});

globalThis.structuredClone = (data: unknown) => JSON.parse(JSON.stringify(data));
