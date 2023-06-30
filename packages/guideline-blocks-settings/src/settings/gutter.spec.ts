/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';
import { GutterSpacing, getGutterSettings } from '.';
import { SwitchBlock } from '..';

describe('getGutterSettings', () => {
    it('should return gutter settings without arguments', () => {
        const gutterSettings = getGutterSettings() as SwitchBlock;

        expect(gutterSettings).toHaveProperty('id', 'hasCustomSpacing');
        expect(gutterSettings).toHaveProperty('label', 'Gutter');
        expect(gutterSettings).toHaveProperty('type', 'switch');
        expect(gutterSettings).toHaveProperty('defaultValue', false);
        expect(gutterSettings.on?.[0]).toHaveProperty('id', 'spacingCustom');
        expect(gutterSettings.on?.[0]).toHaveProperty('type', 'input');
        expect(gutterSettings.off?.[0]).toHaveProperty('id', 'spacingChoice');
        expect(gutterSettings.off?.[0]).toHaveProperty('type', 'slider');
        expect(gutterSettings.off?.[0]).toHaveProperty('choices', [
            {
                value: GutterSpacing.Auto,
                label: 'Auto',
            },
            {
                value: GutterSpacing.S,
                label: 'S',
            },
            {
                value: GutterSpacing.M,
                label: 'M',
            },
            {
                value: GutterSpacing.L,
                label: 'L',
            },
        ]);
    });

    it('should return gutter settings with id', () => {
        expect(getGutterSettings({ id: 'Test' })).toHaveProperty('id', 'Test');
    });

    it('should return gutter settings with custom spacing choice id', () => {
        const gutterSettings = getGutterSettings({ spacingChoiceId: 'Choice_ID' }) as SwitchBlock;

        expect(gutterSettings.off?.[0]).toHaveProperty('id', 'Choice_ID');
    });

    it('should return gutter settings with custom spacing custom id', () => {
        const gutterSettings = getGutterSettings({ spacingCustomId: 'Custom_ID' }) as SwitchBlock;

        expect(gutterSettings.on?.[0]).toHaveProperty('id', 'Custom_ID');
    });

    it('should return gutter settings with custom spacing custom id', () => {
        const gutterSettings = getGutterSettings({ defaultValueChoices: GutterSpacing.L }) as SwitchBlock;

        expect(gutterSettings.off?.[0]).toHaveProperty('defaultValue', GutterSpacing.L);
    });
});
