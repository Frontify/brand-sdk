/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { convertLegacyRichText } from './convertLegacyRichText';
import { LEGACY_FIXTURES } from './fixtures';
import { type LegacyRichTextTree, type MentionLookup, type ResolveMention } from './types';

const BYTES_PER_MEBIBYTE = 1024 * 1024;
const MAX_DOCUMENT_MEBIBYTES = 5;
const INDENTED_CHECK_ITEM_LEVELS = [1, 2, 3, 2, 1];
const UNKNOWN_INLINE_COUNT = 20_000;
const SCANNED_STRING_KEYS = ['text', 'url', 'id', 'link'];
const MIN_SCANNED_LENGTH = 4;
const NEW_TAB_TARGET = '_blank';
const SAME_TAB_TARGET = '_self';

const convertTree = (tree: LegacyRichTextTree, resolveMention?: ResolveMention) => {
    return convertLegacyRichText(JSON.stringify(tree), { resolveMention });
};

const targetOf = (openInNewTab: boolean): string => {
    if (openInNewTab) {
        return NEW_TAB_TARGET;
    }

    return SAME_TAB_TARGET;
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

const readTextLeafMarks = (block: unknown, key: string): unknown[] => {
    const marks: unknown[] = [];
    const children: unknown = Reflect.get(Object(block), 'children');
    if (!Array.isArray(children)) {
        return marks;
    }

    for (const child of children) {
        if (Reflect.get(child, 'text') !== undefined) {
            marks.push(Reflect.get(child, key));
        }
    }

    return marks;
};

const readNested = (mark: unknown): unknown => Reflect.get(Object(mark), 'nested');

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

    it('should accept the stored value of a mention without reporting it or copying it (MIG-13)', () => {
        const resolveMention: ResolveMention = (): MentionLookup => {
            return { status: 'resolved', username: '@ada', name: 'Ada' };
        };

        const result = convertTree(
            [
                {
                    type: 'p',
                    children: [
                        {
                            type: 'mention',
                            value: 'Old Label',
                            category: 'user',
                            id: 'user-1',
                            children: [{ text: '' }],
                        },
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
                    { type: 'paragraph', children: [{ type: 'mention', id: 'user-1', username: '@ada', name: 'Ada' }] },
                ],
            },
            diagnostics: [],
        });
        expect(JSON.stringify(result.document)).not.toContain('Old Label');
    });

    it.each([{ value: { a: 1 } }, { value: 5 }, { value: null }, { value: ['x'] }])(
        'should report a mention value of $value that is not text (MIG-13)',
        ({ value }) => {
            const resolveMention: ResolveMention = (): MentionLookup => {
                return { status: 'resolved', username: '@ada', name: 'Ada' };
            };

            const result = convertTree(
                [
                    {
                        type: 'p',
                        children: [
                            { type: 'mention', value, category: 'user', id: 'user-1', children: [{ text: '' }] },
                        ],
                    },
                ],
                resolveMention,
            );

            expect(result.diagnostics).toEqual([{ code: 'unknown-property', path: [0, 0] }]);
        },
    );

    it('should accept a mention without a value (MIG-13)', () => {
        const resolveMention: ResolveMention = (): MentionLookup => {
            return { status: 'resolved', username: '@ada', name: 'Ada' };
        };

        const result = convertTree(
            [{ type: 'p', children: [{ type: 'mention', category: 'user', id: 'user-1', children: [{ text: '' }] }] }],
            resolveMention,
        );

        expect(result.outcome).toBe('exact');
        expect(result.diagnostics).toEqual([]);
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

    it('should use the stored value as the name when the resolver does not know the mention (Q6, MIG-13)', () => {
        const result = convertTree(
            [
                {
                    type: 'p',
                    children: [
                        {
                            type: 'mention',
                            value: 'Old Label',
                            category: 'user',
                            id: 'user-1',
                            children: [{ text: '' }],
                        },
                    ],
                },
            ],
            () => ({ status: 'unknown' }),
        );

        expect(result.diagnostics).toEqual([{ code: 'mention-unresolved', path: [0, 0] }]);
        expect(result.document?.blocks).toEqual([
            { type: 'paragraph', children: [{ type: 'mention', id: 'user-1', username: '', name: 'Old Label' }] },
        ]);
    });

    it('should use the stored value as the name when there is no resolver (Q6, MIG-13)', () => {
        const result = convertTree([
            {
                type: 'p',
                children: [
                    { type: 'mention', value: 'Old Label', category: 'user', id: 'user-1', children: [{ text: '' }] },
                ],
            },
        ]);

        expect(result.diagnostics).toEqual([{ code: 'mention-unresolved', path: [0, 0] }]);
        expect(result.document?.blocks).toEqual([
            { type: 'paragraph', children: [{ type: 'mention', id: 'user-1', username: '', name: 'Old Label' }] },
        ]);
    });

    it('should keep the resolver names over the stored value for a resolved mention (Q6, MIG-13)', () => {
        const result = convertTree(
            [
                {
                    type: 'p',
                    children: [
                        {
                            type: 'mention',
                            value: 'Old Label',
                            category: 'user',
                            id: 'user-1',
                            children: [{ text: '' }],
                        },
                    ],
                },
            ],
            () => ({ status: 'resolved', username: '@ada', name: 'Ada' }),
        );

        expect(result.diagnostics).toEqual([]);
        expect(result.document?.blocks).toEqual([
            { type: 'paragraph', children: [{ type: 'mention', id: 'user-1', username: '@ada', name: 'Ada' }] },
        ]);
    });

    it('should leave the name empty when an unresolved mention has a value that is not text (Q6, MIG-13)', () => {
        const result = convertTree(
            [
                {
                    type: 'p',
                    children: [{ type: 'mention', value: 5, category: 'user', id: 'user-1', children: [{ text: '' }] }],
                },
            ],
            () => ({ status: 'unknown' }),
        );

        expect(result.diagnostics).toEqual([
            { code: 'unknown-property', path: [0, 0] },
            { code: 'mention-unresolved', path: [0, 0] },
        ]);
        expect(result.document?.blocks).toEqual([
            { type: 'paragraph', children: [{ type: 'mention', id: 'user-1', username: '', name: '' }] },
        ]);
    });

    it.each([
        { name: 'an id that is not text or a number', mention: { id: { value: 1 }, category: 'user' } },
        { name: 'a category outside the three', mention: { id: 'user-1', category: 'team' } },
    ])('should refuse a mention with $name because it would be read as a real mention (MIG-13)', ({ mention }) => {
        const result = convertTree([
            { type: 'p', children: [{ type: 'mention', ...mention, children: [{ text: '' }] }] },
        ]);

        expect(result).toEqual({
            outcome: 'unsupported',
            document: null,
            diagnostics: [{ code: 'reserved-type', path: [0, 0] }],
        });
    });

    it('should convert a mention with an extra property and report it without copying it (MIG-13)', () => {
        const result = convertTree([
            {
                type: 'p',
                children: [
                    { type: 'mention', category: 'group', id: 'group-1', extra: { a: 1 }, children: [{ text: '' }] },
                ],
            },
        ]);

        expect(result.diagnostics).toEqual([
            { code: 'unknown-property', path: [0, 0] },
            { code: 'mention-unresolved', path: [0, 0] },
        ]);
        expect(result.document?.blocks).toEqual([
            {
                type: 'paragraph',
                children: [{ type: 'mention', id: 'group-1', username: '', name: '', kind: 'group' }],
            },
        ]);
    });

    it.each([
        {
            name: 'a quote inside a paragraph',
            tree: [{ type: 'p', children: [{ type: 'quote', children: [{ text: 'x' }] }] }],
            path: [0, 0],
        },
        { name: 'a table element', tree: [{ type: 'table', children: [] }], path: [0] },
        { name: 'a break element', tree: [{ type: 'p', children: [{ type: 'break', children: [] }] }], path: [0, 0] },
        {
            name: 'a list item type outside a list',
            tree: [{ type: 'ul', children: [{ type: 'li', children: [{ type: 'listItem', children: [] }] }] }],
            path: [0, 0, 0],
        },
    ])('should refuse $name kept whole under a type the new format declares (MIG-13)', ({ tree, path }) => {
        expect(convertTree(tree)).toEqual({
            outcome: 'unsupported',
            document: null,
            diagnostics: [{ code: 'reserved-type', path }],
        });
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

    it('should report a children key on a leaf and not copy it as a mark (MIG-13)', () => {
        const result = convertTree([{ type: 'p', children: [{ text: 'hi', children: [{ text: 'x' }] }] }]);

        expect(result.diagnostics).toEqual([{ code: 'unknown-property', path: [0, 0] }]);
        expect(result.document?.blocks).toEqual([{ type: 'paragraph', children: [{ text: 'hi' }] }]);
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

    it('should keep the second of two equal adjacent buttons whole and review it (MIG-13)', () => {
        const button = { type: 'button', url: '/page', buttonStyle: 'secondary', children: [{ text: 'Go' }] };
        const result = convertTree([{ type: 'p', children: [button, { text: '' }, button] }]);

        expect(result.diagnostics).toEqual([{ code: 'unknown-element', path: [0, 2] }]);
        expect(result.document?.blocks).toEqual([
            {
                type: 'paragraph',
                children: [
                    { text: 'Go', link: { href: '/page', appearance: 'secondary', openInNewTab: true } },
                    button,
                ],
            },
        ]);
    });

    it('should keep two adjacent buttons that differ, and merge equal adjacent text links (MIG-13)', () => {
        const first = { type: 'button', url: '/page', buttonStyle: 'secondary', children: [{ text: 'One' }] };
        const second = { type: 'button', url: '/page', buttonStyle: 'primary', children: [{ text: 'Two' }] };
        const anchor = { type: 'a', url: '/other', children: [{ text: 'A' }] };
        const result = convertTree([{ type: 'p', children: [first, second, { text: ' ' }, anchor, anchor] }]);

        expect(result.outcome).toBe('exact');
        expect(result.document?.blocks).toEqual([
            {
                type: 'paragraph',
                children: [
                    { text: 'One', link: { href: '/page', appearance: 'secondary', openInNewTab: true } },
                    { text: 'Two', link: { href: '/page', appearance: 'primary', openInNewTab: true } },
                    { text: ' ' },
                    { text: 'AA', link: { href: '/other' } },
                ],
            },
        ]);
    });

    it('should keep a button whose text holds a line break whole and review it (MIG-13)', () => {
        const element = { type: 'button', url: '/page', children: [{ text: 'One\nTwo' }] };
        const result = convertTree([{ type: 'p', children: [element] }]);

        expect(result.diagnostics).toEqual([{ code: 'unknown-element', path: [0, 0] }]);
        expect(result.document?.blocks).toEqual([{ type: 'paragraph', children: [element] }]);
    });

    it('should read a break inside a text link as a break between linked text (MIG-13)', () => {
        const result = convertTree([
            { type: 'p', children: [{ type: 'a', url: '/page', children: [{ text: 'One\nTwo' }] }] },
        ]);

        expect(result.outcome).toBe('exact');
        expect(result.document?.blocks).toEqual([
            {
                type: 'paragraph',
                children: [
                    { text: 'One', link: { href: '/page' } },
                    { type: 'break' },
                    { text: 'Two', link: { href: '/page' } },
                ],
            },
        ]);
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

    it.each([
        { flag: true, openInNewTab: true, reviewed: false },
        { flag: false, openInNewTab: false, reviewed: false },
        { flag: null, openInNewTab: false, reviewed: false },
        { flag: undefined, openInNewTab: false, reviewed: false },
        { flag: 1, openInNewTab: true, reviewed: true },
        { flag: 'yes', openInNewTab: true, reviewed: true },
        { flag: {}, openInNewTab: true, reviewed: true },
        { flag: 0, openInNewTab: false, reviewed: true },
        { flag: '', openInNewTab: false, reviewed: true },
    ])(
        'should read the chosen link flag $flag as new tab $openInNewTab and review it $reviewed (MIG-13)',
        ({ flag, openInNewTab, reviewed }) => {
            const result = convertTree([
                {
                    type: 'p',
                    children: [
                        {
                            type: 'a',
                            url: '/page',
                            target: targetOf(openInNewTab),
                            chosenLink: { searchResult: { link: '/page' }, openInNewTab: flag },
                            children: [{ text: 'Page' }],
                        },
                    ],
                },
            ]);

            const link: { href: string; openInNewTab?: true } = { href: '/page' };
            if (openInNewTab) {
                link.openInNewTab = true;
            }

            const diagnostics = [];
            if (reviewed) {
                diagnostics.push({ code: 'unknown-property', path: [0, 0] });
            }

            expect(result.diagnostics).toEqual(diagnostics);
            expect(result.document?.blocks).toEqual([{ type: 'paragraph', children: [{ text: 'Page', link }] }]);
        },
    );

    it('should review an unknown chosen link flag and not a link conflict when both apply (MIG-13)', () => {
        const result = convertTree([
            {
                type: 'p',
                children: [
                    {
                        type: 'a',
                        url: '/page',
                        target: SAME_TAB_TARGET,
                        chosenLink: { searchResult: { link: '/page' }, openInNewTab: 1 },
                        children: [{ text: 'Page' }],
                    },
                ],
            },
        ]);

        expect(result.diagnostics).toEqual([{ code: 'unknown-property', path: [0, 0] }]);
    });

    it('should report an unsafe chosen link address and not a link conflict when both apply (MIG-13)', () => {
        const result = convertTree([
            {
                type: 'p',
                children: [
                    {
                        type: 'a',
                        url: '/a',
                        chosenLink: { searchResult: { link: 'javascript:x' } },
                        children: [{ text: 'Page' }],
                    },
                ],
            },
        ]);

        expect(result.diagnostics).toEqual([{ code: 'link-unsafe', path: [0, 0] }]);
    });

    it('should report a link conflict when the chosen link address is not a string and keep the url (MIG-13)', () => {
        const result = convertTree([
            {
                type: 'p',
                children: [
                    {
                        type: 'a',
                        url: '/a',
                        target: SAME_TAB_TARGET,
                        chosenLink: { searchResult: { link: 5 } },
                        children: [{ text: 'Page' }],
                    },
                ],
            },
        ]);

        expect(result.diagnostics).toEqual([{ code: 'link-conflict', path: [0, 0] }]);
        expect(result.document?.blocks).toEqual([
            { type: 'paragraph', children: [{ text: 'Page', link: { href: '/a' } }] },
        ]);
    });

    it.each(['x', 1, true])(
        'should read the truthy chosen link %j that is not an object as the display does and review it (MIG-13)',
        (chosenLink) => {
            const result = convertTree([
                {
                    type: 'p',
                    children: [{ type: 'a', url: '/a', target: '_blank', chosenLink, children: [{ text: 'Page' }] }],
                },
            ]);

            expect(result.diagnostics).toEqual([{ code: 'unknown-property', path: [0, 0] }]);
            expect(result.document?.blocks).toEqual([
                { type: 'paragraph', children: [{ text: 'Page', link: { href: '/a' } }] },
            ]);
        },
    );

    it.each([null, 0, '', false])(
        'should ignore the falsy chosen link %j and read url and target (MIG-13)',
        (chosenLink) => {
            const result = convertTree([
                {
                    type: 'p',
                    children: [{ type: 'a', url: '/a', target: '_blank', chosenLink, children: [{ text: 'Page' }] }],
                },
            ]);

            expect(result.outcome).toBe('exact');
            expect(result.document?.blocks).toEqual([
                { type: 'paragraph', children: [{ text: 'Page', link: { href: '/a', openInNewTab: true } }] },
            ]);
        },
    );

    it('should fall back to the url when a chosen link has no search result link (MIG-13)', () => {
        const result = convertTree([
            {
                type: 'p',
                children: [
                    {
                        type: 'a',
                        url: '/fallback',
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

    it('should give every line part of a leaf its own copy of an unknown mark (MIG-13)', () => {
        const result = convertTree([{ type: 'p', children: [{ text: 'a\nb\nc', x: { nested: [1] } }] }]);

        expect(result.outcome).toBe('requires-review');
        const marks = readTextLeafMarks(result.document?.blocks[0], 'x');

        expect(marks).toEqual([{ nested: [1] }, { nested: [1] }, { nested: [1] }]);
        expect(marks[0]).not.toBe(marks[1]);
        expect(readNested(marks[0])).not.toBe(readNested(marks[1]));
    });

    it('should keep a tree of many unknown inline elements with extra keys under the copy limit (MIG-13)', () => {
        const children = Array.from({ length: UNKNOWN_INLINE_COUNT }, (_, index) => ({
            type: 'emoji',
            first: index,
            second: 'two',
            third: [3],
            children: [{ text: '' }],
        }));
        const result = convertTree([{ type: 'p', children }]);

        expect(result.outcome).toBe('requires-review');
        expect(result.diagnostics).toHaveLength(UNKNOWN_INLINE_COUNT);
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
    it.todo('should write start and end back by the first strong character of the block (MIG-14)');
    it.todo('should keep center and justify in either direction (MIG-14)');

    it.each(['left', 'center', 'right', 'justify'])('should map the legacy alignment %s (MIG-14)', (align) => {
        const result = convertTree([{ type: 'p', align, children: [{ text: 'Lorem' }] }]);

        expect(result).toEqual({
            outcome: 'exact',
            document: { version: 1, blocks: [{ type: 'paragraph', align, children: [{ text: 'Lorem' }] }] },
            diagnostics: [],
        });
    });

    it.each([1, null, {}, ['left']])(
        'should report the alignment %j that is not a string and not copy it (MIG-14)',
        (align) => {
            const result = convertTree([
                { type: 'p', align, children: [{ text: 'Lorem' }] },
                { type: 'ul', children: [{ type: 'li', children: [{ type: 'lic', align, children: [] }] }] },
                { type: 'checkbox-item', align, children: [{ text: 'Item' }] },
            ]);

            expect(result.diagnostics).toEqual([
                { code: 'unknown-property', path: [0] },
                { code: 'unknown-property', path: [1, 0, 0] },
                { code: 'unknown-property', path: [2] },
            ]);
            expect(JSON.stringify(result.document)).not.toContain('align');
        },
    );

    it.each(['start', 'end', 'Left', ''])(
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
