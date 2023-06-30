/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';
import { Padding, getPaddingSettings } from '.';
import { SwitchBlock } from '..';

describe('getPaddingSettings', () => {
    it('should return padding settings without arguments', () => {
        const paddingSettings = getPaddingSettings() as SwitchBlock;

        expect(paddingSettings).toHaveProperty('id', 'hasCustomPaddingValue');
        expect(paddingSettings).toHaveProperty('label', 'Padding');
        expect(paddingSettings).toHaveProperty('type', 'switch');
        expect(paddingSettings).toHaveProperty('defaultValue', false);
        expect(paddingSettings.on?.[0]).toHaveProperty('id', 'paddingValue');
        expect(paddingSettings.on?.[0]).toHaveProperty('type', 'input');
        expect(paddingSettings.off?.[0]).toHaveProperty('id', 'paddingChoice');
        expect(paddingSettings.off?.[0]).toHaveProperty('type', 'segmentedControls');
        expect(paddingSettings.off?.[0]).toHaveProperty('choices', [
            {
                value: Padding.None,
                label: 'None',
            },
            {
                value: Padding.Small,
                label: 'S',
            },
            {
                value: Padding.Medium,
                label: 'M',
            },
            {
                value: Padding.Large,
                label: 'L',
            },
        ]);
    });

    it('should return padding settings with id', () => {
        expect(getPaddingSettings({ id: 'Test' })).toHaveProperty('id', 'hasCustomPaddingValue_Test');
    });
});
