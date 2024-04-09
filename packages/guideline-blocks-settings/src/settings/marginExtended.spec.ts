/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type AppBridgeBlock } from '@frontify/app-bridge';
import { type MultiInputBlock, MultiInputLayout } from '@frontify/sidebar-settings';
import { describe, expect, it } from 'vitest';

import { type SwitchBlock } from '..';

import { Margin, getMarginExtendedSettings } from '.';

describe('getMarginExtendedSettings', () => {
    it('should return extended margin settings without arguments', () => {
        const extendedMarginSettings = getMarginExtendedSettings() as SwitchBlock;

        expect(extendedMarginSettings).toHaveProperty('id', 'hasExtendedCustomMargin');
        expect(extendedMarginSettings).toHaveProperty('label', 'Margin');
        expect(extendedMarginSettings).toHaveProperty('type', 'switch');
        expect(extendedMarginSettings).toHaveProperty('defaultValue', false);
        expect(extendedMarginSettings.on?.[0]).toHaveProperty('id', 'extendedMarginValues');
        expect(extendedMarginSettings.on?.[0]).toHaveProperty('type', 'multiInput');
        expect(extendedMarginSettings.on?.[0]).toHaveProperty('layout', MultiInputLayout.Spider);

        expect((extendedMarginSettings.on?.[0] as MultiInputBlock<AppBridgeBlock>).blocks[0]).toHaveProperty(
            'id',
            'extendedMarginTop',
        );
        expect((extendedMarginSettings.on?.[0] as MultiInputBlock<AppBridgeBlock>).blocks[1]).toHaveProperty(
            'id',
            'extendedMarginLeft',
        );
        expect((extendedMarginSettings.on?.[0] as MultiInputBlock<AppBridgeBlock>).blocks[2]).toHaveProperty(
            'id',
            'extendedMarginRight',
        );
        expect((extendedMarginSettings.on?.[0] as MultiInputBlock<AppBridgeBlock>).blocks[3]).toHaveProperty(
            'id',
            'extendedMarginBottom',
        );
        expect(extendedMarginSettings.off?.[0]).toHaveProperty('id', 'extendedMarginChoice');
        expect(extendedMarginSettings.off?.[0]).toHaveProperty('type', 'segmentedControls');
        expect(extendedMarginSettings.off?.[0]).toHaveProperty('defaultValue', Margin.None);
    });

    it('should return extended margin settings with id', () => {
        expect(getMarginExtendedSettings({ id: 'Test' })).toHaveProperty('id', 'hasExtendedCustomMargin_Test');
    });
});
