/* (c) Copyright Frontify Ltd., all rights reserved. */

import { cleanup, renderHook, waitFor } from '@testing-library/react';
import { Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getAppBridgeThemeStub } from '../tests';
import { usePageTemplateSettings } from './usePageTemplateSettings';
import { useThemeSettings } from './useThemeSettings';

const DOCUMENT_ID = 3462;
const THEME_SETTINGS = {
    customThemeSetting: 123,
    themeExclusiveSetting: 234,
};
const PAGE_SETTINGS = {
    myCustomSetting: 123,
};

const PAGE_SETTINGS_WITH_OVERRIDES = {
    ...PAGE_SETTINGS,
    customThemeSetting: 321,
};

const PAGE_SETTINGS_WITH_NULL_OVERRIDES = {
    ...PAGE_SETTINGS,
    customThemeSetting: null,
};

vi.mock('./useThemeSettings', () => {
    return {
        useThemeSettings: vi.fn(),
    };
});

describe('usePageTemplateSettings', () => {
    beforeEach(() => {
        vi.spyOn(console, 'error').mockImplementation(() => void 0);
        (useThemeSettings as Mock).mockImplementation(() => ({ themeSettings: {} }));
    });

    afterEach(() => {
        vi.restoreAllMocks();
        cleanup();
    });

    const loadUsePageTemplateSettings = async (
        pageTemplateSettings: Record<string, unknown>,
        template: Parameters<typeof usePageTemplateSettings>[1],
        documentId?: Parameters<typeof usePageTemplateSettings>[2],
    ) => {
        const appBridgeStub = getAppBridgeThemeStub({
            pageTemplateSettings,
        });

        const { result } = renderHook(() => usePageTemplateSettings(appBridgeStub, template, documentId));
        return { result, appBridgeStub };
    };

    it('returns the page settings for cover page', async () => {
        const { result } = await loadUsePageTemplateSettings(PAGE_SETTINGS, 'cover');

        expect(result.current.isLoading).toEqual(true);

        await waitFor(() => {
            expect(result.current.isLoading).toEqual(false);
            expect(result.current.pageTemplateSettings).toEqual(PAGE_SETTINGS);
        });
    });

    it('updates the page settings for cover page', async () => {
        const { result } = await loadUsePageTemplateSettings(PAGE_SETTINGS, 'cover');

        expect(result.current.isLoading).toEqual(true);

        await waitFor(() => {
            expect(result.current.isLoading).toEqual(false);
            expect(result.current.pageTemplateSettings).toEqual(PAGE_SETTINGS);
        });

        await result.current.updatePageTemplateSettings({ myCustomSetting: 456 });
        expect(result.current.isLoading).toEqual(false);

        await waitFor(() => {
            expect(result.current.isLoading).toEqual(false);
            expect(result.current.pageTemplateSettings).toEqual({ ...PAGE_SETTINGS, myCustomSetting: 456 });
        });

        // Reset the object to avoid mutation in other tests
        await result.current.updatePageTemplateSettings({ myCustomSetting: 123 });
    });

    it('returns the page settings for document page', async () => {
        const { result } = await loadUsePageTemplateSettings(PAGE_SETTINGS, 'documentPage', DOCUMENT_ID);

        expect(result.current.isLoading).toEqual(true);

        await waitFor(() => {
            expect(result.current.isLoading).toEqual(false);
            expect(result.current.pageTemplateSettings).toEqual(PAGE_SETTINGS);
        });
    });

    it('returns `null` for document page if no document page id passed', async () => {
        const { result } = await loadUsePageTemplateSettings(PAGE_SETTINGS, 'documentPage');

        expect(result.current.isLoading).toEqual(false);

        await waitFor(() => {
            expect(result.current.isLoading).toEqual(false);
            expect(result.current.pageTemplateSettings).toEqual(null);
        });

        expect(console.error).toHaveBeenCalledOnce();
    });

    it('returns the page settings for library page', async () => {
        const { result } = await loadUsePageTemplateSettings(PAGE_SETTINGS, 'library', DOCUMENT_ID);

        expect(result.current.isLoading).toEqual(true);

        await waitFor(() => {
            expect(result.current.isLoading).toEqual(false);
            expect(result.current.pageTemplateSettings).toEqual(PAGE_SETTINGS);
        });
    });

    it('returns `null` for library page if no document id passed', async () => {
        const { result } = await loadUsePageTemplateSettings(PAGE_SETTINGS, 'library');

        expect(result.current.isLoading).toEqual(false);

        await waitFor(() => {
            expect(result.current.isLoading).toEqual(false);
            expect(result.current.pageTemplateSettings).toEqual(null);
        });

        expect(console.error).toHaveBeenCalledOnce();
    });

    describe('Theme and Page template overrides', () => {
        beforeEach(() => {
            (useThemeSettings as Mock).mockImplementation(() => ({ themeSettings: THEME_SETTINGS }));
        });

        it('returns the page template settings merged with theme settings and the list of custom overrides', async () => {
            const { result } = await loadUsePageTemplateSettings(PAGE_SETTINGS_WITH_OVERRIDES, 'cover');

            expect(result.current.isLoading).toEqual(true);

            await waitFor(() => {
                expect(result.current.isLoading).toEqual(false);
                expect(result.current.pageTemplateSettings).toEqual({
                    ...THEME_SETTINGS,
                    ...PAGE_SETTINGS_WITH_OVERRIDES,
                });
                expect(result.current.customOverrides).toEqual(['customThemeSetting']);
            });
        });

        it('returns the page template settings merged with theme settings and no overrides', async () => {
            const { result } = await loadUsePageTemplateSettings(PAGE_SETTINGS, 'cover');

            expect(result.current.isLoading).toEqual(true);

            await waitFor(() => {
                expect(result.current.isLoading).toEqual(false);
                expect(result.current.pageTemplateSettings).toEqual({
                    ...PAGE_SETTINGS,
                    ...THEME_SETTINGS,
                });
                expect(result.current.customOverrides).toEqual([]);
            });
        });

        it('returns an empty object if no theme settins and no page template settings', async () => {
            (useThemeSettings as Mock).mockImplementation(() => ({ themeSettings: {} }));
            const { result } = await loadUsePageTemplateSettings({}, 'cover');

            expect(result.current.isLoading).toEqual(true);

            await waitFor(() => {
                expect(result.current.isLoading).toEqual(false);
                expect(result.current.pageTemplateSettings).toEqual({});
                expect(result.current.customOverrides).toEqual([]);
            });
        });

        it('returns only the theme settings if no page template settings', async () => {
            const { result } = await loadUsePageTemplateSettings({}, 'cover');

            expect(result.current.isLoading).toEqual(true);

            await waitFor(() => {
                expect(result.current.isLoading).toEqual(false);
                expect(result.current.pageTemplateSettings).toEqual(THEME_SETTINGS);
                expect(result.current.customOverrides).toEqual([]);
            });
        });

        it('returns only the page template settings if no theme settings', async () => {
            (useThemeSettings as Mock).mockImplementation(() => ({ themeSettings: {} }));
            const { result } = await loadUsePageTemplateSettings(PAGE_SETTINGS, 'cover');

            expect(result.current.isLoading).toEqual(true);

            await waitFor(() => {
                expect(result.current.isLoading).toEqual(false);
                expect(result.current.pageTemplateSettings).toEqual(PAGE_SETTINGS);
                expect(result.current.customOverrides).toEqual([]);
            });
        });

        it('returns theme setting value if page template override is null', async () => {
            const { result } = await loadUsePageTemplateSettings(PAGE_SETTINGS_WITH_NULL_OVERRIDES, 'cover');

            expect(result.current.isLoading).toEqual(true);

            await waitFor(() => {
                expect(result.current.isLoading).toEqual(false);
                expect(result.current.pageTemplateSettings).toEqual({
                    ...PAGE_SETTINGS,
                    ...THEME_SETTINGS,
                });
                expect(result.current.customOverrides).toEqual([]);
            });
        });
    });
});
