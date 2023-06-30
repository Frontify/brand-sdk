/* (c) Copyright Frontify Ltd., all rights reserved. */

import { randomFillSync } from 'node:crypto';

//@ts-expect-error We are mocking the crypto object in tests
window.crypto = {
    getRandomValues: randomFillSync as unknown as typeof window.crypto.getRandomValues,
};

globalThis.structuredClone = (data: unknown) => JSON.parse(JSON.stringify(data));
