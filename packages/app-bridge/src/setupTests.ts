/* (c) Copyright Frontify Ltd., all rights reserved. */

import { configure } from '@testing-library/react';
import { beforeAll } from 'vitest';
import { enableMapSet } from 'immer';

import { TerrificComponent } from './types';

enableMapSet();

window.application = Object.assign(window.application ?? {}, {
    connectors: {
        events: {
            components: {
                appBridge: {
                    component: {},
                } as TerrificComponent,
            },
        },
    },
});

globalThis.structuredClone = (data: unknown) => JSON.parse(JSON.stringify(data));

beforeAll(() => {
    configure({ testIdAttribute: 'data-test-id' });
});
