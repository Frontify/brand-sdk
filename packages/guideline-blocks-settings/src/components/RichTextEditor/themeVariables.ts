/* (c) Copyright Frontify Ltd., all rights reserved. */

import { THEME_PREFIX } from './constants';

export const THEME_KEYS = {
    heading1: 'heading1',
    heading2: 'heading2',
    heading3: 'heading3',
    heading4: 'heading4',
    custom1: 'custom1',
    custom2: 'custom2',
    custom3: 'custom3',
    imageTitle: 'image-title',
    imageCaption: 'image-caption',
    body: 'body',
    quote: 'quote',
    link: 'link',
    buttonPrimary: 'button-primary',
    buttonSecondary: 'button-secondary',
    buttonTertiary: 'button-tertiary',
} as const;

export const themeVariable = (key: string, property: string, fallback?: string): string => {
    if (fallback === undefined) {
        return `var(${THEME_PREFIX}${key}-${property})`;
    }

    return `var(${THEME_PREFIX}${key}-${property}, ${fallback})`;
};
