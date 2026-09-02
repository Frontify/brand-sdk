/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { addHttps } from './addHttps';

describe('String converted to Richtext value', () => {
    it('should return rich text value with correct textStyle', () => {
        const url = 'https://www.frontify.com';
        const result = addHttps(url);
        expect(result).toBe(url);
    });

    it('should not add https:// for mailto', () => {
        const url = 'mailto:info@frontify.com';
        const result = addHttps(url);
        expect(result).toBe(url);
    });

    it('should not add https:// for tel', () => {
        const url = 'tel:+41 44 552 02 22';
        const result = addHttps(url);
        expect(result).toBe(url);
    });

    it('should add https://', () => {
        const url = 'frontify.com';
        const result = addHttps(url);
        expect(result).toBe('https://frontify.com');
    });

    it('should not add https:// for relative url', () => {
        const url = '/document/123';
        const result = addHttps(url);
        expect(result).toBe(url);
    });

    it.each(['/hub/167', '/hub/167?tab=overview#section', '/', '/any/relative/path'])(
        'should not add https:// for the root-relative url %s',
        (url) => {
            expect(addHttps(url)).toBe(url);
        },
    );

    it('should not add https:// for http://', () => {
        const url = 'http://localhost:3000/document/123';
        const result = addHttps(url);
        expect(result).toBe(url);
    });
});
