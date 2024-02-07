/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type ProjectColor } from '../types/Color';

export class ProjectColorDummy {
    static red(id = 767): ProjectColor {
        return {
            id,
            sort: 1,
            color: {
                title: 'Red',
                revision: {
                    nameCss: 'red',
                    hex: 'ff0000',
                    red: 255,
                    green: 0,
                    blue: 0,
                    alpha: 255,
                    hue: 361,
                    saturation: 100,
                    lightness: 46,
                    c: 0,
                    m: 100,
                    y: 100,
                    k: 0,
                    pantone: null,
                    ral: null,
                    oracal: null,
                    pantoneCoated: null,
                    pantoneUncoated: null,
                    cmykCoated: null,
                    cmykUncoated: null,
                    cmykNewspaper: null,
                    ncs: null,
                    pantoneCp: null,
                    pantonePlastics: null,
                    pantoneTextile: null,
                    hks: null,
                    threeM: null,
                    lab: null,
                },
            },
        };
    }

    static yellow(id = 768): ProjectColor {
        return {
            id,
            sort: 2,
            color: {
                title: 'Yellow',
                revision: {
                    nameCss: 'yellow',
                    red: 255,
                    green: 255,
                    blue: 0,
                    hex: 'ffff00',
                    alpha: 255,
                    hue: 361,
                    saturation: 100,
                    lightness: 46,
                    c: 0,
                    m: 0,
                    y: 100,
                    k: 0,
                    pantone: null,
                    ral: null,
                    oracal: null,
                    pantoneCoated: null,
                    pantoneUncoated: null,
                    cmykCoated: null,
                    cmykUncoated: null,
                    cmykNewspaper: null,
                    ncs: null,
                    pantoneCp: null,
                    pantonePlastics: null,
                    pantoneTextile: null,
                    hks: null,
                    threeM: null,
                    lab: null,
                },
            },
        };
    }

    static green(id = 769): ProjectColor {
        return {
            id,
            sort: 3,
            color: {
                title: 'Green',
                revision: {
                    nameCss: 'green',
                    red: 0,
                    green: 255,
                    blue: 0,
                    hex: '00ff00',
                    alpha: 255,
                    hue: 361,
                    saturation: 100,
                    lightness: 46,
                    c: 100,
                    m: 0,
                    y: 100,
                    k: 0,
                    pantone: null,
                    ral: null,
                    oracal: null,
                    pantoneCoated: null,
                    pantoneUncoated: null,
                    cmykCoated: null,
                    cmykUncoated: null,
                    cmykNewspaper: null,
                    ncs: null,
                    pantoneCp: null,
                    pantonePlastics: null,
                    pantoneTextile: null,
                    hks: null,
                    threeM: null,
                    lab: null,
                },
            },
        };
    }
}
