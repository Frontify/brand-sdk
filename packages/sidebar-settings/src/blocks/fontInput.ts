/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { BaseBlock } from './base';

/**
 * The origin of the font.
 */
export enum FontProvider {
    Google = 'Google',
    Selfhosted = 'Selfhosted',
    System = 'System',
}

export enum PaddingSizes {
    Auto = 'auto',
    S = 's',
    M = 'm',
    L = 'l',
}

export enum BorderRadius {
    None = 'none',
    S = 's',
    M = 'm',
    L = 'l',
}

export enum TextAlignment {
    Left = 'left',
    Center = 'center',
    Right = 'right',
}

export type FontValuePaddingType = {
    top: string;
    right: string;
    bottom: string;
    left: string;
};

export type FontValueBorderRadiusType = {
    topLeft: string;
    topRight: string;
    bottomRight: string;
    bottomLeft: string;
};

export type FontValue = {
    /**
     * The origin of the font.
     */
    fontProvider: FontProvider | `${FontProvider}`;

    /**
     * The identifier of the font family.
     */
    fontFamily: string | number;

    /**
     * The rgba-color of the text.
     */
    color?: {
        /**
         * The red value of the color (0-255).
         */
        red: number;
        /**
         * The green value of the color (0-255).
         */
        green: number;
        /**
         * The blue value of the color (0-255).
         */
        blue: number;
        /**
         * The alpha value of the color (0-1).
         */
        alpha?: number;
    } | null;

    /**
     * The weight of the font (100-1000, increment of 100).
     */
    weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000;

    /**
     * The size of the font.
     */
    size?: string;

    /**
     * The letter spacing of the text.
     */
    letterSpacing?: string;

    /**
     * The line height of the text.
     */
    lineHeight?: string;

    /**
     * The margin top of the text.
     */
    marginTop?: string;

    /**
     * The margin bottom of the text.
     */
    marginBottom?: string;

    /**
     * Whether the font should be uppercase or not.
     */
    uppercase: boolean;

    /**
     * Whether the font should be italic or not.
     */
    italic: boolean;

    /**
     * Whether the font should be underlined or not.
     */
    underline: boolean;

    /**
     * Where the text is anchor, not quite alignment but similar of the text
     */
    alignment?: TextAlignment;

    /**
     * Whether the text has highlight (backgound color).
     */
    highlight?: boolean;

    /**
     * The highlight color.
     */
    highlightColor?: {
        /**
         * The red value of the color (0-255).
         */
        red: number;
        /**
         * The green value of the color (0-255).
         */
        green: number;
        /**
         * The blue value of the color (0-255).
         */
        blue: number;
        /**
         * The alpha value of the color (0-1).
         */
        alpha?: number;
    } | null;

    /**
     * Padding around the text.
     */
    highlightPaddingCustomEnabled?: boolean;
    highlightPaddingCustom?: FontValuePaddingType | null;
    highlightPaddingChoice?: PaddingSizes;

    /**
     * Highlight border radius.
     */
    highlightBorderRadiusCustomEnabled?: boolean;
    highlightBorderRadiusCustom?: FontValueBorderRadiusType | null;
    highlightBorderRadiusChoice?: BorderRadius;

    /**
     * The rgba-color of the text on hover.
     */
    hoverColor?: {
        /**
         * The red value of the color (0-255).
         */
        red: number;
        /**
         * The green value of the color (0-255).
         */
        green: number;
        /**
         * The blue value of the color (0-255).
         */
        blue: number;
        /**
         * The alpha value of the color (0-1).
         */
        alpha?: number;
    } | null;

    /**
     * The weight of the font on hover (100-1000, increment of 100).
     */
    hoverWeight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 | null;

    /**
     * The size of the font on hover.
     */
    hoverSize?: string;

    /**
     * The letter spacing of the text on hover.
     */
    hoverLetterSpacing?: string;

    /**
     * The line height of the text on hover.
     */
    hoverLineHeight?: string;

    /**
     * Whether the font should be uppercase or not on hover.
     */
    hoverUppercase?: boolean;

    /**
     * Whether the font should be italic or not on hover.
     */
    hoverItalic?: boolean;

    /**
     * Whether the font should be underlined or not on hover.
     */
    hoverUnderline?: boolean;

    /**
     * Whether the text has highlight (backgound color) on hover.
     */
    hoverHighlight?: boolean;

    /**
     * The highlight color of the text on hover.
     */
    hoverHighlightColor?: {
        /**
         * The red value of the color (0-255).
         */
        red: number;
        /**
         * The green value of the color (0-255).
         */
        green: number;
        /**
         * The blue value of the color (0-255).
         */
        blue: number;
        /**
         * The alpha value of the color (0-1).
         */
        alpha?: number;
    } | null;

    /**
     * Padding around the text on hover.
     */
    hoverHighlightPaddingCustomEnabled?: boolean;
    hoverHighlightPaddingCustom?: FontValuePaddingType | null;
    hoverHighlightPaddingChoice?: PaddingSizes;

    /**
     * Highlight border radius on hover.
     */
    hoverHighlightBorderRadiusCustomEnabled?: boolean;
    hoverHighlightBorderRadiusCustom?: FontValueBorderRadiusType | null;
    hoverHighlightBorderRadiusChoice?: BorderRadius;

    /**
     * The color of the text when active.
     */
    activeColor?: {
        /**
         * The red value of the background color when active (0-255).
         */
        red: number;
        /**
         * The green value of the background color when active (0-255).
         */
        green: number;
        /**
         * The blue value of the background color when active (0-255).
         */
        blue: number;
        /**
         * The alpha value of the color when active (0-1).
         */
        alpha?: number;
    } | null;

    /**
     * The weight of the font when active (100-1000, increment of 100).
     */
    activeWeight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 | null;

    /**
     * The size of the font when active.
     */
    activeSize?: string;

    /**
     * The letter spacing of the text when active.
     */
    activeLetterSpacing?: string;

    /**
     * The line height of the text when active.
     */
    activeLineHeight?: string;

    /**
     * Whether the font should be uppercase or not when active.
     */
    activeUppercase?: boolean;

    /**
     * Whether the font should be italic or not when active.
     */
    activeItalic?: boolean;

    /**
     * Whether the font should be underlined or not when active.
     */
    activeUnderline?: boolean;

    /**
     * Whether the text has highlight (backgound color) when active.
     */
    activeHighlight?: boolean;

    /**
     * The highlight of the text when active.
     */
    activeHighlightColor?: {
        /**
         * The red value of the color (0-255).
         */
        red: number;
        /**
         * The green value of the color (0-255).
         */
        green: number;
        /**
         * The blue value of the color (0-255).
         */
        blue: number;
        /**
         * The alpha value of the color (0-1).
         */
        alpha?: number;
    } | null;

    /**
     * Padding around the text when active.
     */
    activeHighlightPaddingCustomEnabled?: boolean;
    activeHighlightPaddingCustom?: FontValuePaddingType | null;
    activeHighlightPaddingChoice?: PaddingSizes;

    /**
     * Highlight border radius when active.
     */
    activeHighlightBorderRadiusCustomEnabled?: boolean;
    activeHighlightBorderRadiusCustom?: FontValueBorderRadiusType | null;
    activeHighlightBorderRadiusChoice?: BorderRadius;
};

export type FontInputBlock<AppBridge> = {
    /**
     * The setting type.
     */
    type: 'fontInput';

    /**
     * The text to be displayed in the setting.
     * @default "Lorem Ipsum"
     */
    placeholder?: string;

    /**
     * Values used for visualization on slider fields, like:
     *    autoPaddingSizeLabel: Whether a label other than 'Auto' is used for 'auto' padding size.
     *    paddingSizeChoiceValues: actual values for generic padding sizes choices, used for preview:
     *          { auto: '12px 4px', s: '4px', m: '8px', l: '12px' }
     *    borderRadiusChoiceValues: actual values for generic border radius choices, used for preview:
     *          { none: '0', s: '2px', m: '4px', l: '12px' }
     */
    predefinedChoiceValues?: {
        [choice: string]: { [option: string]: string } | string;
    };
    /**
     * Whether all (default/hover/active) state tabs as needed or just the `default` state with the enabled fields.
     * On state tabs, only fields set in the `defaultValue` object will be shown.
     */
    stateTabsEnabled?: 'none' | 'all';
} & BaseBlock<AppBridge, FontValue>;
