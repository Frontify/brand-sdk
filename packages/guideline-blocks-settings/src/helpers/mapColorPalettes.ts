/* (c) Copyright Frontify Ltd., all rights reserved. */

import { ColorPalette } from '@frontify/app-bridge';
import { Palette } from '@frontify/fondue';
import { Nullable } from 'vitest';

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
    color: {
        title: Nullable<string>;
        revision: {
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

const isNewColor = (color: Color): color is V4Color => {
    return (color as V4Color).color !== undefined;
};

const mapColor = (color: Color) => {
    if (isNewColor(color)) {
        return {
            alpha: color.color.revision.alpha ? color.color.revision.alpha / 255 : 1,
            red: color.color.revision.red ?? 0,
            green: color.color.revision.green ?? 0,
            blue: color.color.revision.blue ?? 0,
            name: color.color.title ?? '',
        };
    } else {
        return {
            alpha: color.alpha ? color.alpha / 255 : 1,
            red: color.red ?? 0,
            green: color.green ?? 0,
            blue: color.blue ?? 0,
            name: color.name ?? '',
        };
    }
};
