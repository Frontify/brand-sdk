/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';
import { MultiInputBlock, MultiInputLayout } from '@frontify/sidebar-settings';
import { Radius, getExtendedBorderRadiusSettings } from '.';
import { SwitchBlock } from '..';
import { AppBridgeBlock } from '@frontify/app-bridge';

describe('getBorderRadiusExtendedSettings', () => {
    it('should return extended border radius settings without arguments', () => {
        const extendedBorderRadiusSettings = getExtendedBorderRadiusSettings() as SwitchBlock;

        expect(extendedBorderRadiusSettings).toHaveProperty('id', 'hasExtendedCustomRadius');
        expect(extendedBorderRadiusSettings).toHaveProperty('label', 'Corner radius');
        expect(extendedBorderRadiusSettings).toHaveProperty('type', 'switch');
        expect(extendedBorderRadiusSettings).toHaveProperty('defaultValue', false);
        expect(extendedBorderRadiusSettings.on?.[0]).toHaveProperty('id', 'extendedRadiusValue');
        expect(extendedBorderRadiusSettings.on?.[0]).toHaveProperty('type', 'multiInput');
        expect(extendedBorderRadiusSettings.on?.[0]).toHaveProperty('layout', MultiInputLayout.Columns);

        expect((extendedBorderRadiusSettings.on?.[0] as MultiInputBlock<AppBridgeBlock>).blocks[0]).toHaveProperty(
            'id',
            'extendedRadiusTopLeft',
        );
        expect((extendedBorderRadiusSettings.on?.[0] as MultiInputBlock<AppBridgeBlock>).blocks[1]).toHaveProperty(
            'id',
            'extendedRadiusTopRight',
        );
        expect((extendedBorderRadiusSettings.on?.[0] as MultiInputBlock<AppBridgeBlock>).blocks[2]).toHaveProperty(
            'id',
            'extendedRadiusBottomLeft',
        );
        expect((extendedBorderRadiusSettings.on?.[0] as MultiInputBlock<AppBridgeBlock>).blocks[3]).toHaveProperty(
            'id',
            'extendedRadiusBottomRight',
        );
        expect(extendedBorderRadiusSettings.off?.[0]).toHaveProperty('id', 'extendedRadiusChoice');
        expect(extendedBorderRadiusSettings.off?.[0]).toHaveProperty('type', 'segmentedControls');
        expect(extendedBorderRadiusSettings.off?.[0]).toHaveProperty('defaultValue', Radius.None);
    });

    it('should return extended border radius settings with id', () => {
        expect(getExtendedBorderRadiusSettings({ id: 'Test' })).toHaveProperty('id', 'hasExtendedCustomRadius_Test');
    });

    it('should return extended border settings with custom default value', () => {
        const extendedBorderRadiusSettings = getExtendedBorderRadiusSettings({
            defaultValue: Radius.Large,
        }) as SwitchBlock;
        expect(extendedBorderRadiusSettings.off?.[0]).toHaveProperty('defaultValue', Radius.Large);
    });
});
