/* (c) Copyright Frontify Ltd., all rights reserved. */

import { cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getAppBridgeThemeStub } from '../tests';
import { usePageTemplateSettings } from './usePageTemplateSettings';

const DOCUMENT_ID = 3462;
const THEME_SETTINGS = {
    documentPage: {
        customThemeSetting: 123,
        themeExclusiveSetting: 234,
    },
    cover: {},
    library: {},
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

describe('usePageTemplateSettings', () => {
    beforeEach(() => {
        vi.spyOn(console, 'error').mockImplementation(() => void 0);
    });

    afterEach(() => {
        vi.restoreAllMocks();
        cleanup();
    });

    const loadUsePageTemplateSettings = async (
        pageTemplateSettings: Record<string, unknown>,
        template: Parameters<typeof usePageTemplateSettings>[1],
        documentId?: Parameters<typeof usePageTemplateSettings>[2],
        themeSettings = { documentPage: {}, cover: {}, library: {} },
    ) => {
        const appBridgeStub = getAppBridgeThemeStub({
            pageTemplateSettings,
            themeSettings,
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

    it('updates the page settings for document page', async () => {
        const { result } = await loadUsePageTemplateSettings(PAGE_SETTINGS, 'documentPage', DOCUMENT_ID);

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

    it('updates the page settings for library page', async () => {
        const { result } = await loadUsePageTemplateSettings(PAGE_SETTINGS, 'library', DOCUMENT_ID);

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
        await result.current.updatePageTemplateSettings({ library: { myCustomSetting: 123 } });
    });

    it('logs an error when trying to update document or library page without a documentId', async () => {
        const { result } = await loadUsePageTemplateSettings(PAGE_SETTINGS, 'library');

        expect(result.current.isLoading).toEqual(false);

        await waitFor(() => {
            expect(result.current.pageTemplateSettings).toEqual(null);
        });

        await result.current.updatePageTemplateSettings({ library: { muCystomSetting: 456 } });
        expect(result.current.isLoading).toEqual(false);

        await waitFor(() => {
            expect(result.current.isLoading).toEqual(false);
            expect(result.current.pageTemplateSettings).toEqual(null);
        });

        expect(console.error).toHaveBeenCalledTimes(2);
    });

    describe('Theme and Page template overrides', () => {
        it('returns the page template settings merged with theme settings and the list of custom overrides', async () => {
            const { result } = await loadUsePageTemplateSettings(
                PAGE_SETTINGS_WITH_OVERRIDES,
                'documentPage',
                DOCUMENT_ID,
                THEME_SETTINGS,
            );

            await waitFor(() => {
                expect(result.current.isLoading).toEqual(false);
                expect(result.current.pageTemplateSettings).toEqual({
                    ...THEME_SETTINGS.documentPage,
                    ...PAGE_SETTINGS_WITH_OVERRIDES,
                });
                expect(result.current.customizedPageTemplateSettingsKeys).toEqual(['customThemeSetting']);
            });
        });

        it('returns the page template settings merged with theme settings and no overrides', async () => {
            const { result } = await loadUsePageTemplateSettings(PAGE_SETTINGS, 'cover', undefined, THEME_SETTINGS);

            expect(result.current.isLoading).toEqual(true);

            await waitFor(() => {
                expect(result.current.isLoading).toEqual(false);
                expect(result.current.pageTemplateSettings).toEqual({
                    ...PAGE_SETTINGS,
                    ...THEME_SETTINGS.cover,
                });
                expect(result.current.customizedPageTemplateSettingsKeys).toEqual([]);
            });
        });

        it('returns an empty object if no theme settins and no page template settings', async () => {
            const { result } = await loadUsePageTemplateSettings({}, 'cover', undefined, {
                documentPage: {},
                cover: {},
                library: {},
            });

            expect(result.current.isLoading).toEqual(true);

            await waitFor(() => {
                expect(result.current.isLoading).toEqual(false);
                expect(result.current.pageTemplateSettings).toEqual({});
                expect(result.current.customizedPageTemplateSettingsKeys).toEqual([]);
            });
        });

        it('returns only the theme settings if no page template settings', async () => {
            const { result } = await loadUsePageTemplateSettings({}, 'cover', undefined, THEME_SETTINGS);

            expect(result.current.isLoading).toEqual(true);

            await waitFor(() => {
                expect(result.current.isLoading).toEqual(false);
                expect(result.current.pageTemplateSettings).toEqual(THEME_SETTINGS.cover);
                expect(result.current.customizedPageTemplateSettingsKeys).toEqual([]);
            });
        });

        it('returns only the page template settings if no theme settings', async () => {
            const { result } = await loadUsePageTemplateSettings(PAGE_SETTINGS, 'cover', undefined, {
                documentPage: {},
                cover: {},
                library: {},
            });

            expect(result.current.isLoading).toEqual(true);

            await waitFor(() => {
                expect(result.current.isLoading).toEqual(false);
                expect(result.current.pageTemplateSettings).toEqual(PAGE_SETTINGS);
                expect(result.current.customizedPageTemplateSettingsKeys).toEqual([]);
            });
        });

        it('returns theme setting value if page template override is null', async () => {
            const { result } = await loadUsePageTemplateSettings(
                PAGE_SETTINGS_WITH_NULL_OVERRIDES,
                'documentPage',
                DOCUMENT_ID,
                THEME_SETTINGS,
            );

            expect(result.current.isLoading).toEqual(true);

            await waitFor(() => {
                expect(result.current.isLoading).toEqual(false);
                expect(result.current.pageTemplateSettings).toEqual({
                    ...PAGE_SETTINGS,
                    ...THEME_SETTINGS.documentPage,
                });
                expect(result.current.customizedPageTemplateSettingsKeys).toEqual([]);
            });
        });

        it('returns the theme setting if the override is deleted (reset) from page template settings', async () => {
            const { result } = await loadUsePageTemplateSettings(
                PAGE_SETTINGS_WITH_OVERRIDES,
                'documentPage',
                DOCUMENT_ID,
                THEME_SETTINGS,
            );

            expect(result.current.isLoading).toEqual(true);

            await waitFor(() => {
                expect(result.current.isLoading).toEqual(false);
                expect(result.current.pageTemplateSettings).toEqual({
                    ...THEME_SETTINGS.documentPage,
                    ...PAGE_SETTINGS_WITH_OVERRIDES,
                });
            });

            await result.current.updatePageTemplateSettings({ customThemeSetting: null });
            expect(result.current.isLoading).toEqual(false);

            await waitFor(() => {
                expect(result.current.isLoading).toEqual(false);
                expect(result.current.pageTemplateSettings).toEqual({
                    ...PAGE_SETTINGS,
                    ...THEME_SETTINGS.documentPage,
                });
                expect(result.current.customizedPageTemplateSettingsKeys).toEqual([]);
            });

            // Reset the object to avoid mutation in other tests
            await result.current.updatePageTemplateSettings({ customThemeSetting: 321 });
        });
    });
});
