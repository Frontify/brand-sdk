/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, vi } from 'vitest';

vi.stubGlobal('crypto', {
    getRandomValues: vi.fn(),
});

afterEach(() => {
    vi.restoreAllMocks();
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
globalThis.structuredClone = (data: unknown) => JSON.parse(JSON.stringify(data));
