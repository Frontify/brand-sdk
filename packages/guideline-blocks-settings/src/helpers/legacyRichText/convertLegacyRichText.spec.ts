/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { convertLegacyRichText } from './convertLegacyRichText';
import { LEGACY_FIXTURES } from './fixtures';
import { type LegacyRichTextTree, type MentionLookup, type ResolveMention } from './types';

const BYTES_PER_MEBIBYTE = 1024 * 1024;
const MAX_DOCUMENT_MEBIBYTES = 5;
const INDENTED_CHECK_ITEM_LEVELS = [1, 2, 3, 2, 1];
const SCANNED_STRING_KEYS = ['text', 'url', 'id', 'link'];
const MIN_SCANNED_LENGTH = 4;

const convertTree = (tree: LegacyRichTextTree, resolveMention?: ResolveMention) => {
    return convertLegacyRichText(JSON.stringify(tree), { resolveMention });
};

const collectSourceStrings = (value: unknown): string[] => {
    const strings: string[] = [];
    const pending: unknown[] = [value];

    while (pending.length > 0) {
        const current = pending.pop();
        if (typeof current !== 'object' || current === null) {
            continue;
        }

        for (const [key, child] of Object.entries(current)) {
            if (typeof child === 'string' && SCANNED_STRING_KEYS.includes(key) && child.length >= MIN_SCANNED_LENGTH) {
                strings.push(child);
            } else {
                pending.push(child);
            }
        }
    }

    return strings;
};

const checkItem = (indent: number, text: string): LegacyRichTextTree[number] => ({
    type: 'checkbox-item',
    indent,
    children: [{ text }],
});

const treeFixtures = LEGACY_FIXTURES.filter((fixture) => fixture.legacy.startsWith('['));
const reviewFixtures = LEGACY_FIXTURES.filter((fixture) => fixture.expectedOutcome === 'requires-review');
const refusedFixtures = LEGACY_FIXTURES.filter(
    (fixture) => fixture.expectedOutcome === 'unsupported' || fixture.expectedOutcome === 'invalid',
);

describe('convertLegacyRichText stored values', () => {
    it.each([
        { name: 'undefined', value: undefined },
        { name: 'null', value: null },
        { name: 'an empty string', value: '' },
        { name: 'the string null', value: 'null' },
        { name: 'a lone line break tag', value: '<br />' },
        { name: 'an empty list', value: '[]' },
    ])('should read $name as an empty document (MIG-12)', ({ value }) => {
        expect(convertLegacyRichText(value)).toEqual({
            outcome: 'exact',
            document: { version: 1, blocks: [] },
            diagnostics: [],
        });
    });

    it.each(['42', '"text"', '{"version":1,"blocks":[]}', 'true'])(
        'should refuse the JSON value %s that is not a list (MIG-12)',
        (value) => {
            expect(convertLegacyRichText(value)).toEqual({
                outcome: 'invalid',
                document: null,
                diagnostics: [{ code: 'invalid-value', path: [] }],
            });
        },
    );

    it.each(['Lorem ipsum', '<p>Lorem <strong>ipsum</strong></p>', '[{"type":'])(
        'should not read the string %s as JSON and report it as an html value (MIG-12)',
        (value) => {
            expect(convertLegacyRichText(value)).toEqual({
                outcome: 'unsupported',
                document: null,
                diagnostics: [{ code: 'html-value', path: [] }],
            });
        },
    );

    it('should refuse a value over the byte limit before reading it (MIG-12)', () => {
        const value = 'a'.repeat(MAX_DOCUMENT_MEBIBYTES * BYTES_PER_MEBIBYTE + 1);

        expect(convertLegacyRichText(value)).toEqual({
            outcome: 'unsupported',
            document: null,
            diagnostics: [{ code: 'limit-exceeded', path: [] }],
        });
    });

    it('should count bytes and not characters against the byte limit (MIG-12)', () => {
        const value = '€'.repeat(Math.ceil((MAX_DOCUMENT_MEBIBYTES * BYTES_PER_MEBIBYTE) / 3) + 1);

        expect(convertLegacyRichText(value).outcome).toBe('unsupported');
    });

    it.todo('should return a value that is already a new-format document unchanged (MIG-12)');
    it.todo('should validate the converted document against the plugins the editor can hold (MIG-18)');
    it.todo('should keep a new-format document byte for byte (MIG-21)');
});

