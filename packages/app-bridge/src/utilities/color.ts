/* (c) Copyright Frontify Ltd., all rights reserved. */

export const rgbStringToRgbObject = (
    rgbString: string,
): { red: number; green: number; blue: number; alpha?: number } => {
    const isRgbaStringFormat = (value: string) => {
        const trimmedValue = value.trim();
        return trimmedValue.startsWith('rgba(') || trimmedValue.startsWith('rgb(');
    };

    if (!isRgbaStringFormat(rgbString)) {
        throw new Error(`String is not a valid color (passed: "${rgbString}").`);
    }

    const colorArray = rgbString
        .split('(')[1]
        .split(')')[0]
        .split(',')
        .map((value) => parseFloat(value));

    return {
        red: colorArray[0] || 0,
        green: colorArray[1] || 0,
        blue: colorArray[2] || 0,
        alpha: colorArray?.[3] || 1,
    };
};

export const rgbObjectToRgbString = (color: { red: number; green: number; blue: number; alpha?: number }): string => {
    if ('alpha' in color) {
        return `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`;
    }

    return `rgb(${color.red}, ${color.green}, ${color.blue})`;
};
