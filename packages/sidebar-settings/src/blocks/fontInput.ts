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
     * The background color of the text on hover.
     */
    hoverBackgroundColor?: {
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
    hoverWeight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000;

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
    hoverUppercase: boolean;

    /**
     * Whether the font should be italic or not on hover.
     */
    hoverItalic: boolean;

    /**
     * Whether the font should be underlined or not on hover.
     */
    hoverUnderline: boolean;

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
     * The background color of the text when active.
     */
    activeBackgroundColor?: {
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
         * The alpha value of the background color when active (0-1).
         */
        alpha?: number;
    } | null;

    /**
     * The weight of the font when active (100-1000, increment of 100).
     */
    activeWeight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000;

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
    activeUppercase: boolean;

    /**
     * Whether the font should be italic or not when active.
     */
    activeItalic: boolean;

    /**
     * Whether the font should be underlined or not when active.
     */
    activeUnderline: boolean;
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
} & BaseBlock<AppBridge, FontValue>;
