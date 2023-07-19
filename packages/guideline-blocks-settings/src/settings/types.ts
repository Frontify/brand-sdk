/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Color } from '@frontify/sidebar-settings';

export enum BorderStyle {
    Solid = 'Solid',
    Dashed = 'Dashed',
    Dotted = 'Dotted',
}

export const borderStyleMap: Record<BorderStyle, string> = {
    [BorderStyle.Solid]: 'solid',
    [BorderStyle.Dotted]: 'dotted',
    [BorderStyle.Dashed]: 'dashed',
};

export enum Radius {
    None = 'None',
    Small = 'Small',
    Medium = 'Medium',
    Large = 'Large',
}

export const radiusStyleMap: Record<Radius, string> = {
    [Radius.None]: '0px',
    [Radius.Small]: '2px',
    [Radius.Medium]: '4px',
    [Radius.Large]: '12px',
};

export enum Padding {
    None = 'None',
    Small = 'Small',
    Medium = 'Medium',
    Large = 'Large',
}

export const paddingStyleMap: Record<Padding, string> = {
    [Padding.None]: '0px',
    [Padding.Small]: '24px',
    [Padding.Medium]: '36px',
    [Padding.Large]: '60px',
};

export type PaddingSettings = {
    paddingChoice: Padding;
    hasCustomPaddingValue: boolean;
    paddingValue: string;
};

export type PaddingExtendedSettings = {
    hasExtendedCustomPadding: boolean;
    extendedPaddingChoice: Padding;
    extendedPaddingTop: string;
    extendedPaddingRight: string;
    extendedPaddingBottom: string;
    extendedPaddingLeft: string;
};

export type RadiusExtendedSettings = {
    hasExtendedCustomRadius: boolean;
    extendedRadiusChoice: Radius;
    extendedRadiusTopLeft: string;
    extendedRadiusTopRight: string;
    extendedRadiusBottomLeft: string;
    extendedRadiusBottomRight: string;
};

export type BorderSettings = {
    hasBorder: boolean;
    borderStyle: BorderStyle;
    borderWidth: string;
    borderColor: Color;
};

export type RadiusSettings = {
    hasRadius: boolean;
    radiusValue: string;
    radiusChoice: Radius;
};

export enum Margin {
    None = 'None',
    Small = 'Small',
    Medium = 'Medium',
    Large = 'Large',
}

export const marginStyleMap: Record<Margin, string> = {
    [Margin.None]: '0px',
    [Margin.Small]: '24px',
    [Margin.Medium]: '36px',
    [Margin.Large]: '60px',
};

export type MarginSettings = {
    marginChoice: Margin;
    hasCustomMarginValue: boolean;
    marginValue: string;
};

export type MarginExtendedSettings = {
    hasExtendedCustomMargin: boolean;
    extendedMarginChoice: Margin;
    extendedMarginTop: string;
    extendedMarginRight: string;
    extendedMarginBottom: string;
    extendedMarginLeft: string;
};

export enum Security {
    Global = 'Global',
    Custom = 'Custom',
}

export enum GutterSpacing {
    Auto = 'Auto',
    S = 'S',
    M = 'M',
    L = 'L',
}

export const gutterSpacingStyleMap: Record<GutterSpacing, string> = {
    [GutterSpacing.Auto]: '4px',
    [GutterSpacing.S]: '10px',
    [GutterSpacing.M]: '30px',
    [GutterSpacing.L]: '50px',
};
