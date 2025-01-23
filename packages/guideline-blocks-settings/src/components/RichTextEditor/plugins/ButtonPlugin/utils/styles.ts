/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type CSSProperties } from 'react';

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

export const BlockButtonStyles: Record<string, CSSProperties & { hover?: CSSProperties }> = {
    buttonPrimary: {
        ...DefaultButtonStyles,
        fontFamily: 'var(--f-theme-settings-button-primary-font-family)',
        fontSize: 'var(--f-theme-settings-button-primary-font-size)',
        fontWeight: 'var(--f-theme-settings-button-primary-font-weight)',
        lineHeight: 'var(--f-theme-settings-button-primary-line-height)',
        paddingTop: 'var(--f-theme-settings-button-primary-padding-top)',
        paddingRight: 'var(--f-theme-settings-button-primary-padding-right)',
        paddingBottom: 'var(--f-theme-settings-button-primary-padding-bottom)',
        paddingLeft: 'var(--f-theme-settings-button-primary-padding-left)',
        fontStyle: 'var(--f-theme-settings-button-primary-font-style)',
        textTransform: 'var(--f-theme-settings-button-primary-text-transform)' as CSSProperties['textTransform'],
        backgroundColor: 'var(--f-theme-settings-button-primary-background-color)',
        borderColor: 'var(--f-theme-settings-button-primary-border-color)',
        borderRadius: 'var(--f-theme-settings-button-primary-border-radius)',
        borderWidth: 'var(--f-theme-settings-button-primary-border-width)',
        color: 'var(--f-theme-settings-button-primary-color)',

        hover: {
            backgroundColor: 'var(--f-theme-settings-button-primary-background-color-hover)',
            borderColor: 'var(--f-theme-settings-button-primary-border-color-hover)',
            color: 'var(--f-theme-settings-button-primary-color-hover)',
        },
    },

    buttonSecondary: {
        ...DefaultButtonStyles,
        fontFamily: 'var(--f-theme-settings-button-secondary-font-family)',
        fontSize: 'var(--f-theme-settings-button-secondary-font-size)',
        fontWeight: 'var(--f-theme-settings-button-secondary-font-weight)',
        lineHeight: 'var(--f-theme-settings-button-secondary-line-height)',
        paddingTop: 'var(--f-theme-settings-button-secondary-padding-top)',
        paddingRight: 'var(--f-theme-settings-button-secondary-padding-right)',
        paddingBottom: 'var(--f-theme-settings-button-secondary-padding-bottom)',
        paddingLeft: 'var(--f-theme-settings-button-secondary-padding-left)',
        fontStyle: 'var(--f-theme-settings-button-secondary-font-style)',
        textTransform: 'var(--f-theme-settings-button-secondary-text-transform)' as CSSProperties['textTransform'],
        backgroundColor: 'var(--f-theme-settings-button-secondary-background-color)',
        borderColor: 'var(--f-theme-settings-button-secondary-border-color)',
        borderRadius: 'var(--f-theme-settings-button-secondary-border-radius)',
        borderWidth: 'var(--f-theme-settings-button-secondary-border-width)',
        color: 'var(--f-theme-settings-button-secondary-color)',
        hover: {
            backgroundColor: 'var(--f-theme-settings-button-secondary-background-color-hover)',
            borderColor: 'var(--f-theme-settings-button-secondary-border-color-hover)',
            color: 'var(--f-theme-settings-button-secondary-color-hover)',
        },
    },

    buttonTertiary: {
        ...DefaultButtonStyles,
        fontFamily: 'var(--f-theme-settings-button-tertiary-font-family)',
        fontSize: 'var(--f-theme-settings-button-tertiary-font-size)',
        fontWeight: 'var(--f-theme-settings-button-tertiary-font-weight)',
        lineHeight: 'var(--f-theme-settings-button-tertiary-line-height)',
        paddingTop: 'var(--f-theme-settings-button-tertiary-padding-top)',
        paddingRight: 'var(--f-theme-settings-button-tertiary-padding-right)',
        paddingBottom: 'var(--f-theme-settings-button-tertiary-padding-bottom)',
        paddingLeft: 'var(--f-theme-settings-button-tertiary-padding-left)',
        fontStyle: 'var(--f-theme-settings-button-tertiary-font-style)',
        textTransform: 'var(--f-theme-settings-button-tertiary-text-transform)' as CSSProperties['textTransform'],
        backgroundColor: 'var(--f-theme-settings-button-tertiary-background-color)',
        borderColor: 'var(--f-theme-settings-button-tertiary-border-color)',
        borderRadius: 'var(--f-theme-settings-button-tertiary-border-radius)',
        borderWidth: 'var(--f-theme-settings-button-tertiary-border-width)',
        color: 'var(--f-theme-settings-button-tertiary-color)',
        hover: {
            backgroundColor: 'var(--f-theme-settings-button-tertiary-background-color-hover)',
            borderColor: 'var(--f-theme-settings-button-tertiary-border-color-hover)',
            color: 'var(--f-theme-settings-button-tertiary-color-hover)',
        },
    },
};
