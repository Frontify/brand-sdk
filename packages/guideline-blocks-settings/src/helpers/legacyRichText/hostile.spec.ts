/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it, vi } from 'vitest';

import { convertLegacyRichText } from './convertLegacyRichText';
import { isSafeHref } from './link';
import { toLegacyRichText } from './toLegacyRichText';
import { type ConvertLegacyRichTextResult } from './types';

const BYTES_PER_MEBIBYTE = 1024 * 1024;
const OVER_LIMIT_MEBIBYTES = 6;
const NESTING_OVER_LIMIT = 70;
const NESTING_FAR_OVER_LIMIT = 100_000;
const NODES_OVER_LIMIT = 60_000;
const MAX_CPU_MILLISECONDS = 1000;
const SLOW_TEST_TIMEOUT_MS = 30_000;
const MICROSECONDS_PER_MILLISECOND = 1000;
const NESTED_OPEN = '{"type":"p","children":[';
const NESTED_CLOSE = ']}';
const LEAF = '{"text":"Lorem"}';
const MARK_NESTING = 200_000;
const COLOR_DIGITS = 100_000;
const REPEATED_PARTS = 100_000;
const LARGE_MARK_LENGTH = 2000;
const MAX_CHECK_LEVEL = 64;
const CHECK_LEVELS_FAR_OVER_LIMIT = 50_000;

const createNestedValue = (depth: number): string => {
    return `[${NESTED_OPEN.repeat(depth)}${LEAF}${NESTED_CLOSE.repeat(depth)}]`;
};

const createNestedArray = (depth: number): unknown[] => {
    let nested: unknown[] = [];
    for (let level = 0; level < depth; level++) {
        nested = [nested];
    }

    return nested;
};

