/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { BaseBlock } from './base';

export enum FontProvider {
    Google = 'Google',
    Selfhosted = 'Selfhosted',
    System = 'System',
}

export type FontValue = {
    fontFamily: string | number;
    fontProvider: FontProvider | keyof FontProvider;
    color?: {
        red: number;
        green: number;
        blue: number;
        alpha?: number;
    } | null;
    weight: number;
    size?: string;
    letterSpacing?: string;
    lineHeight?: string;
    uppercase: boolean;
    italic: boolean;
    underline: boolean;

    hoverColor?: {
        red: number;
        green: number;
        blue: number;
        alpha?: number;
    } | null;
    hoverBackgroundColor?: {
        red: number;
        green: number;
        blue: number;
        alpha?: number;
    } | null;
    hoverWeight: number;
    hoverSize?: string;
    hoverLetterSpacing?: string;
    hoverLineHeight?: string;
    hoverUppercase: boolean;
    hoverItalic: boolean;
    hoverUnderline: boolean;

    activeColor?: {
        red: number;
        green: number;
        blue: number;
        alpha?: number;
    } | null;
    activeBackgroundColor?: {
        red: number;
        green: number;
        blue: number;
        alpha?: number;
    } | null;
    activeWeight: number;
    activeSize?: string;
    activeLetterSpacing?: string;
    activeLineHeight?: string;
    activeUppercase: boolean;
    activeItalic: boolean;
    activeUnderline: boolean;
};

export type FontInputBlock<AppBridge> = {
    type: 'fontInput';
    placeholder?: string;
} & BaseBlock<AppBridge, FontValue>;
