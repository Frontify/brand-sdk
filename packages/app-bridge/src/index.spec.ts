/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import * as testing from './tests';

import * as appBridge from './index';

describe('main entry', () => {
    it('should not expose the testing utilities', () => {
        const leakedExports = Object.keys(testing).filter((exportName) => exportName in appBridge);

        expect(leakedExports).toEqual([]);
    });
});
