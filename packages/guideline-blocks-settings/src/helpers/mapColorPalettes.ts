/* (c) Copyright Frontify Ltd., all rights reserved. */

import { ColorPalette } from '@frontify/app-bridge';
import { Palette } from '@frontify/fondue';

export const mapAppBridgeColorPalettesToFonduePalettes = (colorPalettes: ColorPalette[]): Palette[] => {
    return colorPalettes.map(mapAppBridgeColorPaletteToFonduePalette);
};

export const mapAppBridgeColorPaletteToFonduePalette = (colorPalette: ColorPalette): Palette => {
    return {
        id: colorPalette.id,
        title: colorPalette.name,
        colors: colorPalette.colors.map((color) => ({
            alpha: color.alpha ? color.alpha / 255 : 1,
            red: color.red ?? 0,
            green: color.green ?? 0,
            blue: color.blue ?? 0,
            name: color.name ?? '',
        })),
    };
};
