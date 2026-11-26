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

import { THEME_KEYS, themeVariable } from './themeVariables';

const UNFILLED_BACKGROUND = 'transparent';
const CURRENT_COLOR = 'currentColor';
const BULLET_MARKER_FALLBACK = "'•'";
const BULLET_SIZE_FALLBACK = '1em';
const NUMBERED_MARKER_FALLBACKS = ['decimal', 'lower-alpha', 'lower-roman'] as const;

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
    borderColor: themeVariable(key, 'border-color', CURRENT_COLOR),
    color: themeVariable(key, 'color', CURRENT_COLOR),
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
        color: themeVariable(key, 'color', CURRENT_COLOR),
        size: themeVariable(key, 'size', BULLET_SIZE_FALLBACK),
    };
};

const numberedLevelLook = (level: number, markerFallback: string): NumberedLevelLook => {
    const key = `list-numbered${level}`;

    return {
        marker: themeVariable(key, 'counter-type', markerFallback),
        color: themeVariable(key, 'color', CURRENT_COLOR),
    };
};

export const textStyleLook: TextStyleLook = {
    heading1: textLook(THEME_KEYS.heading1),
    heading2: textLook(THEME_KEYS.heading2),
    heading3: textLook(THEME_KEYS.heading3),
    heading4: textLook(THEME_KEYS.heading4),
    custom1: textLook(THEME_KEYS.custom1),
    custom2: textLook(THEME_KEYS.custom2),
    custom3: textLook(THEME_KEYS.custom3),
    imageTitle: textLook(THEME_KEYS.imageTitle),
    imageCaption: textLook(THEME_KEYS.imageCaption),
    body: textLook(THEME_KEYS.body),
    quote: textLook(THEME_KEYS.quote),
};

export const linkLook: LinkLook = {
    text: textLinkLook(THEME_KEYS.link),
    button: {
        primary: buttonLook(THEME_KEYS.buttonPrimary),
        secondary: buttonLook(THEME_KEYS.buttonSecondary),
        tertiary: buttonLook(THEME_KEYS.buttonTertiary),
    },
};

export const bulletListLook: BulletListLook = [bulletLevelLook(1), bulletLevelLook(2), bulletLevelLook(3)];

export const numberedListLook: NumberedListLook = [
    numberedLevelLook(1, NUMBERED_MARKER_FALLBACKS[0]),
    numberedLevelLook(2, NUMBERED_MARKER_FALLBACKS[1]),
    numberedLevelLook(3, NUMBERED_MARKER_FALLBACKS[2]),
];
