/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type CSSProperties } from 'react';

import { THEME_KEYS, themeVariable } from './themeVariables';

const LINK_PLUGIN = 'link-plugin';

const DefaultButtonStyles: CSSProperties = {
    marginTop: '10px',
    marginBottom: '10px',
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    verticalAlign: 'middle',
    boxSizing: 'border-box',
    overflowWrap: 'normal',
};

export enum TextStyles {
    heading1 = 'heading1',
    heading2 = 'heading2',
    heading3 = 'heading3',
    heading4 = 'heading4',
    custom1 = 'custom1',
    custom2 = 'custom2',
    custom3 = 'custom3',
    quote = 'quote',
    imageCaption = 'imageCaption',
    imageTitle = 'imageTitle',
    p = 'p',
}

type ThemeStyle = CSSProperties & { hover?: CSSProperties };

const textStyle = (key: string): ThemeStyle => ({
    fontSize: themeVariable(key, 'font-size'),
    lineHeight: themeVariable(key, 'line-height'),
    marginTop: themeVariable(key, 'margin-top'),
    marginBottom: themeVariable(key, 'margin-bottom'),
    textDecoration: themeVariable(key, 'text-decoration'),
    fontStyle: themeVariable(key, 'font-style'),
    textTransform: themeVariable(key, 'text-transform'),
    letterSpacing: themeVariable(key, 'letter-spacing'),
    fontWeight: themeVariable(key, 'font-weight'),
    fontFamily: themeVariable(key, 'font-family'),
    color: themeVariable(key, 'color'),
});

const buttonStyle = (key: string): ThemeStyle => ({
    ...DefaultButtonStyles,
    fontFamily: themeVariable(key, 'font-family'),
    fontSize: themeVariable(key, 'font-size'),
    fontWeight: themeVariable(key, 'font-weight'),
    lineHeight: themeVariable(key, 'line-height'),
    paddingTop: themeVariable(key, 'padding-top'),
    paddingRight: themeVariable(key, 'padding-right'),
    paddingBottom: themeVariable(key, 'padding-bottom'),
    paddingLeft: themeVariable(key, 'padding-left'),
    fontStyle: themeVariable(key, 'font-style'),
    textTransform: themeVariable(key, 'text-transform'),
    backgroundColor: themeVariable(key, 'background-color'),
    borderColor: themeVariable(key, 'border-color'),
    borderRadius: themeVariable(key, 'border-radius'),
    borderWidth: themeVariable(key, 'border-width'),
    color: themeVariable(key, 'color'),
    hover: {
        backgroundColor: themeVariable(key, 'background-color-hover'),
        borderColor: themeVariable(key, 'border-color-hover'),
        color: themeVariable(key, 'color-hover'),
    },
});

export const BlockButtonStyles: Record<string, ThemeStyle> = {
    buttonPrimary: buttonStyle(THEME_KEYS.buttonPrimary),
    buttonSecondary: buttonStyle(THEME_KEYS.buttonSecondary),
    buttonTertiary: buttonStyle(THEME_KEYS.buttonTertiary),
};

export const BlockStyles: Record<string, ThemeStyle> = {
    [TextStyles.heading1]: textStyle(THEME_KEYS.heading1),
    [TextStyles.heading2]: textStyle(THEME_KEYS.heading2),
    [TextStyles.heading3]: textStyle(THEME_KEYS.heading3),
    [TextStyles.heading4]: textStyle(THEME_KEYS.heading4),
    [TextStyles.custom1]: textStyle(THEME_KEYS.custom1),
    [TextStyles.custom2]: textStyle(THEME_KEYS.custom2),
    [TextStyles.custom3]: textStyle(THEME_KEYS.custom3),
    [TextStyles.p]: textStyle(THEME_KEYS.body),
    [TextStyles.quote]: textStyle(THEME_KEYS.quote),
    [TextStyles.imageCaption]: textStyle(THEME_KEYS.imageCaption),
    [TextStyles.imageTitle]: textStyle(THEME_KEYS.imageTitle),
    [LINK_PLUGIN]: textStyle(THEME_KEYS.link),
    ...BlockButtonStyles,
};
