/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';
import { Radius, getBorderRadiusSettings } from '.';
import { SwitchBlock } from '..';

describe('getBorderRadiusSettings', () => {
    it('should return border radius settings without arguments', () => {
        const borderRadiusSettings = getBorderRadiusSettings() as SwitchBlock;

        expect(borderRadiusSettings).toHaveProperty('id', 'hasRadius');
        expect(borderRadiusSettings).toHaveProperty('label', 'Corner radius');
        expect(borderRadiusSettings).toHaveProperty('type', 'switch');
        expect(borderRadiusSettings).toHaveProperty('defaultValue', false);
        expect(borderRadiusSettings.on?.[0]).toHaveProperty('id', 'radiusValue');
        expect(borderRadiusSettings.on?.[0]).toHaveProperty('type', 'input');
        expect(borderRadiusSettings.off?.[0]).toHaveProperty('id', 'radiusChoice');
        expect(borderRadiusSettings.off?.[0]).toHaveProperty('type', 'segmentedControls');
        expect(borderRadiusSettings.off?.[0]).toHaveProperty('defaultValue', Radius.None);
    });

    it('should return border radius settings with custom id', () => {
        expect(getBorderRadiusSettings({ id: 'Test' })).toHaveProperty('id', 'hasRadius_Test');
    });

    it('should return border settings with custom default radius', () => {
        const borderRadiusSettings = getBorderRadiusSettings({ defaultRadius: Radius.Large }) as SwitchBlock;
        expect(borderRadiusSettings.off?.[0]).toHaveProperty('defaultValue', Radius.Large);
    });
});