describe('convertLegacyRichText mapping', () => {
    it.each(LEGACY_FIXTURES.filter((fixture) => fixture.expectedDocument !== undefined))(
        'should convert the fixture $id to its expected document (MIG-13)',
        ({ legacy, expectedOutcome, expectedDocument }) => {
            const result = convertLegacyRichText(legacy);

            expect(result.outcome).toBe(expectedOutcome);
            expect(result.document).toEqual(expectedDocument);
        },
    );

    it('should map a resolved mention to a mention inline with its names (MIG-13)', () => {
        const resolveMention: ResolveMention = (kind, id): MentionLookup => {
            return { status: 'resolved', username: `@${id}-${kind}`, name: 'Example Person' };
        };

        const result = convertTree(
            [
                {
                    type: 'p',
                    children: [
                        { type: 'mention', category: 'user', id: 7, children: [{ text: '' }] },
                        { type: 'mention', category: 'group', id: 'group-1', children: [{ text: '' }] },
                        { type: 'mention', category: 'all', id: 'all', children: [{ text: '' }] },
                    ],
                },
            ],
            resolveMention,
        );

        expect(result).toEqual({
            outcome: 'exact',
            document: {
                version: 1,
                blocks: [
                    {
                        type: 'paragraph',
                        children: [
                            { type: 'mention', id: '7', username: '@7-undefined', name: 'Example Person' },
                            {
                                type: 'mention',
                                id: 'group-1',
                                username: '@group-1-group',
                                name: 'Example Person',
                                kind: 'group',
                            },
                            { type: 'mention', id: 'all', username: '@all-all', name: 'Example Person', kind: 'all' },
                        ],
                    },
                ],
            },
            diagnostics: [],
        });
    });

    it('should review a mention the resolver does not know (MIG-13)', () => {
        const result = convertTree(
            [
                {
                    type: 'p',
                    children: [{ type: 'mention', category: 'group', id: 'group-9', children: [{ text: '' }] }],
                },
            ],
            () => ({ status: 'unknown' }),
        );

        expect(result.diagnostics).toEqual([{ code: 'mention-unresolved', path: [0, 0] }]);
        expect(result.document?.blocks).toEqual([
            {
                type: 'paragraph',
                children: [{ type: 'mention', id: 'group-9', username: '', name: '', kind: 'group' }],
            },
        ]);
    });

    it.each([
        { name: 'an id that is not text or a number', mention: { id: { value: 1 }, category: 'user' } },
        { name: 'a category outside the three', mention: { id: 'user-1', category: 'team' } },
    ])('should keep a mention with $name whole (MIG-13)', ({ mention }) => {
        const element = { type: 'mention', ...mention, children: [{ text: '' }] };
        const result = convertTree([{ type: 'p', children: [element] }]);

        expect(result.diagnostics).toEqual([{ code: 'unknown-element', path: [0, 0] }]);
        expect(result.document?.blocks).toEqual([{ type: 'paragraph', children: [element] }]);
    });

    it('should keep a block with an extra property whole as an undeclared key (MIG-13)', () => {
        const result = convertTree([{ type: 'p', lineHeight: 2, children: [{ text: 'Lorem' }] }]);

        expect(result.diagnostics).toEqual([{ code: 'unknown-property', path: [0] }]);
        expect(JSON.stringify(result.document?.blocks)).toBe(
            '[{"type":"paragraph","lineHeight":2,"children":[{"text":"Lorem"}]}]',
        );
    });

    it('should not let a legacy style key replace the style of a text style block (MIG-13)', () => {
        const result = convertTree([{ type: 'heading2', style: 'heading4', children: [{ text: 'Lorem' }] }]);

        expect(result.diagnostics).toEqual([{ code: 'unknown-property', path: [0] }]);
        expect(result.document?.blocks).toEqual([
            { type: 'textStyle', style: 'heading2', children: [{ text: 'Lorem' }] },
        ]);
    });

    it('should not let a legacy link key become a link mark (MIG-13)', () => {
        const result = convertTree([
            { type: 'p', children: [{ text: 'Lorem', link: { href: 'javascript:alert(1)' } }] },
        ]);

        expect(result.diagnostics).toEqual([{ code: 'unknown-property', path: [0, 0] }]);
        expect(result.document?.blocks).toEqual([{ type: 'paragraph', children: [{ text: 'Lorem' }] }]);
    });

    it('should drop a text style equal to its block and keep any other as an undeclared key (MIG-13)', () => {
        const result = convertTree([
            { type: 'heading1', children: [{ text: 'Same', textStyle: 'heading1' }] },
            { type: 'p', children: [{ text: 'Other', textStyle: 'heading1' }] },
        ]);

        expect(result.diagnostics).toEqual([{ code: 'unknown-property', path: [1, 0] }]);
        expect(result.document?.blocks).toEqual([
            { type: 'textStyle', style: 'heading1', children: [{ text: 'Same' }] },
            { type: 'paragraph', children: [{ text: 'Other', textStyle: 'heading1' }] },
        ]);
    });

    it('should keep a block in a position it does not belong to whole (MIG-13)', () => {
        const nested = { type: 'p', children: [{ text: 'Inner' }] };
        const result = convertTree([
            { type: 'p', children: [nested] },
            { type: 'li', children: [{ type: 'lic', children: [{ text: 'Loose' }] }] },
            { type: 'lic', children: [{ text: 'Loose' }] },
        ]);

        expect(result.diagnostics).toEqual([
            { code: 'unknown-element', path: [0, 0] },
            { code: 'unknown-element', path: [1] },
            { code: 'unknown-element', path: [2] },
        ]);
        expect(result.document?.blocks).toEqual([
            { type: 'paragraph', children: [nested] },
            { type: 'li', children: [{ type: 'lic', children: [{ text: 'Loose' }] }] },
            { type: 'lic', children: [{ text: 'Loose' }] },
        ]);
    });

    it('should keep a block type inside a link whole and still link the text beside it (MIG-13)', () => {
        const nested = { type: 'p', children: [{ text: 'Inner' }] };
        const result = convertTree([
            {
                type: 'p',
                children: [{ type: 'a', url: '/page', children: [{ text: 'Before' }, nested, { text: 'After' }] }],
            },
        ]);

        expect(result.diagnostics).toEqual([{ code: 'unknown-element', path: [0, 0, 1] }]);
        expect(result.document?.blocks).toEqual([
            {
                type: 'paragraph',
                children: [
                    { text: 'Before', link: { href: '/page' } },
                    nested,
                    { text: 'After', link: { href: '/page' } },
                ],
            },
        ]);
    });

    it.each([
        { name: 'the legacy link element', element: { type: 'link', url: '/page', children: [{ text: 'Page' }] } },
        { name: 'the emoji element', element: { type: 'emoji', name: 'smile', children: [{ text: '' }] } },
    ])('should keep $name whole as unknown content (MIG-13)', ({ element }) => {
        const result = convertTree([{ type: 'p', children: [element] }]);

        expect(result.diagnostics).toEqual([{ code: 'unknown-element', path: [0, 0] }]);
        expect(result.document?.blocks).toEqual([{ type: 'paragraph', children: [element] }]);
    });

    it.each(['a', 'button'])('should keep a %s around a mention whole and review the mention (MIG-13)', (type) => {
        const element = {
            type,
            url: '/page',
            children: [
                { text: 'Before ' },
                { type: 'mention', category: 'user', id: 'user-1', children: [{ text: '' }] },
                { text: ' after' },
            ],
        };
        const result = convertTree([{ type: 'p', children: [element] }]);

        expect(result.diagnostics).toEqual([{ code: 'unknown-element', path: [0, 0, 1] }]);
        expect(result.document?.blocks).toEqual([{ type: 'paragraph', children: [element] }]);
    });

    it.each([
        { name: 'an empty leaf', type: 'a', children: [{ text: '' }] },
        { name: 'only line breaks', type: 'button', children: [{ text: '\n' }] },
        { name: 'no children', type: 'button', children: [] },
    ])('should keep a link with $name whole and review it (MIG-13)', ({ type, children }) => {
        const element = { type, url: '/page', children };
        const result = convertTree([{ type: 'p', children: [element] }]);

        expect(result.diagnostics).toEqual([{ code: 'unknown-element', path: [0, 0] }]);
        expect(result.document?.blocks).toEqual([{ type: 'paragraph', children: [element] }]);
    });

    it('should keep a link with an extra property whole and report each property (MIG-13)', () => {
        const element = { type: 'a', url: '/page', rel: 'nofollow', title: 'Page', children: [{ text: 'Page' }] };
        const result = convertTree([{ type: 'p', children: [element] }]);

        expect(result.diagnostics).toEqual([
            { code: 'unknown-property', path: [0, 0] },
            { code: 'unknown-property', path: [0, 0] },
        ]);
        expect(result.document?.blocks).toEqual([{ type: 'paragraph', children: [element] }]);
    });

    it('should read the href of a link without a chosen link from its url and target (MIG-13)', () => {
        const result = convertTree([
            {
                type: 'p',
                children: [
                    { type: 'a', url: '/same', children: [{ text: 'Same' }] },
                    { type: 'a', url: '/other', target: '_new', children: [{ text: 'Other' }] },
                ],
            },
        ]);

        expect(result.document?.blocks).toEqual([
            {
                type: 'paragraph',
                children: [
                    { text: 'Same', link: { href: '/same' } },
                    { text: 'Other', link: { href: '/other', openInNewTab: true } },
                ],
            },
        ]);
    });

    it('should fall back to the url when a chosen link has no search result link (MIG-13)', () => {
        const result = convertTree([
            {
                type: 'p',
                children: [
                    {
                        type: 'a',
                        url: '/fallback',
                        target: '_blank',
                        chosenLink: { searchResult: { link: '' } },
                        children: [{ text: 'Page' }],
                    },
                ],
            },
        ]);

        expect(result.document?.blocks).toEqual([
            { type: 'paragraph', children: [{ text: 'Page', link: { href: '/fallback' } }] },
        ]);
    });

    it.each(['ul', 'ol'])('should keep an empty %s whole and review it (MIG-13)', (type) => {
        const result = convertTree([{ type, breakAfterColumn: 'active', children: [] }]);

        expect(result.diagnostics).toEqual([{ code: 'unknown-element', path: [0] }]);
        expect(result.document?.blocks).toEqual([{ type, breakAfterColumn: 'active', children: [] }]);
    });

    it('should keep an empty list inside a list item whole and review it (MIG-13)', () => {
        const result = convertTree([
            { type: 'ul', children: [{ type: 'li', children: [{ type: 'ol', children: [] }] }] },
        ]);

        expect(result.diagnostics).toEqual([{ code: 'unknown-element', path: [0, 0, 0] }]);
        expect(result.document?.blocks).toEqual([
            {
                type: 'bulletList',
                children: [{ type: 'listItem', children: [{ type: 'ol', children: [] }] }],
            },
        ]);
    });

    it('should map a list item without children to a list item with an empty paragraph (MIG-13)', () => {
        const result = convertTree([{ type: 'ul', children: [{ type: 'li', children: [] }] }]);

        expect(result).toEqual({
            outcome: 'exact',
            document: {
                version: 1,
                blocks: [
                    {
                        type: 'bulletList',
                        children: [{ type: 'listItem', children: [{ type: 'paragraph', children: [] }] }],
                    },
                ],
            },
            diagnostics: [],
        });
    });

    it('should wrap a text leaf outside a text block in a paragraph and review it (MIG-13)', () => {
        const result = convertTree([{ text: 'Stray' }]);

        expect(result.diagnostics).toEqual([{ code: 'unknown-element', path: [0] }]);
        expect(result.document?.blocks).toEqual([{ type: 'paragraph', children: [{ text: 'Stray' }] }]);
    });

    it('should drop empty text leaves and keep the breaks between line parts (MIG-13)', () => {
        const result = convertTree([{ type: 'p', children: [{ text: '' }, { text: 'a\n\nb\n' }] }]);

        expect(result.document?.blocks).toEqual([
            {
                type: 'paragraph',
                children: [{ text: 'a' }, { type: 'break' }, { type: 'break' }, { text: 'b' }, { type: 'break' }],
            },
        ]);
    });

    it('should never merge text leaves with different marks or across a break (MIG-13)', () => {
        const result = convertTree([
            { type: 'p', children: [{ text: 'a', bold: true }, { text: 'b' }, { text: 'c\nd' }] },
        ]);

        expect(result.document?.blocks).toEqual([
            {
                type: 'paragraph',
                children: [{ text: 'a', bold: true }, { text: 'bc' }, { type: 'break' }, { text: 'd' }],
            },
        ]);
    });

    it.each(['yes', null, 1, {}])(
        'should report the mark value %j other than a boolean and not copy it under the declared key (MIG-13)',
        (bold) => {
            const result = convertTree([{ type: 'p', children: [{ text: 'Lorem', bold }] }]);

            expect(result.diagnostics).toEqual([{ code: 'unknown-property', path: [0, 0] }]);
            expect(result.document?.blocks).toEqual([{ type: 'paragraph', children: [{ text: 'Lorem' }] }]);
        },
    );

    it('should read a button target that is null as missing and open a new tab (MIG-13)', () => {
        const result = convertTree([
            {
                type: 'p',
                children: [
                    {
                        type: 'button',
                        url: '/page',
                        target: null,
                        buttonStyle: 'tertiary',
                        children: [{ text: 'Page' }],
                    },
                ],
            },
        ]);

        expect(result.outcome).toBe('exact');
        expect(result.document?.blocks).toEqual([
            {
                type: 'paragraph',
                children: [{ text: 'Page', link: { href: '/page', appearance: 'tertiary', openInNewTab: true } }],
            },
        ]);
    });

    it('should read a button style that is null as missing and use primary without review (MIG-13)', () => {
        const result = convertTree([
            {
                type: 'p',
                children: [
                    { type: 'button', url: '/page', target: '_self', buttonStyle: null, children: [{ text: 'Page' }] },
                ],
            },
        ]);

        expect(result.outcome).toBe('exact');
        expect(result.document?.blocks).toEqual([
            {
                type: 'paragraph',
                children: [{ text: 'Page', link: { href: '/page', appearance: 'primary' } }],
            },
        ]);
    });

    it('should wrap a text leaf directly inside a list in a list item and review it (MIG-13)', () => {
        const result = convertTree([{ type: 'ol', children: [{ text: 'Stray' }] }]);

        expect(result.diagnostics).toEqual([{ code: 'unknown-element', path: [0, 0] }]);
        expect(result.document?.blocks).toEqual([
            {
                type: 'numberedList',
                children: [{ type: 'listItem', children: [{ type: 'paragraph', children: [{ text: 'Stray' }] }] }],
            },
        ]);
    });

    it('should keep a break column value other than active or inactive as an undeclared key (MIG-13)', () => {
        const result = convertTree([{ type: 'p', breakAfterColumn: 'later', children: [{ text: 'Lorem' }] }]);

        expect(result.diagnostics).toEqual([{ code: 'unknown-property', path: [0] }]);
        expect(JSON.stringify(result.document?.blocks)).toBe(
            '[{"type":"paragraph","breakAfterColumn":"later","children":[{"text":"Lorem"}]}]',
        );
    });

    it('should keep a column break on a nested block as an undeclared key (MIG-13)', () => {
        const result = convertTree([
            {
                type: 'ul',
                children: [
                    {
                        type: 'li',
                        children: [{ type: 'lic', breakAfterColumn: 'active', children: [{ text: 'Lorem' }] }],
                    },
                ],
            },
        ]);

        expect(result.diagnostics).toEqual([{ code: 'unknown-property', path: [0, 0, 0] }]);
        expect(result.document?.blocks).toEqual([
            {
                type: 'bulletList',
                children: [
                    {
                        type: 'listItem',
                        children: [{ type: 'paragraph', breakAfterColumn: 'active', children: [{ text: 'Lorem' }] }],
                    },
                ],
            },
        ]);
    });

    it('should end a check list at an item that breaks the column (MIG-13)', () => {
        const result = convertTree([
            { type: 'checkbox-item', breakAfterColumn: 'active', children: [{ text: 'One' }] },
            { type: 'checkbox-item', children: [{ text: 'Two' }] },
        ]);

        expect(result.outcome).toBe('exact');
        expect(result.document?.blocks).toEqual([
            {
                type: 'checkList',
                children: [{ type: 'checkItem', children: [{ type: 'paragraph', children: [{ text: 'One' }] }] }],
            },
            { type: 'columnBreak' },
            {
                type: 'checkList',
                children: [{ type: 'checkItem', children: [{ type: 'paragraph', children: [{ text: 'Two' }] }] }],
            },
        ]);
    });
});

