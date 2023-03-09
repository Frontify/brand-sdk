/* (c) Copyright Frontify Ltd., all rights reserved. */

import { HttpClient, rgbObjectToRgbString, rgbStringToRgbObject } from '../utilities';

/**
 * @deprecated
 */
export const getHub = async (portalId: number): Promise<Record<string, unknown>> => {
    const { result } = await HttpClient.get(`/api/hub/settings/${portalId}`);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return result.hub;
};

/**
 * @deprecated
 */
export const updateHub = async (portalId: number, data: Record<string, unknown>): Promise<void> => {
    await HttpClient.post(`/api/hub/settings/${portalId}`, data);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapHubApiToFlatSettingsDottedNotation = (hubSettings: any) => ({
    'brandhome_appearance.grid.width': hubSettings?.brandhome_settings?.document_appearance?.grid?.width,
    'brandhome_appearance.grid.margin': hubSettings?.brandhome_settings?.document_appearance?.grid?.margin,
    'brandhome_appearance.grid.margin_top': hubSettings?.brandhome_settings?.document_appearance?.grid?.margin_top,
    'brandhome_appearance.grid.margin_bottom':
        hubSettings?.brandhome_settings?.document_appearance?.grid?.margin_bottom,
    'brandhome_appearance.grid.background_color': hubSettings?.brandhome_settings?.document_appearance?.grid
        .background_color
        ? rgbStringToRgbObject(hubSettings.brandhome_settings.document_appearance.grid.background_color)
        : undefined,

    'brandhome_appearance.logo.x': hubSettings?.brandhome_settings?.document_appearance?.logo?.x,
    'brandhome_appearance.logo.y': hubSettings?.brandhome_settings?.document_appearance?.logo?.y,
    'brandhome_appearance.logo.width': hubSettings?.brandhome_settings?.document_appearance?.logo?.width,
    'brandhome_appearance.logo.height': hubSettings?.brandhome_settings?.document_appearance?.logo?.height,

    logo_file_id: hubSettings?.logo_file_id,

    'appearance.navigation.home_link': hubSettings?.appearance?.navigation?.home_link,
});

export const mapFlatSettingsDottedNotationToHubApi = (settings: Record<string, unknown>) => {
    const computedGridBackgroundColor = settings['brandhome_appearance.grid.background_color']
        ? rgbObjectToRgbString(
              settings['brandhome_appearance.grid.background_color'] as Parameters<typeof rgbObjectToRgbString>[0],
          )
        : undefined;

    return {
        brandhome_appearance: {
            grid: {
                width: settings['brandhome_appearance.grid.width'],
                margin: settings['brandhome_appearance.grid.margin'],
                margin_top: settings['brandhome_appearance.grid.margin_top'],
                margin_bottom: settings['brandhome_appearance.grid.margin_bottom'],
                background_color: computedGridBackgroundColor,
            },
            logo: {
                x: settings['brandhome_appearance.logo.x'],
                y: settings['brandhome_appearance.logo.y'],
                width: settings['brandhome_appearance.logo.width'],
                height: settings['brandhome_appearance.logo.height'],
            },
            logo_file_id: settings.logo_file_id,

            appearance: {
                navigation: {
                    home_link: settings['appearance.navigation.home_link'],
                },
            },
        },
    };
};
