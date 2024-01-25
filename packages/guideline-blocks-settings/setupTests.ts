/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, beforeAll, vi } from 'vitest';
import { configure } from '@testing-library/react';

vi.stubGlobal('crypto', {
    getRandomValues: vi.fn(),
});

beforeAll(() => {
    configure({ testIdAttribute: 'data-test-id' });
});

afterEach(() => {
    vi.restoreAllMocks();
});

globalThis.structuredClone = (data: unknown) => JSON.parse(JSON.stringify(data));
