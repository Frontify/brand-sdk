/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, test, vi } from 'vitest';

import { printLogo } from '../../src/utils/logo';

describe('Logo utils', () => {
    describe('printLogo', () => {
        test('should print the logo', () => {
            console.log = vi.fn();
            printLogo();
            expect(console.log).toHaveBeenCalled();
        });
    });
});
