/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { type InputBlock, type SwitchBlock, minimumNumericalOrPixelRule, numericalOrPixelRule } from '..';

import { Radius, getBorderRadiusSettings } from '.';

describe('getBorderRadiusSettings', () => {
    it('should return border radius settings without arguments', () => {
        const borderRadiusSettings = getBorderRadiusSettings() as SwitchBlock;

        expect(borderRadiusSettings).toHaveProperty('id', 'hasRadius');
        expect(borderRadiusSettings).toHaveProperty('label', 'Corner radius');
        expect(borderRadiusSettings).toHaveProperty('type', 'switch');
        expect(borderRadiusSettings).toHaveProperty('defaultValue', false);
        expect(borderRadiusSettings.on?.[0]).toHaveProperty('id', 'radiusValue');
        expect(borderRadiusSettings.on?.[0]).toHaveProperty('type', 'input');
        expect((borderRadiusSettings.on?.[0] as InputBlock).rules).toHaveLength(2);
        expect((borderRadiusSettings.on?.[0] as InputBlock).rules?.[0].errorMessage).toBe(
            numericalOrPixelRule.errorMessage,
        );
        expect((borderRadiusSettings.on?.[0] as InputBlock).rules?.[1].errorMessage).toBe(
            minimumNumericalOrPixelRule(0).errorMessage,
        );
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