describe('convertLegacyRichText alignment', () => {
    it.each(['left', 'center', 'right', 'justify'])('should map the legacy alignment %s (MIG-14)', (align) => {
        const result = convertTree([{ type: 'p', align, children: [{ text: 'Lorem' }] }]);

        expect(result).toEqual({
            outcome: 'exact',
            document: { version: 1, blocks: [{ type: 'paragraph', align, children: [{ text: 'Lorem' }] }] },
            diagnostics: [],
        });
    });

    it.each(['start', 'end', 'Left', '', 1, null])(
        'should keep the alignment %j outside the four unchanged and review it (MIG-14)',
        (align) => {
            const result = convertTree([{ type: 'p', align, children: [{ text: 'Lorem' }] }]);

            expect(result.outcome).toBe('requires-review');
            expect(result.diagnostics).toEqual([{ code: 'unknown-property', path: [0] }]);
            expect(JSON.stringify(result.document?.blocks)).toBe(
                JSON.stringify([{ type: 'paragraph', align, children: [{ text: 'Lorem' }] }]),
            );
        },
    );
});

describe('convertLegacyRichText diagnostics', () => {
    it.each(reviewFixtures)('should report the review code of the fixture $id (MIG-19)', (fixture) => {
        const result = convertLegacyRichText(fixture.legacy);

        expect(result.outcome).toBe('requires-review');
        expect(result.diagnostics).toEqual(fixture.expectedDiagnostics);
    });

    it.each(refusedFixtures)(
        'should report the code of the refused fixture $id without a document (MIG-20)',
        (fixture) => {
            const result = convertLegacyRichText(fixture.legacy);

            expect(result.outcome).toBe(fixture.expectedOutcome);
            expect(result.document).toBeNull();
            expect(result.diagnostics).toEqual(fixture.expectedDiagnostics);
        },
    );

    it.each(treeFixtures)(
        'should keep text, urls and ids of the fixture $id out of its diagnostics (MIG-22)',
        (fixture) => {
            const result = convertLegacyRichText(fixture.legacy);
            const diagnostics = JSON.stringify(result.diagnostics);
            const parsed: unknown = JSON.parse(fixture.legacy);

            for (const source of collectSourceStrings(parsed)) {
                expect(diagnostics).not.toContain(source);
            }
        },
    );
});

