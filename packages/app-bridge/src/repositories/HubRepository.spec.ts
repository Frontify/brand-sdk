/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { mapFlatSettingsDottedNotationToHubApi, mapHubApiToFlatSettingsDottedNotation } from './HubRepository';

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

describe('HubRepository', () => {
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
