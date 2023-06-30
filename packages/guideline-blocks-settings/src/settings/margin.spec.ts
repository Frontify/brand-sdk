/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';
import { Margin, getMarginSettings } from '.';
import { SwitchBlock } from '..';

describe('getMarginSettings', () => {
    it('should return margin settings without arguments', () => {
        const marginSettings = getMarginSettings() as SwitchBlock;

        expect(marginSettings).toHaveProperty('id', 'hasCustomMarginValue');
        expect(marginSettings).toHaveProperty('label', 'Margin');
        expect(marginSettings).toHaveProperty('type', 'switch');
        expect(marginSettings).toHaveProperty('defaultValue', false);
        expect(marginSettings.on?.[0]).toHaveProperty('id', 'marginValue');
        expect(marginSettings.on?.[0]).toHaveProperty('type', 'input');
        expect(marginSettings.off?.[0]).toHaveProperty('id', 'marginChoice');
        expect(marginSettings.off?.[0]).toHaveProperty('type', 'segmentedControls');
        expect(marginSettings.off?.[0]).toHaveProperty('choices', [
            {
                value: Margin.None,
                label: 'None',
            },
            {
                value: Margin.Small,
                label: 'S',
            },
            {
                value: Margin.Medium,
                label: 'M',
            },
            {
                value: Margin.Large,
                label: 'L',
            },
        ]);
    });

    it('should return margin settings with id', () => {
        expect(getMarginSettings({ id: 'Test' })).toHaveProperty('id', 'hasCustomMarginValue_Test');
    });
});
