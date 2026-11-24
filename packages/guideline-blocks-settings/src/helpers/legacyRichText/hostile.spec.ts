/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { convertLegacyRichText } from './convertLegacyRichText';
import { isSafeHref } from './link';
import { type ConvertLegacyRichTextResult } from './types';

const BYTES_PER_MEBIBYTE = 1024 * 1024;
const OVER_LIMIT_MEBIBYTES = 6;
const NESTING_OVER_LIMIT = 70;
const NESTING_FAR_OVER_LIMIT = 100_000;
const NODES_OVER_LIMIT = 60_000;
const MAX_MILLISECONDS = 1000;
const NESTED_OPEN = '{"type":"p","children":[';
const NESTED_CLOSE = ']}';
const LEAF = '{"text":"Lorem"}';

const createNestedValue = (depth: number): string => {
    return `[${NESTED_OPEN.repeat(depth)}${LEAF}${NESTED_CLOSE.repeat(depth)}]`;
};

const collectLinkHrefs = (document: unknown): unknown[] => {
    const hrefs: unknown[] = [];
    const pending: unknown[] = [document];

    while (pending.length > 0) {
        const current = pending.pop();
        if (typeof current !== 'object' || current === null) {
            continue;
        }

        for (const key of Object.keys(current)) {
            const child: unknown = Reflect.get(current, key);
            if (key === 'link' && typeof child === 'object' && child !== null && 'href' in child) {
                hrefs.push(child.href);
            }

            pending.push(child);
        }
    }

    return hrefs;
};

const convertTimed = (value: string): { result: ConvertLegacyRichTextResult; milliseconds: number } => {
    const start = performance.now();
    const result = convertLegacyRichText(value);

    return { result, milliseconds: performance.now() - start };
};

