/* (c) Copyright Frontify Ltd., all rights reserved. */

import { ColorPalette } from '@frontify/app-bridge';
import { Palette } from '@frontify/fondue';

type V3Color = {
    id: number;
    name: Nullable<string>;
    red: Nullable<number>;
    green: Nullable<number>;
    blue: Nullable<number>;
    alpha: Nullable<number>;
};

type V4Color = {
    id: number;
    title: Nullable<string>;
    revision: {
        rgba: {
            red: Nullable<number>;
            green: Nullable<number>;
            blue: Nullable<number>;
            alpha: Nullable<number>;
        };
    };
};

type Color = V3Color | V4Color;

export const mapAppBridgeColorPalettesToFonduePalettes = (colorPalettes: ColorPalette[]): Palette[] => {
    return colorPalettes.map(mapAppBridgeColorPaletteToFonduePalette);
};
export const mapAppBridgeColorPaletteToFonduePalette = (colorPalette: ColorPalette): Palette => {
    return {
        id: colorPalette.id,
        title: colorPalette.name,
        colors: colorPalette.colors.map(mapColor),
    };
};

const isV4Color = (color: Color): color is V4Color => {
    return 'revision' in color;
};

const mapColor = (color: Color) => {
    if (isV4Color(color)) {
        const { title, revision } = color;
        return {
            alpha: revision.rgba.alpha ? revision.rgba.alpha / 255 : 1,
            red: revision.rgba.red ?? 0,
            green: revision.rgba.green ?? 0,
            blue: revision.rgba.blue ?? 0,
            name: title ?? '',
        };
    }
    return {
        alpha: color.alpha ? color.alpha / 255 : 1,
        red: color.red ?? 0,
        green: color.green ?? 0,
        blue: color.blue ?? 0,
        name: color.name ?? '',
    };
};
