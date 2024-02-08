/* (c) Copyright Frontify Ltd., all rights reserved. */

import { ColorPalette } from '@frontify/app-bridge';
import { Palette } from '@frontify/fondue';
import { Nullable } from 'vitest';

function isNewColorType(color: any): boolean {
    return color.color && color.color.revision;
}

export const mapAppBridgeColorPalettesToFonduePalettes = (colorPalettes: ColorPalette[]): Palette[] => {
    return colorPalettes.map(mapAppBridgeColorPaletteToFonduePalette);
};

export const mapAppBridgeColorPaletteToFonduePalette = (colorPalette: ColorPalette): Palette => {
    if (isNewColorType(colorPalette)) {
        return mapColorType(colorPalette);
    }

    return mapLegacyColorType(colorPalette);
};

const mapColorType = (colorPalette: ColorPalette) => {
    return {
        id: colorPalette.id,
        title: colorPalette.name,
        colors: colorPalette.colors.map((color) => ({
            alpha: color.color.revision.alpha ? color.color.revision.alpha / 255 : 1,
            red: color.color.revision.red ?? 0,
            green: color.color.revision.green ?? 0,
            blue: color.color.revision.blue ?? 0,
            name: color.color.title ?? '',
        })),
    };
};

type ColorTypeGuard = {
    color: {
        title: Nullable<string>;
        revision: {
            alpha: Nullable<number>;
            red: Nullable<number>;
            green: Nullable<number>;
            blue: Nullable<number>;
        };
    };
};

type LegacyColorTypeGuard = {
    title: Nullable<string>;
    alpha: Nullable<number>;
    red: Nullable<number>;
    green: Nullable<number>;
    blue: Nullable<number>;
};

const mapLegacyColorType = (colorPalette: ColorPalette) => {
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
