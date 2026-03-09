/* (c) Copyright Frontify Ltd., all rights reserved. */

export type Color = {
    id: number;
    sort: number;
} & ColorAsset;

// This type should be evolved to Asset in the long run
export type ColorAsset = {
    title: Nullable<string>;
    revision: ColorRevision;
};

export type ColorRevision = {
    nameCss: Nullable<string>;
    hex: Nullable<string>;
    hue: number;
    saturation: number;
    lightness: Nullable<number>;
    ral: Nullable<string>;
    oracal: Nullable<string>;
    ncs: Nullable<string>;
    hks: Nullable<string>;
    threeM: Nullable<string>;
    lab: Nullable<string>;
    cmyk: CmykColor;
    rgba: RgbaColor;
    pantone: PantoneColor;
};

type RgbaColor = {
    red: Nullable<number>;
    green: Nullable<number>;
    blue: Nullable<number>;
    alpha: Nullable<number>;
};

type CmykColor = {
    cyan: Nullable<number>;
    magenta: Nullable<number>;
    yellow: Nullable<number>;
    black: Nullable<number>;
    coated: Nullable<string>;
    uncoated: Nullable<string>;
    newspaper: Nullable<string>;
};

type PantoneColor = {
    code: Nullable<string>;
    coated: Nullable<string>;
    uncoated: Nullable<string>;
    cp: Nullable<string>;
    plastics: Nullable<string>;
    textile: Nullable<string>;
};