const createCheckItems = (levels: number): string => {
    const items = Array.from({ length: levels }, (_, index) => ({
        type: 'checkbox-item',
        indent: index + 1,
        children: [{ text: 'a' }],
    }));

    return JSON.stringify(items);
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

// CPU time of this process, so other processes on a loaded machine do not decide the result.
const measureCpu = <TResult>(run: () => TResult): { result: TResult; cpuMilliseconds: number } => {
    const start = process.cpuUsage();
    const result = run();
    const { user, system } = process.cpuUsage(start);

    return { result, cpuMilliseconds: (user + system) / MICROSECONDS_PER_MILLISECOND };
};

const convertTimed = (value: string): { result: ConvertLegacyRichTextResult; cpuMilliseconds: number } => {
    return measureCpu(() => convertLegacyRichText(value));
};

describe('convertLegacyRichText with hostile input', { timeout: SLOW_TEST_TIMEOUT_MS }, () => {
    it.each([NESTING_OVER_LIMIT, NESTING_FAR_OVER_LIMIT])(
        'should refuse a tree nested %i levels deep without recursing (MIG-27)',
        (depth) => {
            const { result, cpuMilliseconds } = convertTimed(createNestedValue(depth));

            expect(result).toEqual({
                outcome: 'unsupported',
                document: null,
                diagnostics: [{ code: 'limit-exceeded', path: [] }],
            });
            expect(cpuMilliseconds).toBeLessThan(MAX_CPU_MILLISECONDS);
        },
    );

    it('should refuse a tree with more nodes than the limit (MIG-27)', () => {
        const value = `[${Array.from({ length: NODES_OVER_LIMIT }, () => LEAF).join(',')}]`;
        const { result, cpuMilliseconds } = convertTimed(value);

        expect(result.outcome).toBe('unsupported');
        expect(result.diagnostics).toEqual([{ code: 'limit-exceeded', path: [] }]);
        expect(cpuMilliseconds).toBeLessThan(MAX_CPU_MILLISECONDS);
    });

    it('should refuse a text leaf longer than the limit (MIG-27)', () => {
        const value = JSON.stringify([{ type: 'p', children: [{ text: 'a'.repeat(1_000_001) }] }]);
        const { result, cpuMilliseconds } = convertTimed(value);

        expect(result.outcome).toBe('unsupported');
        expect(cpuMilliseconds).toBeLessThan(MAX_CPU_MILLISECONDS);
    });

    it('should refuse a string of 6 MiB (MIG-27)', () => {
        const { result, cpuMilliseconds } = convertTimed('x'.repeat(OVER_LIMIT_MEBIBYTES * BYTES_PER_MEBIBYTE));

        expect(result.outcome).toBe('unsupported');
        expect(result.diagnostics).toEqual([{ code: 'limit-exceeded', path: [] }]);
        expect(cpuMilliseconds).toBeLessThan(MAX_CPU_MILLISECONDS);
    });

    it('should convert a text leaf with a million line breaks within a second (MIG-27)', () => {
        const value = JSON.stringify([{ type: 'p', children: [{ text: '\n'.repeat(999_999) }] }]);
        const { result, cpuMilliseconds } = convertTimed(value);

        expect(result.outcome).toBe('exact');
        expect(cpuMilliseconds).toBeLessThan(MAX_CPU_MILLISECONDS);
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
        const { result, cpuMilliseconds } = convertTimed(value);

        expect(result).toEqual({
            outcome: 'invalid',
            document: null,
            diagnostics: [{ code: 'invalid-node', path }],
        });
        expect(cpuMilliseconds).toBeLessThan(MAX_CPU_MILLISECONDS);
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
        const { result, cpuMilliseconds } = convertTimed(value);

        expect(result.outcome).toBe('requires-review');
        expect(cpuMilliseconds).toBeLessThan(MAX_CPU_MILLISECONDS);
    });

    it('should compare deeply nested undeclared marks of adjacent leaves without recursing (MIG-27)', () => {
        const deep = `${'['.repeat(MARK_NESTING)}${']'.repeat(MARK_NESTING)}`;
        const value = `[{"type":"p","children":[{"text":"a","x":${deep}},{"text":"b","x":${deep}}]}]`;
        const { result, cpuMilliseconds } = convertTimed(value);

        expect(result.outcome).toBe('requires-review');
        expect(Reflect.get(result.document?.blocks[0] ?? {}, 'children')).toHaveLength(1);
        expect(cpuMilliseconds).toBeLessThan(MAX_CPU_MILLISECONDS);
    });

    it('should copy the marks of a leaf once however many line parts it has (MIG-27)', () => {
        const mark = Array.from({ length: LARGE_MARK_LENGTH }, (_, index) => index);
        const value = JSON.stringify([{ type: 'p', children: [{ text: 'a\n'.repeat(REPEATED_PARTS), x: mark }] }]);
        const { result, cpuMilliseconds } = convertTimed(value);

        expect(result.outcome).toBe('requires-review');
        expect(cpuMilliseconds).toBeLessThan(MAX_CPU_MILLISECONDS);
    });

    it('should refuse a colour with a hundred thousand digits without backtracking (MIG-27)', () => {
        const color = `rgba(0,0,0,${'1'.repeat(COLOR_DIGITS)}x`;
        const { result, cpuMilliseconds } = convertTimed(
            JSON.stringify([{ type: 'p', children: [{ text: 'Lorem', color }] }]),
        );

        expect(result.diagnostics).toEqual([{ code: 'color-unparsed', path: [0, 0] }]);
        expect(cpuMilliseconds).toBeLessThan(MAX_CPU_MILLISECONDS);
    });

    it.each([MAX_CHECK_LEVEL + 1, CHECK_LEVELS_FAR_OVER_LIMIT])(
        'should refuse check items nested %i levels deep (MIG-27)',
        (levels) => {
            const { result, cpuMilliseconds } = convertTimed(createCheckItems(levels));

            expect(result).toEqual({
                outcome: 'unsupported',
                document: null,
                diagnostics: [{ code: 'limit-exceeded', path: [] }],
            });
            expect(cpuMilliseconds).toBeLessThan(MAX_CPU_MILLISECONDS);
        },
    );

    it('should still convert check items nested as deep as the limit (MIG-27)', () => {
        expect(convertTimed(createCheckItems(MAX_CHECK_LEVEL)).result.outcome).toBe('exact');
    });
});

describe('toLegacyRichText with hostile input', { timeout: SLOW_TEST_TIMEOUT_MS }, () => {
    it('should compare deeply nested undeclared marks of adjacent leaves without recursing (MIG-27)', () => {
        const result = toLegacyRichText({
            version: 1,
            blocks: [
                {
                    type: 'paragraph',
                    children: [
                        { text: 'a', x: createNestedArray(MARK_NESTING) },
                        { text: 'b', x: createNestedArray(MARK_NESTING) },
                    ],
                },
            ],
        });

        expect(result.outcome).toBe('exact');
        expect(result.value?.[0].children).toHaveLength(1);
    });

    it('should not write a font colour with a hundred thousand digits, without backtracking (MIG-27)', () => {
        const color = `rgba(0,0,0,${'1'.repeat(COLOR_DIGITS)}x`;
        const { result, cpuMilliseconds } = measureCpu(() => {
            return toLegacyRichText({
                version: 1,
                blocks: [{ type: 'paragraph', children: [{ text: 'a', fontColor: { color } }] }],
            });
        });

        expect(result.outcome).toBe('not-reversible');
        expect(cpuMilliseconds).toBeLessThan(MAX_CPU_MILLISECONDS);
    });

    it('should not write a link whose href fails the safety check (MIG-27)', () => {
        const result = toLegacyRichText({
            version: 1,
            blocks: [{ type: 'paragraph', children: [{ text: 'Click', link: { href: 'javascript:alert(1)' } }] }],
        });

        expect(result).toEqual({
            outcome: 'not-reversible',
            value: null,
            diagnostics: [{ code: 'no-legacy-form', path: [0, 0] }],
        });
    });

    it.each([
        null,
        42,
        'text',
        true,
        {},
        { version: 1 },
        { version: 1, blocks: 'text' },
        { version: 1, blocks: [null] },
    ])('should refuse the document %j that is not an object with blocks without throwing (MIG-27)', (document) => {
        const result: unknown = Reflect.apply(toLegacyRichText, undefined, [document]);

        expect(result).toEqual({
            outcome: 'not-reversible',
            value: null,
            diagnostics: [{ code: 'no-legacy-form', path: [] }],
        });
    });
});

describe('isSafeHref with hostile input', () => {
    it('should read credentials from the authority without URL.canParse (PST-29)', () => {
        vi.spyOn(URL, 'canParse').mockImplementation(() => {
            throw new Error('URL.canParse is unavailable');
        });

        expect(isSafeHref('https://user:secret@example.com/path')).toBe(false);
        expect(isSafeHref('https:user@example.com')).toBe(false);
        expect(isSafeHref('https:/\\user@example.com')).toBe(false);
        expect(isSafeHref('https://example.com/path?next=a@b#c@d')).toBe(true);
    });
});
