/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';
import { getQueryParameters } from './queryParams';

describe('queryParams', () => {
    it('should return correct queryParams from url', () => {
        expect(getQueryParameters('https://www.frontify.com?foo=bar&baz=qux')).toEqual({ foo: 'bar', baz: 'qux' });
    });

    it('should return empty object if no queryParams are present', () => {
        expect(getQueryParameters('https://www.frontify.com')).toEqual({});
    });

    it('should return empty object if url is empty', () => {
        expect(getQueryParameters('')).toEqual({});
    });

    it('should return empty object if url is undefined', () => {
        expect(getQueryParameters(undefined)).toEqual({});
    });

    it('should return empty object if url is null', () => {
        expect(getQueryParameters(null)).toEqual({});
    });

    it('should return objects of well formed query parameters', () => {
        expect(getQueryParameters('https://www.frontify.com?foo=bar&baz')).toEqual({ foo: 'bar' });
    });
});
