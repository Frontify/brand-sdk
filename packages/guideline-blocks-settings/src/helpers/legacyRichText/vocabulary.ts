/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type RteText, type TextStyleName } from './types';

export const TEXT_MARK_KEYS = [
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'code',
    'subscript',
    'superscript',
] satisfies readonly (keyof RteText)[];

// Every text style the new format has; a release that adds one fails typecheck here.
const TEXT_STYLE_NAMES: Record<TextStyleName, true> = {
    heading1: true,
    heading2: true,
    heading3: true,
    heading4: true,
    custom1: true,
    custom2: true,
    custom3: true,
    imageTitle: true,
    imageCaption: true,
};

export const isTextStyleName = (type: string): type is TextStyleName => {
    return Object.keys(TEXT_STYLE_NAMES).includes(type);
};
