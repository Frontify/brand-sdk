/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { openBrandChecker } from './BrandChecker';

describe('BrandChecker', () => {
    it('should return the command name and payload', () => {
        const payload = { tab: 'configuration' as const };
        const command = openBrandChecker(payload);

        expect(command.name).toBe('openBrandChecker');
        expect(command.payload).toStrictEqual(payload);
    });
});
