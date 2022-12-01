/* (c) Copyright Frontify Ltd., all rights reserved. */

export const generatePaddingString = (paddingSpiderInput: (string | null)[]): string => {
    if (paddingSpiderInput.length === 0) {
        return '0px';
    }
    const [top, left, right, bottom] = paddingSpiderInput;

    return [top, right, bottom, left].map((pixels) => pixels || '0px').join(' ');
};