describe('convertLegacyRichText check items', () => {
    it('should nest check items by indent 1, 2, 3, 2, 1 (MIG-24)', () => {
        const tree = INDENTED_CHECK_ITEM_LEVELS.map((level, index) => checkItem(level, `Item ${index}`));
        const result = convertTree(tree);

        const paragraph = (index: number) => ({ type: 'paragraph', children: [{ text: `Item ${index}` }] });
        expect(result).toEqual({
            outcome: 'exact',
            document: {
                version: 1,
                blocks: [
                    {
                        type: 'checkList',
                        children: [
                            {
                                type: 'checkItem',
                                children: [
                                    paragraph(0),
                                    {
                                        type: 'checkList',
                                        children: [
                                            {
                                                type: 'checkItem',
                                                children: [
                                                    paragraph(1),
                                                    {
                                                        type: 'checkList',
                                                        children: [{ type: 'checkItem', children: [paragraph(2)] }],
                                                    },
                                                ],
                                            },
                                            { type: 'checkItem', children: [paragraph(3)] },
                                        ],
                                    },
                                ],
                            },
                            { type: 'checkItem', children: [paragraph(4)] },
                        ],
                    },
                ],
            },
            diagnostics: [],
        });
    });

    it('should nest an item more than one level deeper exactly one level and review the jump (MIG-24)', () => {
        const result = convertTree([checkItem(1, 'One'), checkItem(4, 'Jumped'), checkItem(2, 'Back')]);

        expect(result.diagnostics).toEqual([{ code: 'indent-jump', path: [1] }]);
        expect(JSON.stringify(result.document)).toBe(
            JSON.stringify({
                version: 1,
                blocks: [
                    {
                        type: 'checkList',
                        children: [
                            {
                                type: 'checkItem',
                                children: [
                                    { type: 'paragraph', children: [{ text: 'One' }] },
                                    {
                                        type: 'checkList',
                                        children: [
                                            {
                                                type: 'checkItem',
                                                children: [{ type: 'paragraph', children: [{ text: 'Jumped' }] }],
                                            },
                                            {
                                                type: 'checkItem',
                                                children: [{ type: 'paragraph', children: [{ text: 'Back' }] }],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            }),
        );
    });

    it('should count a first item deeper than one as a jump (MIG-24)', () => {
        const result = convertTree([checkItem(3, 'Deep first')]);

        expect(result.diagnostics).toEqual([{ code: 'indent-jump', path: [0] }]);
        expect(result.document?.blocks).toEqual([
            {
                type: 'checkList',
                children: [
                    { type: 'checkItem', children: [{ type: 'paragraph', children: [{ text: 'Deep first' }] }] },
                ],
            },
        ]);
    });

    it.each([0, -1, 1.5, '2', null])(
        'should read the indent %j as level one and keep it as an undeclared key (MIG-24)',
        (indent) => {
            const result = convertTree([{ type: 'checkbox-item', indent, children: [{ text: 'Item' }] }]);

            expect(result.diagnostics).toEqual([{ code: 'unknown-property', path: [0] }]);
            expect(JSON.stringify(result.document?.blocks)).toBe(
                JSON.stringify([
                    {
                        type: 'checkList',
                        children: [
                            {
                                type: 'checkItem',
                                indent,
                                children: [{ type: 'paragraph', children: [{ text: 'Item' }] }],
                            },
                        ],
                    },
                ]),
            );
        },
    );

    it.each(['maybe', null, 1])(
        'should report the checked value %j other than a boolean and not copy it under the declared key (MIG-24)',
        (checked) => {
            const result = convertTree([{ type: 'checkbox-item', checked, children: [{ text: 'Item' }] }]);

            expect(result.diagnostics).toEqual([{ code: 'unknown-property', path: [0] }]);
            expect(JSON.stringify(result.document?.blocks)).not.toContain('checked');
        },
    );

    it('should start a new check list after another block (MIG-24)', () => {
        const result = convertTree([
            checkItem(1, 'One'),
            { type: 'p', children: [{ text: 'Between' }] },
            checkItem(1, 'Two'),
        ]);

        expect(result.document?.blocks.map((block) => block.type)).toEqual(['checkList', 'paragraph', 'checkList']);
    });
});

describe('convertLegacyRichText determinism', () => {
    it.each(LEGACY_FIXTURES)('should give identical output for the fixture $id on every run (MIG-21)', (fixture) => {
        const first = JSON.stringify(convertLegacyRichText(fixture.legacy));
        const second = JSON.stringify(convertLegacyRichText(fixture.legacy));

        expect(second).toBe(first);
    });
});
