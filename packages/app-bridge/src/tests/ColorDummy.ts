/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Color, ColorCreate, ColorPatch } from '../types/Color';

export class ColorDummy {
    static red(id = 767): Color {
        return {
            id,
            name: 'Red',
            sort: 1,
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
        };
    }

    static yellow(id = 768): Color {
        return {
            id,
            name: 'Yellow',
            sort: 2,
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
        };
    }

    static green(id = 769): Color {
        return {
            id,
            name: 'Green',
            sort: 3,
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
        };
    }
}

export class ColorCreateDummy {
    static red(): ColorCreate {
        return {
            colorPaletteId: 23,
            red: 255,
            green: 0,
            blue: 0,
            alpha: 255,
        };
    }
}

export class ColorPatchDummy {
    static red(): ColorPatch {
        return {
            name: 'Red',
            sort: 1,
            nameCss: 'red',
            red: 255,
            green: 0,
            blue: 0,
            alpha: 255,
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
        };
    }
}
