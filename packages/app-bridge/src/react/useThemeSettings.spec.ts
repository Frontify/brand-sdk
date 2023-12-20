/* (c) Copyright Frontify Ltd., all rights reserved. */

import { cleanup, renderHook, waitFor } from '@testing-library/react';
import { type SinonStub } from 'sinon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getAppBridgeThemeStub } from '../tests';

import { useThemeSettings } from './useThemeSettings';

const THEME_SETTINGS = {
    myCustomSetting: 123,
};

describe('useThemeSettings', () => {
    beforeEach(() => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
        cleanup();
    });

    const loadUseThemeSettings = (themeSettings: Record<string, unknown>) => {
        const appBridgeStub = getAppBridgeThemeStub({
            themeSettings,
        });

        const { result } = renderHook(() => useThemeSettings(appBridgeStub));
        return { result, appBridgeStub };
    };

    it('returns the theme settings', async () => {
        const { result } = loadUseThemeSettings(THEME_SETTINGS);

        expect(result.current.isLoading).toEqual(true);

        await waitFor(() => {
            expect(result.current.isLoading).toEqual(false);
            expect(result.current.themeSettings).toEqual(THEME_SETTINGS);
        });
    });

    it('updates the theme settings', async () => {
        const { result } = loadUseThemeSettings(THEME_SETTINGS);

        expect(result.current.isLoading).toEqual(true);

        await waitFor(() => {
            expect(result.current.isLoading).toEqual(false);
            expect(result.current.themeSettings).toEqual(THEME_SETTINGS);
        });

        await result.current.updateThemeSettings({ myCustomSetting: 456 });
        expect(result.current.isLoading).toEqual(false);

        const emitCall = (window.emitter.emit as SinonStub).getCall(0);

        await waitFor(() => {
            expect(result.current.isLoading).toEqual(false);
            expect(result.current.themeSettings).toEqual({ ...THEME_SETTINGS, myCustomSetting: 456 });
            expect(emitCall.firstArg).toEqual('AppBridge:ThemeSettingsUpdated');
            expect(emitCall.lastArg.themeSettings).toStrictEqual({ ...THEME_SETTINGS, myCustomSetting: 456 });
        });
    });
});
