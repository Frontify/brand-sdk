/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, describe, expect, it, vi } from 'vitest';

import { HttpClient } from '../utilities/httpClient';
import {
    getHub,
    mapFlatSettingsDottedNotationToHubApi,
    mapHubApiToFlatSettingsDottedNotation,
    updateHub,
} from './HubRepository';

const PORTAL_ID = 465;
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
};
const HUB_API_SETTINGS_UPDATE = {
    brandhome_appearance: {
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
        logo_file_id: 'abcdef',

        appearance: {
            navigation: {
                home_link: 'https://frontify.test',
            },
        },
    },
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

    logo_file_id: 'abcdef',

    'appearance.navigation.home_link': 'https://frontify.test',
};

const UPDATE_HUB_DATA = {
    brandhome_appearance: {
        grid: {
            width: '23px',
        },
    },
};

describe('HubRepository', () => {
    describe('getHub', () => {
        afterEach(() => {
            vi.clearAllMocks();
        });

        it('should get the hub settings', () => {
            const mockHttpClientGet = vi.fn().mockReturnValue({ result: { success: true, hub: HUB_API_SETTINGS_GET } });

            HttpClient.get = mockHttpClientGet;

            const result = getHub(PORTAL_ID);

            expect(mockHttpClientGet).toHaveBeenCalledTimes(1);
            expect(result).resolves.toEqual(HUB_API_SETTINGS_GET);
        });
    });

    describe('updateHub', () => {
        afterEach(() => {
            vi.clearAllMocks();
        });

        it('should update hub settings', async () => {
            const mockHttpClientPost = vi.fn().mockImplementationOnce(() => ({ result: { success: true } }));
            HttpClient.post = mockHttpClientPost;

            await updateHub(PORTAL_ID, UPDATE_HUB_DATA);

            expect(mockHttpClientPost).toHaveBeenCalledTimes(1);
            expect(mockHttpClientPost.mock.lastCall?.[1]).toEqual(UPDATE_HUB_DATA);
        });
    });

    describe('mapHubApiToFlatSettingsDottedNotation', () => {
        it('transform the data', () => {
            expect(mapHubApiToFlatSettingsDottedNotation(HUB_API_SETTINGS_GET)).toEqual(MAPPED_HUB_SETTINGS);
        });
    });

    describe('mapFlatSettingsDottedNotationToHubApi', () => {
        it('transform the data', () => {
            expect(mapFlatSettingsDottedNotationToHubApi(MAPPED_HUB_SETTINGS)).toEqual(HUB_API_SETTINGS_UPDATE);
        });
    });
});
