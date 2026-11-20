/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { type Bundle } from '../types';

import { getSecurityAssetViewerSetting } from './securityAssetViewer';
import { Security } from './types';

const getBundle = (values: Record<string, unknown>) =>
    ({ getBlock: (id: string) => ({ value: values[id] }) }) as unknown as Bundle;

describe('getSecurityAssetViewerSetting', () => {
    it('should return asset viewer setting without arguments', () => {
        expect(getSecurityAssetViewerSetting()).toEqual({
            id: 'assetViewerEnabled',
            type: 'switch',
            defaultValue: true,
            label: 'Asset viewer',
            info: "When disabled, viewers won't be able to open the asset in the asset detail view.",
            show: expect.any(Function),
        });
    });

    it('should return asset viewer setting with custom id', () => {
        expect(getSecurityAssetViewerSetting({ id: 'customId' })).toMatchObject({ id: 'customId' });
    });

    it('should only show the setting when the security is custom', () => {
        const { show } = getSecurityAssetViewerSetting();

        expect(show?.(getBundle({ security: Security.Custom }))).toBe(true);
        expect(show?.(getBundle({ security: Security.Global }))).toBe(false);
    });

    it('should read the security from a custom global control id', () => {
        const { show } = getSecurityAssetViewerSetting({ globalControlId: 'globalCustomId' });

        expect(show?.(getBundle({ globalCustomId: Security.Custom }))).toBe(true);
        expect(show?.(getBundle({ security: Security.Custom }))).toBe(false);
    });
});
