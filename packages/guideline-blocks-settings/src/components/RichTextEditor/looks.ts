/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    type BulletLevelLook,
    type BulletListLook,
    type ButtonLook,
    type LinkLook,
    type NumberedLevelLook,
    type NumberedListLook,
    type TextLinkLook,
    type TextLook,
    type TextStyleLook,
} from '@frontify/fondue/rich-text-editor/plugins';

import { THEME_PREFIX } from './constants';

const UNFILLED_BACKGROUND = 'transparent';
const UNFILLED_COLOR = 'currentcolor';
const LIST_COLOR_FALLBACK = 'currentColor';
const BULLET_MARKER_FALLBACK = "'•'";
const BULLET_SIZE_FALLBACK = '1em';
const NUMBERED_MARKER_FALLBACKS = ['decimal', 'lower-alpha', 'lower-roman'] as const;

const themeVariable = (key: string, property: string, fallback?: string): string => {
    if (fallback === undefined) {
        return `var(${THEME_PREFIX}${key}-${property})`;
    }

    return `var(${THEME_PREFIX}${key}-${property}, ${fallback})`;
};

const textLook = (key: string): TextLook => ({
    fontFamily: themeVariable(key, 'font-family'),
    fontSize: themeVariable(key, 'font-size'),
    fontWeight: themeVariable(key, 'font-weight'),
    fontStyle: themeVariable(key, 'font-style'),
    lineHeight: themeVariable(key, 'line-height'),
    letterSpacing: themeVariable(key, 'letter-spacing'),
    textTransform: themeVariable(key, 'text-transform'),
    textDecoration: themeVariable(key, 'text-decoration'),
    marginTop: themeVariable(key, 'margin-top'),
    marginBottom: themeVariable(key, 'margin-bottom'),
    color: themeVariable(key, 'color'),
});

const textLinkLook = (key: string): TextLinkLook => ({
    fontFamily: themeVariable(key, 'font-family'),
    fontSize: themeVariable(key, 'font-size'),
    fontWeight: themeVariable(key, 'font-weight'),
    fontStyle: themeVariable(key, 'font-style'),
    lineHeight: themeVariable(key, 'line-height'),
    letterSpacing: themeVariable(key, 'letter-spacing'),
    textTransform: themeVariable(key, 'text-transform'),
    color: themeVariable(key, 'color'),
});

// Unset theme colours stay unfilled instead of taking Fondue's default.
const buttonLook = (key: string): ButtonLook => ({
    fontFamily: themeVariable(key, 'font-family'),
    fontSize: themeVariable(key, 'font-size'),
    fontWeight: themeVariable(key, 'font-weight'),
    fontStyle: themeVariable(key, 'font-style'),
    lineHeight: themeVariable(key, 'line-height'),
    textTransform: themeVariable(key, 'text-transform'),
    paddingTop: themeVariable(key, 'padding-top'),
    paddingRight: themeVariable(key, 'padding-right'),
    paddingBottom: themeVariable(key, 'padding-bottom'),
    paddingLeft: themeVariable(key, 'padding-left'),
    borderWidth: themeVariable(key, 'border-width'),
    borderRadius: themeVariable(key, 'border-radius'),
    backgroundColor: themeVariable(key, 'background-color', UNFILLED_BACKGROUND),
    borderColor: themeVariable(key, 'border-color', UNFILLED_COLOR),
    color: themeVariable(key, 'color', UNFILLED_COLOR),
    hover: {
        backgroundColor: themeVariable(key, 'background-color-hover'),
        borderColor: themeVariable(key, 'border-color-hover'),
        color: themeVariable(key, 'color-hover'),
    },
});

const bulletLevelLook = (level: number): BulletLevelLook => {
    const key = `list-bullet${level}`;

    return {
        marker: themeVariable(key, 'shape', BULLET_MARKER_FALLBACK),
        color: themeVariable(key, 'color', LIST_COLOR_FALLBACK),
        size: themeVariable(key, 'size', BULLET_SIZE_FALLBACK),
    };
};

const numberedLevelLook = (level: number, markerFallback: string): NumberedLevelLook => {
    const key = `list-numbered${level}`;

    return {
        marker: themeVariable(key, 'counter-type', markerFallback),
        color: themeVariable(key, 'color', LIST_COLOR_FALLBACK),
    };
};

export const textStyleLook: TextStyleLook = {
    heading1: textLook('heading1'),
    heading2: textLook('heading2'),
    heading3: textLook('heading3'),
    heading4: textLook('heading4'),
    custom1: textLook('custom1'),
    custom2: textLook('custom2'),
    custom3: textLook('custom3'),
    imageTitle: textLook('image-title'),
    imageCaption: textLook('image-caption'),
    body: textLook('body'),
    quote: textLook('quote'),
};

export const linkLook: LinkLook = {
    text: textLinkLook('link'),
    button: {
        primary: buttonLook('button-primary'),
        secondary: buttonLook('button-secondary'),
        tertiary: buttonLook('button-tertiary'),
    },
};

export const bulletListLook: BulletListLook = [bulletLevelLook(1), bulletLevelLook(2), bulletLevelLook(3)];

export const numberedListLook: NumberedListLook = [
    numberedLevelLook(1, NUMBERED_MARKER_FALLBACKS[0]),
    numberedLevelLook(2, NUMBERED_MARKER_FALLBACKS[1]),
    numberedLevelLook(3, NUMBERED_MARKER_FALLBACKS[2]),
];
