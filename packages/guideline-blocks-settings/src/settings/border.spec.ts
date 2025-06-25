/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type AppBridgeBlock } from '@frontify/app-bridge';
import {
    type InputBlock,
    maximumNumericalOrPixelOrAutoRule,
    minimumNumericalOrPixelRule,
    type MultiInputBlock,
    MultiInputLayout,
    numericalOrPixelRule,
} from '@frontify/sidebar-settings';
import { describe, expect, it } from 'vitest';

import { type SwitchBlock } from '../';
import { BorderStyle } from '../settings';
import { BORDER_COLOR_DEFAULT_VALUE } from '../settings/defaultValues';

import { getBorderSettings } from './border';

describe('getBorderSettings', () => {
    it('should return border settings without arguments', () => {
        const borderSettings = getBorderSettings() as SwitchBlock;

        expect(borderSettings).toHaveProperty('id', 'hasBorder');
        expect(borderSettings).toHaveProperty('label', 'Border');
        expect(borderSettings).toHaveProperty('type', 'switch');
        expect(borderSettings).toHaveProperty('defaultValue', false);
        expect(borderSettings.on?.[0]).toHaveProperty('id', 'borderSelection');
        expect(borderSettings.on?.[0]).toHaveProperty('type', 'multiInput');
        expect(borderSettings.on?.[0]).toHaveProperty('lastItemFullWidth', true);
        expect(borderSettings.on?.[0]).toHaveProperty('layout', MultiInputLayout.Columns);
        expect((borderSettings.on?.[0] as MultiInputBlock<AppBridgeBlock>).blocks[0]).toEqual({
            id: 'borderStyle',
            type: 'dropdown',
            defaultValue: BorderStyle.Solid,
            choices: [
                {
                    value: BorderStyle.Solid,
                    label: BorderStyle.Solid,
                },
                {
                    value: BorderStyle.Dotted,
                    label: BorderStyle.Dotted,
                },
                {
                    value: BorderStyle.Dashed,
                    label: BorderStyle.Dashed,
                },
            ],
        });
        expect((borderSettings.on?.[0] as MultiInputBlock<AppBridgeBlock>).blocks[1]).toHaveProperty(
            'id',
            'borderWidth',
        );
        expect((borderSettings.on?.[0] as MultiInputBlock<AppBridgeBlock>).blocks[1]).toHaveProperty('type', 'input');
        expect(
            ((borderSettings.on?.[0] as MultiInputBlock<AppBridgeBlock>).blocks[1] as InputBlock<AppBridgeBlock>).rules,
        ).toHaveLength(3);

        expect(
            ((borderSettings.on?.[0] as MultiInputBlock<AppBridgeBlock>).blocks[1] as InputBlock<AppBridgeBlock>)
                .rules?.[0].errorMessage,
        ).toBe(numericalOrPixelRule.errorMessage);
        expect(
            ((borderSettings.on?.[0] as MultiInputBlock<AppBridgeBlock>).blocks[1] as InputBlock<AppBridgeBlock>)
                .rules?.[1].errorMessage,
        ).toBe(minimumNumericalOrPixelRule(0).errorMessage);
        expect(
            ((borderSettings.on?.[0] as MultiInputBlock<AppBridgeBlock>).blocks[1] as InputBlock<AppBridgeBlock>)
                .rules?.[2].errorMessage,
        ).toBe(maximumNumericalOrPixelOrAutoRule(500).errorMessage);

        expect((borderSettings.on?.[0] as MultiInputBlock<AppBridgeBlock>).blocks[2]).toEqual({
            id: 'borderColor',
            type: 'colorInput',
            defaultValue: BORDER_COLOR_DEFAULT_VALUE,
        });
    });

    it('should return border settings with custom id', () => {
        expect(getBorderSettings({ id: 'Test' })).toHaveProperty('id', 'hasBorder_Test');
    });

    it('should return border settings with custom color', () => {
        const borderSettings = getBorderSettings({ defaultColor: { red: 255, green: 0, blue: 0 } }) as SwitchBlock;
        expect((borderSettings.on?.[0] as MultiInputBlock<AppBridgeBlock>).blocks[2]).toEqual({
            id: 'borderColor',
            type: 'colorInput',
            defaultValue: { red: 255, green: 0, blue: 0 },
        });
    });

    it('should return border settings with custom default value', () => {
        const borderSettings = getBorderSettings({ defaultValue: true }) as SwitchBlock;
        expect(borderSettings).toHaveProperty('defaultValue', true);
    });

    it('should return border settings with custom switch label', () => {
        const borderSettings = getBorderSettings({ switchLabel: 'mock' }) as SwitchBlock;
        expect(borderSettings).toHaveProperty('switchLabel', 'mock');
    });
});
