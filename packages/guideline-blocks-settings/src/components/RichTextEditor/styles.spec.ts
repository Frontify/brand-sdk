/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { BlockButtonStyles, BlockStyles, TextStyles } from './styles';

describe('BlockStyles', () => {
    it('should point a heading at its theme variables', () => {
        expect(BlockStyles[TextStyles.heading1]).toEqual({
            fontSize: 'var(--f-theme-settings-heading1-font-size)',
            lineHeight: 'var(--f-theme-settings-heading1-line-height)',
            marginTop: 'var(--f-theme-settings-heading1-margin-top)',
            marginBottom: 'var(--f-theme-settings-heading1-margin-bottom)',
            textDecoration: 'var(--f-theme-settings-heading1-text-decoration)',
            fontStyle: 'var(--f-theme-settings-heading1-font-style)',
            textTransform: 'var(--f-theme-settings-heading1-text-transform)',
            letterSpacing: 'var(--f-theme-settings-heading1-letter-spacing)',
            fontWeight: 'var(--f-theme-settings-heading1-font-weight)',
            fontFamily: 'var(--f-theme-settings-heading1-font-family)',
            color: 'var(--f-theme-settings-heading1-color)',
        });
    });

    it('should point the paragraph at the body theme variables', () => {
        expect(BlockStyles[TextStyles.p]).toEqual({
            fontSize: 'var(--f-theme-settings-body-font-size)',
            lineHeight: 'var(--f-theme-settings-body-line-height)',
            marginTop: 'var(--f-theme-settings-body-margin-top)',
            marginBottom: 'var(--f-theme-settings-body-margin-bottom)',
            textDecoration: 'var(--f-theme-settings-body-text-decoration)',
            fontStyle: 'var(--f-theme-settings-body-font-style)',
            textTransform: 'var(--f-theme-settings-body-text-transform)',
            letterSpacing: 'var(--f-theme-settings-body-letter-spacing)',
            fontWeight: 'var(--f-theme-settings-body-font-weight)',
            fontFamily: 'var(--f-theme-settings-body-font-family)',
            color: 'var(--f-theme-settings-body-color)',
        });
    });

    it('should name the image title theme variables with dashes', () => {
        expect(BlockStyles[TextStyles.imageTitle]).toEqual({
            fontSize: 'var(--f-theme-settings-image-title-font-size)',
            lineHeight: 'var(--f-theme-settings-image-title-line-height)',
            marginTop: 'var(--f-theme-settings-image-title-margin-top)',
            marginBottom: 'var(--f-theme-settings-image-title-margin-bottom)',
            textDecoration: 'var(--f-theme-settings-image-title-text-decoration)',
            fontStyle: 'var(--f-theme-settings-image-title-font-style)',
            textTransform: 'var(--f-theme-settings-image-title-text-transform)',
            letterSpacing: 'var(--f-theme-settings-image-title-letter-spacing)',
            fontWeight: 'var(--f-theme-settings-image-title-font-weight)',
            fontFamily: 'var(--f-theme-settings-image-title-font-family)',
            color: 'var(--f-theme-settings-image-title-color)',
        });
    });

    it('should keep the link styles under the link plugin key', () => {
        expect(BlockStyles['link-plugin']).toEqual({
            fontSize: 'var(--f-theme-settings-link-font-size)',
            lineHeight: 'var(--f-theme-settings-link-line-height)',
            marginTop: 'var(--f-theme-settings-link-margin-top)',
            marginBottom: 'var(--f-theme-settings-link-margin-bottom)',
            textDecoration: 'var(--f-theme-settings-link-text-decoration)',
            fontStyle: 'var(--f-theme-settings-link-font-style)',
            textTransform: 'var(--f-theme-settings-link-text-transform)',
            letterSpacing: 'var(--f-theme-settings-link-letter-spacing)',
            fontWeight: 'var(--f-theme-settings-link-font-weight)',
            fontFamily: 'var(--f-theme-settings-link-font-family)',
            color: 'var(--f-theme-settings-link-color)',
        });
    });

    it('should include the button styles', () => {
        expect(BlockStyles.buttonPrimary).toEqual(BlockButtonStyles.buttonPrimary);
    });
});

describe('BlockButtonStyles', () => {
    it('should keep the box defaults and point the primary button at its theme variables', () => {
        expect(BlockButtonStyles.buttonPrimary).toEqual({
            marginTop: '10px',
            marginBottom: '10px',
            display: 'inline-block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%',
            verticalAlign: 'middle',
            boxSizing: 'border-box',
            overflowWrap: 'normal',
            fontFamily: 'var(--f-theme-settings-button-primary-font-family)',
            fontSize: 'var(--f-theme-settings-button-primary-font-size)',
            fontWeight: 'var(--f-theme-settings-button-primary-font-weight)',
            lineHeight: 'var(--f-theme-settings-button-primary-line-height)',
            paddingTop: 'var(--f-theme-settings-button-primary-padding-top)',
            paddingRight: 'var(--f-theme-settings-button-primary-padding-right)',
            paddingBottom: 'var(--f-theme-settings-button-primary-padding-bottom)',
            paddingLeft: 'var(--f-theme-settings-button-primary-padding-left)',
            fontStyle: 'var(--f-theme-settings-button-primary-font-style)',
            textTransform: 'var(--f-theme-settings-button-primary-text-transform)',
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
        });
    });

    it('should point the tertiary button at the tertiary theme variables', () => {
        expect(BlockButtonStyles.buttonTertiary).toMatchObject({
            fontFamily: 'var(--f-theme-settings-button-tertiary-font-family)',
            hover: { color: 'var(--f-theme-settings-button-tertiary-color-hover)' },
        });
    });
});
