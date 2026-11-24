/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { isSafeHref, readButtonAppearance, readsAsNewTab, writeTarget } from './link';

const LONG_PATH_LENGTH = 2048;

describe('readsAsNewTab', () => {
    it.each(['_blank', '_new'])('should read the target %s as a new tab (MIG-13)', (target) => {
        expect(readsAsNewTab(target)).toBe(true);
    });

    it.each(['_self', '_top', '_parent', 'frame', '', undefined, null, 1])(
        'should read the target %j as the same tab (MIG-13)',
        (target) => {
            expect(readsAsNewTab(target)).toBe(false);
        },
    );
});

describe('writeTarget', () => {
    it.each([
        { openInNewTab: true, target: '_blank' },
        { openInNewTab: false, target: '_self' },
    ])('should write $target when openInNewTab is $openInNewTab (MIG-25)', ({ openInNewTab, target }) => {
        expect(writeTarget(openInNewTab)).toBe(target);
    });

    it.each([true, false])('should read back the target written for openInNewTab %s (MIG-25)', (openInNewTab) => {
        expect(readsAsNewTab(writeTarget(openInNewTab))).toBe(openInNewTab);
    });
});

describe('readButtonAppearance', () => {
    it.each(['primary', 'secondary', 'tertiary'])('should keep the button style %s (MIG-13)', (style) => {
        expect(readButtonAppearance(style)).toBe(style);
    });

    it.each(['ghost', 'Primary', '', undefined, null, 1])('should not read %j as a button style (MIG-13)', (style) => {
        expect(readButtonAppearance(style)).toBeUndefined();
    });
});

describe('isSafeHref', () => {
    it.each([
        'https://example.com/path?query=1#section',
        'HTTP://example.com',
        'mailto:info@example.com',
        'tel:+41445520222',
        '/document/123',
        '?tab=overview',
        '#section',
        'relative/path',
        '//example.com/path',
        `/${'a'.repeat(LONG_PATH_LENGTH - 1)}`,
    ])('should allow the href %j (PST-28)', (href) => {
        expect(isSafeHref(href)).toBe(true);
    });

    it.each([
        'javascript:alert(1)',
        'JavaScript:alert(1)',
        ' javascript:alert(1)',
        'java\tscript:alert(1)',
        'java\nscript:alert(1)',
        'data:text/html,lorem',
        'vbscript:msgbox(1)',
        'file:///etc/passwd',
        'https://example.com/\u0007bell',
        'https://example.com/\u0085next',
        `/${'a'.repeat(LONG_PATH_LENGTH)}`,
        '',
    ])('should refuse the href %j (PST-28)', (href) => {
        expect(isSafeHref(href)).toBe(false);
    });

    it.each(['https://user:secret@example.com', 'http://user@example.com', 'https://:secret@example.com', 'http://'])(
        'should refuse the href %j with credentials or no host (PST-29)',
        (href) => {
            expect(isSafeHref(href)).toBe(false);
        },
    );

    it.each([undefined, null, 1, {}, ['https://example.com']])(
        'should refuse the value %j that is not a string (PST-28)',
        (href) => {
            expect(isSafeHref(href)).toBe(false);
        },
    );
});
