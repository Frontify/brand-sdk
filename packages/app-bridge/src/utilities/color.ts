/* (c) Copyright Frontify Ltd., all rights reserved. */

export const rgbStringToRgbObject = (
    rgbString: string,
): { red: number; green: number; blue: number; alpha?: number } => {
    const isRgbaStringFormat = (value: string) => {
        const trimmedValue = value.trim();
        return trimmedValue.startsWith('rgba(') || trimmedValue.startsWith('rgb(');
    };

    const colorArray = rgbString.split('(')[1].split(')')[0].split(',');

    const isColorArrayCorrectTypes = colorArray
        .slice(0, 2)
        .every((value) => value.trim() === parseInt(value).toString());

    if (!isRgbaStringFormat(rgbString) || !isColorArrayCorrectTypes) {
        throw new Error(`String is not a valid color (passed: "${rgbString}").`);
    }

    const parsedColorArray = colorArray.map((value) => parseFloat(value));

    return {
        red: parsedColorArray[0],
        green: parsedColorArray[1],
        blue: parsedColorArray[2],
        alpha: parsedColorArray?.[3] || 1,
    };
};

export const rgbObjectToRgbString = (color: { red: number; green: number; blue: number; alpha?: number }): string => {
    if ('alpha' in color) {
        return `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`;
    }

    return `rgb(${color.red}, ${color.green}, ${color.blue})`;
};
