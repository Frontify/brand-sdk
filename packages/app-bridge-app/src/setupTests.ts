/* (c) Copyright Frontify Ltd., all rights reserved. */

import { configure } from '@testing-library/react';
import { enableMapSet } from 'immer';
import { beforeAll } from 'vitest';

enableMapSet();

globalThis.structuredClone = (data: unknown) => JSON.parse(JSON.stringify(data));

beforeAll(() => {
    configure({ testIdAttribute: 'data-test-id' });
});
