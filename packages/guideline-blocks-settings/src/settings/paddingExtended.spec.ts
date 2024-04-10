/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type AppBridgeBlock } from '@frontify/app-bridge';
import { type MultiInputBlock, MultiInputLayout } from '@frontify/sidebar-settings';
import { describe, expect, it } from 'vitest';

import { type SwitchBlock } from '..';

import { Padding, getPaddingExtendedSettings } from '.';

describe('getPaddingExtendedSettings', () => {
    it('should return extended padding settings without arguments', () => {
        const extendedPaddingSettings = getPaddingExtendedSettings() as SwitchBlock;

        expect(extendedPaddingSettings).toHaveProperty('id', 'hasExtendedCustomPadding');
        expect(extendedPaddingSettings).toHaveProperty('label', 'Padding');
        expect(extendedPaddingSettings).toHaveProperty('type', 'switch');
        expect(extendedPaddingSettings).toHaveProperty('defaultValue', false);
        expect(extendedPaddingSettings.on?.[0]).toHaveProperty('id', 'extendedPaddingValues');
        expect(extendedPaddingSettings.on?.[0]).toHaveProperty('type', 'multiInput');
        expect(extendedPaddingSettings.on?.[0]).toHaveProperty('layout', MultiInputLayout.Spider);

        expect((extendedPaddingSettings.on?.[0] as MultiInputBlock<AppBridgeBlock>).blocks[0]).toHaveProperty(
            'id',
            'extendedPaddingTop',
        );
        expect((extendedPaddingSettings.on?.[0] as MultiInputBlock<AppBridgeBlock>).blocks[1]).toHaveProperty(
            'id',
            'extendedPaddingLeft',
        );
        expect((extendedPaddingSettings.on?.[0] as MultiInputBlock<AppBridgeBlock>).blocks[2]).toHaveProperty(
            'id',
            'extendedPaddingRight',
        );
        expect((extendedPaddingSettings.on?.[0] as MultiInputBlock<AppBridgeBlock>).blocks[3]).toHaveProperty(
            'id',
            'extendedPaddingBottom',
        );
        expect(extendedPaddingSettings.off?.[0]).toHaveProperty('id', 'extendedPaddingChoice');
        expect(extendedPaddingSettings.off?.[0]).toHaveProperty('type', 'segmentedControls');
        expect(extendedPaddingSettings.off?.[0]).toHaveProperty('defaultValue', Padding.Small);
    });

    it('should return extended margin settings with id', () => {
        expect(getPaddingExtendedSettings({ id: 'Test' })).toHaveProperty('id', 'hasExtendedCustomPadding_Test');
    });
});
