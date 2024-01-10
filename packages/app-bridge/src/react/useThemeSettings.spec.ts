/* (c) Copyright Frontify Ltd., all rights reserved. */

import { cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getAppBridgeThemeStub } from '../tests';
import { useThemeSettings } from './useThemeSettings';
import { SinonStub } from 'sinon';
import type { ThemeTemplate } from '../types';

const THEME_SETTINGS = {
    cover: {
        coverSettingOne: 'value one',
        coverSettingTwo: 'value two',
    },
    documentPage: {},
    library: {},
};

describe('useThemeSettings', () => {
    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
        cleanup();
    });

    const loadUseThemeSettings = async (themeSettings: Record<ThemeTemplate, Record<string, unknown>>) => {
        const appBridgeStub = getAppBridgeThemeStub({
            themeSettings,
        });

        const { result } = renderHook(() => useThemeSettings(appBridgeStub));
        return { result, appBridgeStub };
    };

    it('returns the theme settings', async () => {
        const { result } = await loadUseThemeSettings(THEME_SETTINGS);

        expect(result.current.isLoading).toEqual(true);

        await waitFor(() => {
            expect(result.current.isLoading).toEqual(false);
            expect(result.current.themeSettings).toEqual(THEME_SETTINGS);
        });
    });

    it('updates the theme settings', async () => {
        const { result } = await loadUseThemeSettings(THEME_SETTINGS);

        expect(result.current.isLoading).toEqual(true);

        await waitFor(() => {
            expect(result.current.isLoading).toEqual(false);
            expect(result.current.themeSettings).toEqual(THEME_SETTINGS);
        });

        await result.current.updateThemeSettings({
            cover: { coverSettingTwo: 'value two - updated' },
        });
        expect(result.current.isLoading).toEqual(false);

        const emitCall = (window.emitter.emit as SinonStub).getCall(0);

        await waitFor(() => {
            expect(result.current.isLoading).toEqual(false);
            expect(result.current.themeSettings).toEqual({
                cover: { coverSettingOne: 'value one', coverSettingTwo: 'value two - updated' },
                documentPage: {},
                library: {},
            });
            expect(emitCall.firstArg).toEqual('AppBridge:ThemeSettingsUpdated');
            expect(emitCall.lastArg.themeSettings).toStrictEqual({
                cover: { coverSettingOne: 'value one', coverSettingTwo: 'value two - updated' },
                documentPage: {},
                library: {},
            });
        });
    });
});
