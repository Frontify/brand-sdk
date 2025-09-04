/* (c) Copyright Frontify Ltd., all rights reserved. */

import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup, configure } from '@testing-library/react';
import { type MountOptions, type MountReturn } from 'cypress/react';
import { type ReactNode } from 'react';
import { afterEach, beforeAll, expect, vi } from 'vitest';

import '@testing-library/jest-dom/vitest';

expect.extend(matchers);

vi.stubGlobal('crypto', {
    getRandomValues: vi.fn(),
});

beforeAll(() => {
    configure({ testIdAttribute: 'data-test-id' });
});

afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
globalThis.structuredClone = (data: unknown) => JSON.parse(JSON.stringify(data));

// Actual implementation in `cypress/support/component.ts`
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Cypress {
        interface Chainable {
            /**
             * Mounts a React node
             * @param component React Node to mount
             * @param options Additional options to pass into mount
             */
            mount(component: ReactNode, options?: MountOptions): Cypress.Chainable<MountReturn>;
        }
    }
}
