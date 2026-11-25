/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { bulletListLook, linkLook, numberedListLook, textStyleLook } from './looks';

const EXPECTED_TEXT_STYLE_NAMES = [
    'heading1',
    'heading2',
    'heading3',
    'heading4',
    'custom1',
    'custom2',
    'custom3',
    'imageTitle',
    'imageCaption',
    'body',
    'quote',
];

describe('textStyleLook', () => {
    it('should hold the nine text styles, the body text and the quote', () => {
        expect(Object.keys(textStyleLook).sort()).toEqual([...EXPECTED_TEXT_STYLE_NAMES].sort());
    });

    it('should point every field of a text style at its theme variable', () => {
        expect(textStyleLook.heading1).toEqual({
            fontFamily: 'var(--f-theme-settings-heading1-font-family)',
            fontSize: 'var(--f-theme-settings-heading1-font-size)',
            fontWeight: 'var(--f-theme-settings-heading1-font-weight)',
            fontStyle: 'var(--f-theme-settings-heading1-font-style)',
            lineHeight: 'var(--f-theme-settings-heading1-line-height)',
            letterSpacing: 'var(--f-theme-settings-heading1-letter-spacing)',
            textTransform: 'var(--f-theme-settings-heading1-text-transform)',
            textDecoration: 'var(--f-theme-settings-heading1-text-decoration)',
            marginTop: 'var(--f-theme-settings-heading1-margin-top)',
            marginBottom: 'var(--f-theme-settings-heading1-margin-bottom)',
            color: 'var(--f-theme-settings-heading1-color)',
        });
    });

    it('should name the image styles with dashes in their theme variables', () => {
        expect(textStyleLook.imageTitle?.fontSize).toBe('var(--f-theme-settings-image-title-font-size)');
        expect(textStyleLook.imageCaption?.marginTop).toBe('var(--f-theme-settings-image-caption-margin-top)');
    });
});

describe('linkLook', () => {
    it('should style text links with the typography of the link theme variables and nothing else', () => {
        expect(linkLook.text).toEqual({
            fontFamily: 'var(--f-theme-settings-link-font-family)',
            fontSize: 'var(--f-theme-settings-link-font-size)',
            fontWeight: 'var(--f-theme-settings-link-font-weight)',
            fontStyle: 'var(--f-theme-settings-link-font-style)',
            lineHeight: 'var(--f-theme-settings-link-line-height)',
            letterSpacing: 'var(--f-theme-settings-link-letter-spacing)',
            textTransform: 'var(--f-theme-settings-link-text-transform)',
            color: 'var(--f-theme-settings-link-color)',
        });
    });

    it.each(['primary', 'secondary', 'tertiary'] as const)(
        'should leave the %s button colours unfilled when the theme sets none',
        (appearance) => {
            const button = linkLook.button?.[appearance];

            expect(button?.backgroundColor).toBe(
                `var(--f-theme-settings-button-${appearance}-background-color, transparent)`,
            );
            expect(button?.borderColor).toBe(`var(--f-theme-settings-button-${appearance}-border-color, currentcolor)`);
            expect(button?.color).toBe(`var(--f-theme-settings-button-${appearance}-color, currentcolor)`);
        },
    );

    it('should give the hover colours no fallback', () => {
        expect(linkLook.button?.primary?.hover).toEqual({
            backgroundColor: 'var(--f-theme-settings-button-primary-background-color-hover)',
            borderColor: 'var(--f-theme-settings-button-primary-border-color-hover)',
            color: 'var(--f-theme-settings-button-primary-color-hover)',
        });
    });

    it('should point the button box at its theme variables', () => {
        expect(linkLook.button?.secondary).toMatchObject({
            paddingTop: 'var(--f-theme-settings-button-secondary-padding-top)',
            paddingRight: 'var(--f-theme-settings-button-secondary-padding-right)',
            paddingBottom: 'var(--f-theme-settings-button-secondary-padding-bottom)',
            paddingLeft: 'var(--f-theme-settings-button-secondary-padding-left)',
            borderWidth: 'var(--f-theme-settings-button-secondary-border-width)',
            borderRadius: 'var(--f-theme-settings-button-secondary-border-radius)',
        });
    });
});

describe('bulletListLook', () => {
    it('should keep the fallbacks of the bullet levels', () => {
        expect(bulletListLook).toEqual([
            {
                marker: "var(--f-theme-settings-list-bullet1-shape, '•')",
                color: 'var(--f-theme-settings-list-bullet1-color, currentColor)',
                size: 'var(--f-theme-settings-list-bullet1-size, 1em)',
            },
            {
                marker: "var(--f-theme-settings-list-bullet2-shape, '•')",
                color: 'var(--f-theme-settings-list-bullet2-color, currentColor)',
                size: 'var(--f-theme-settings-list-bullet2-size, 1em)',
            },
            {
                marker: "var(--f-theme-settings-list-bullet3-shape, '•')",
                color: 'var(--f-theme-settings-list-bullet3-color, currentColor)',
                size: 'var(--f-theme-settings-list-bullet3-size, 1em)',
            },
        ]);
    });
});

describe('numberedListLook', () => {
    it('should keep the fallbacks of the numbered levels', () => {
        expect(numberedListLook).toEqual([
            {
                marker: 'var(--f-theme-settings-list-numbered1-counter-type, decimal)',
                color: 'var(--f-theme-settings-list-numbered1-color, currentColor)',
            },
            {
                marker: 'var(--f-theme-settings-list-numbered2-counter-type, lower-alpha)',
                color: 'var(--f-theme-settings-list-numbered2-color, currentColor)',
            },
            {
                marker: 'var(--f-theme-settings-list-numbered3-counter-type, lower-roman)',
                color: 'var(--f-theme-settings-list-numbered3-color, currentColor)',
            },
        ]);
    });
});
