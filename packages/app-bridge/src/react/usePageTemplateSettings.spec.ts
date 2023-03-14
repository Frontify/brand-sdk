/* (c) Copyright Frontify Ltd., all rights reserved. */

import { cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { getAppBridgeThemeStub } from '../tests';
import { usePageTemplateSettings } from './usePageTemplateSettings';

const DOCUMENT_ID = 3462;
const HUB_API_SETTINGS_GET = {
    brandhome_settings: {
        document_appearance: {
            grid: {
                width: '34px',
                margin: '35px',
                margin_top: '36px',
                margin_bottom: '37px',
                background_color: 'rgba(1, 2, 3, 1)',
            },
            logo: {
                x: 1,
                y: 2,
                width: 3,
                height: 4,
            },
        },
    },
    logo_file_id: 'abcdef',
    appearance: {
        navigation: {
            home_link: 'https://frontify.test',
        },
    },
    myCustomSetting: 123,
};

const DOCUMENT_APPEARANCE_GET = {
    myCustomSetting: 123,
};

const LIBRARY_APPEARANCE_GET = {
    myCustomSetting: 123,
};

const MAPPED_HUB_SETTINGS = {
    'brandhome_appearance.grid.width': '34px',
    'brandhome_appearance.grid.margin': '35px',
    'brandhome_appearance.grid.margin_top': '36px',
    'brandhome_appearance.grid.margin_bottom': '37px',
    'brandhome_appearance.grid.background_color': { red: 1, green: 2, blue: 3, alpha: 1 },

    'brandhome_appearance.logo.x': 1,
    'brandhome_appearance.logo.y': 2,
    'brandhome_appearance.logo.width': 3,
    'brandhome_appearance.logo.height': 4,

    'appearance.navigation.home_link': 'https://frontify.test',

    ...HUB_API_SETTINGS_GET,
};

describe('usePageTemplateSettings', () => {
    afterEach(() => {
        cleanup();
    });

    const loadUsePageTemplateSettings = async (
        pageSettings: Record<string, unknown>,
        template: Parameters<typeof usePageTemplateSettings>[1],
        documentId?: Parameters<typeof usePageTemplateSettings>[2],
    ) => {
        const appBridgeStub = getAppBridgeThemeStub({
            pageSettings,
        });

        const { result } = renderHook(() => usePageTemplateSettings(appBridgeStub, template, documentId));
        return { result, appBridgeStub };
    };

    it('returns the page settings for cover page', async () => {
        const { result } = await loadUsePageTemplateSettings(HUB_API_SETTINGS_GET, 'cover');

        expect(result.current.isLoading).toEqual(true);

        await waitFor(() => {
            expect(result.current.isLoading).toEqual(false);
            expect(result.current.pageTemplateSettings).toEqual(MAPPED_HUB_SETTINGS);
        });
    });

    it('updates the page settings for cover page', async () => {
        const { result } = await loadUsePageTemplateSettings(HUB_API_SETTINGS_GET, 'cover');

        expect(result.current.isLoading).toEqual(true);

        await waitFor(() => {
            expect(result.current.isLoading).toEqual(false);
            expect(result.current.pageTemplateSettings).toEqual(MAPPED_HUB_SETTINGS);
        });

        await result.current.updatePageTemplateSettings({ myCustomSetting: 456 });
        expect(result.current.isLoading).toEqual(false);

        await waitFor(() => {
            expect(result.current.isLoading).toEqual(false);
            expect(result.current.pageTemplateSettings).toEqual({ ...MAPPED_HUB_SETTINGS, myCustomSetting: 456 });
        });
    });

    it('returns the page settings for document page', async () => {
        const { result } = await loadUsePageTemplateSettings(DOCUMENT_APPEARANCE_GET, 'document', DOCUMENT_ID);

        expect(result.current.isLoading).toEqual(true);

        await waitFor(() => {
            expect(result.current.isLoading).toEqual(false);
            expect(result.current.pageTemplateSettings).toEqual(DOCUMENT_APPEARANCE_GET);
        });
    });

    it('returns `null` for document page if no document id passed', async () => {
        const { result } = await loadUsePageTemplateSettings(DOCUMENT_APPEARANCE_GET, 'document');

        expect(result.current.isLoading).toEqual(false);

        await waitFor(() => {
            expect(result.current.isLoading).toEqual(false);
            expect(result.current.pageTemplateSettings).toEqual(null);
        });
    });

    it('returns the page settings for library page', async () => {
        const { result } = await loadUsePageTemplateSettings(LIBRARY_APPEARANCE_GET, 'library', DOCUMENT_ID);

        expect(result.current.isLoading).toEqual(true);

        await waitFor(() => {
            expect(result.current.isLoading).toEqual(false);
            expect(result.current.pageTemplateSettings).toEqual(LIBRARY_APPEARANCE_GET);
        });
    });

    it('returns `null` for library page if no document id passed', async () => {
        const { result } = await loadUsePageTemplateSettings(LIBRARY_APPEARANCE_GET, 'library');

        expect(result.current.isLoading).toEqual(false);

        await waitFor(() => {
            expect(result.current.isLoading).toEqual(false);
            expect(result.current.pageTemplateSettings).toEqual(null);
        });
    });
});