describe('convertLegacyRichText with hostile input', () => {
    it.each([NESTING_OVER_LIMIT, NESTING_FAR_OVER_LIMIT])(
        'should refuse a tree nested %i levels deep without recursing (MIG-27)',
        (depth) => {
            const { result, milliseconds } = convertTimed(createNestedValue(depth));

            expect(result).toEqual({
                outcome: 'unsupported',
                document: null,
                diagnostics: [{ code: 'limit-exceeded', path: [] }],
            });
            expect(milliseconds).toBeLessThan(MAX_MILLISECONDS);
        },
    );

    it('should refuse a tree with more nodes than the limit (MIG-27)', () => {
        const value = `[${Array.from({ length: NODES_OVER_LIMIT }, () => LEAF).join(',')}]`;
        const { result, milliseconds } = convertTimed(value);

        expect(result.outcome).toBe('unsupported');
        expect(result.diagnostics).toEqual([{ code: 'limit-exceeded', path: [] }]);
        expect(milliseconds).toBeLessThan(MAX_MILLISECONDS);
    });

    it('should refuse a text leaf longer than the limit (MIG-27)', () => {
        const value = JSON.stringify([{ type: 'p', children: [{ text: 'a'.repeat(1_000_001) }] }]);
        const { result, milliseconds } = convertTimed(value);

        expect(result.outcome).toBe('unsupported');
        expect(milliseconds).toBeLessThan(MAX_MILLISECONDS);
    });

    it('should refuse a string of 6 MiB (MIG-27)', () => {
        const { result, milliseconds } = convertTimed('x'.repeat(OVER_LIMIT_MEBIBYTES * BYTES_PER_MEBIBYTE));

        expect(result.outcome).toBe('unsupported');
        expect(result.diagnostics).toEqual([{ code: 'limit-exceeded', path: [] }]);
        expect(milliseconds).toBeLessThan(MAX_MILLISECONDS);
    });

    it('should convert a text leaf with a million line breaks within a second (MIG-27)', () => {
        const value = JSON.stringify([{ type: 'p', children: [{ text: '\n'.repeat(999_999) }] }]);
        const { result, milliseconds } = convertTimed(value);

        expect(result.outcome).toBe('exact');
        expect(milliseconds).toBeLessThan(MAX_MILLISECONDS);
    });

    it.each([
        'javascript:alert(1)',
        'JAVASCRIPT:alert(1)',
        'data:text/html,<script>alert(1)</script>',
        'vbscript:msgbox(1)',
        'java\tscript:alert(1)',
        'https://user:secret@example.com/path',
        'http://user@example.com',
    ])('should drop the unsafe href %j and report the link (MIG-27)', (url) => {
        const value = JSON.stringify([
            {
                type: 'p',
                children: [
                    { type: 'a', url, children: [{ text: 'Anchor' }] },
                    { type: 'button', url, buttonStyle: 'primary', children: [{ text: 'Button' }] },
                    {
                        type: 'a',
                        url: '/safe',
                        chosenLink: { searchResult: { link: url } },
                        children: [{ text: 'Chosen' }],
                    },
                ],
            },
        ]);
        const { result } = convertTimed(value);

        expect(result.outcome).toBe('requires-review');
        expect(result.diagnostics).toEqual([
            { code: 'link-unsafe', path: [0, 0] },
            { code: 'link-unsafe', path: [0, 1] },
            { code: 'link-unsafe', path: [0, 2] },
        ]);
        expect(collectLinkHrefs(result.document)).toEqual([]);
    });

    it('should leave no link in any output whose href fails the safety check (MIG-27)', () => {
        const value = JSON.stringify([
            {
                type: 'p',
                children: [
                    { type: 'a', url: 'https://example.com', children: [{ text: 'Safe' }] },
                    { type: 'a', url: 'javascript:alert(1)', children: [{ text: 'Unsafe' }] },
                    { text: 'Leaf', link: { href: 'javascript:alert(1)' } },
                ],
            },
        ]);
        const hrefs = collectLinkHrefs(convertLegacyRichText(value).document);

        expect(hrefs).toEqual(['https://example.com']);
        for (const href of hrefs) {
            expect(isSafeHref(href)).toBe(true);
        }
    });

    it.each(['__proto__', 'constructor', 'prototype', 'toString'])(
        'should keep the key %s as plain data and leave prototypes untouched (MIG-27)',
        (key) => {
            const value = `[{"type":"p","${key}":{"polluted":true},"children":[{"text":"Lorem","${key}":{"polluted":true}}]}]`;
            const result = convertLegacyRichText(value);
            const block = result.document?.blocks[0];

            expect(result.outcome).toBe('requires-review');
            expect(result.diagnostics).toEqual([
                { code: 'unknown-property', path: [0] },
                { code: 'unknown-property', path: [0, 0] },
            ]);
            expect(block).toBeDefined();
            expect(Object.getPrototypeOf(block)).toBe(Object.prototype);
            expect(Object.keys(block ?? {})).toContain(key);
            expect(Reflect.get({}, 'polluted')).toBeUndefined();
        },
    );

    it('should keep a __proto__ key inside an unknown element as plain data (MIG-27)', () => {
        const value = '[{"type":"emoji","__proto__":{"polluted":true},"children":[{"text":""}]}]';
        const block = convertLegacyRichText(value).document?.blocks[0];

        expect(Object.getPrototypeOf(block)).toBe(Object.prototype);
        expect(Object.keys(block ?? {})).toEqual(['type', '__proto__', 'children']);
        expect(Reflect.get({}, 'polluted')).toBeUndefined();
    });

    it.each([
        { name: 'a number', value: '[1]', path: [0] },
        { name: 'a string', value: '["Lorem"]', path: [0] },
        { name: 'null', value: '[null]', path: [0] },
        { name: 'a boolean', value: '[true]', path: [0] },
        { name: 'a nested list', value: '[[]]', path: [0] },
        { name: 'an object without a type', value: '[{"children":[]}]', path: [0] },
        { name: 'an element without children', value: '[{"type":"p"}]', path: [0] },
        { name: 'an element whose children are not a list', value: '[{"type":"p","children":{}}]', path: [0] },
        { name: 'an element whose type is not a string', value: '[{"type":1,"children":[]}]', path: [0] },
        { name: 'a nested number', value: '[{"type":"p","children":[1]}]', path: [0, 0] },
        { name: 'text that is not a string', value: '[{"type":"p","children":[{"text":5}]}]', path: [0, 0] },
        { name: 'text that is null', value: '[{"type":"p","children":[{"text":null}]}]', path: [0, 0] },
        { name: 'a later bad node', value: '[{"text":"a"},{"text":"b"},{"text":{}}]', path: [2] },
    ])('should report $name as an invalid node at its path (MIG-27)', ({ value, path }) => {
        const { result, milliseconds } = convertTimed(value);

        expect(result).toEqual({
            outcome: 'invalid',
            document: null,
            diagnostics: [{ code: 'invalid-node', path }],
        });
        expect(milliseconds).toBeLessThan(MAX_MILLISECONDS);
    });

    it.each(['{', '[', '[1,', 'undefined', '\u0000', '\uD800', '<'])(
        'should not throw on the string %j (MIG-27)',
        (value) => {
            expect(() => convertLegacyRichText(value)).not.toThrow();
        },
    );

    it('should convert a deeply nested property value without recursing (MIG-27)', () => {
        const deep = `${'['.repeat(NESTING_FAR_OVER_LIMIT)}${']'.repeat(NESTING_FAR_OVER_LIMIT)}`;
        const value = `[{"type":"p","extra":${deep},"children":[{"text":"Lorem"}]}]`;
        const { result, milliseconds } = convertTimed(value);

        expect(result.outcome).toBe('requires-review');
        expect(milliseconds).toBeLessThan(MAX_MILLISECONDS);
    });
});
