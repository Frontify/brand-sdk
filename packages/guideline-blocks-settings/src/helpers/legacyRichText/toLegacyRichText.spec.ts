/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { convertLegacyRichText } from './convertLegacyRichText';
import { toLegacyRichText } from './toLegacyRichText';
import { type ToLegacyRichTextOptions } from './types';

type StoredBlock = { type: string; [property: string]: unknown };

const paragraph = (...children: unknown[]): StoredBlock => ({ type: 'paragraph', children });

const toLegacy = (blocks: StoredBlock[], options?: ToLegacyRichTextOptions) => {
    return toLegacyRichText({ version: 1, blocks }, options);
};

const expectExact = (blocks: StoredBlock[], expected: unknown, options?: ToLegacyRichTextOptions): void => {
    expect(toLegacy(blocks, options)).toEqual({ outcome: 'exact', value: expected, diagnostics: [] });
};

const expectNotReversible = (blocks: StoredBlock[], paths: number[][]): void => {
    expect(toLegacy(blocks)).toEqual({
        outcome: 'not-reversible',
        value: null,
        diagnostics: paths.map((path) => ({ code: 'no-legacy-form', path })),
    });
};

const checkItem = (text: string, ...nested: StoredBlock[]): StoredBlock => ({
    type: 'checkItem',
    children: [paragraph({ text }), ...nested],
});

const checkList = (...items: StoredBlock[]): StoredBlock => ({ type: 'checkList', children: items });

describe('toLegacyRichText blocks', () => {
    it('should write an empty document as an empty tree (MIG-25)', () => {
        expectExact([], []);
    });

    it('should write a paragraph, a text style and a quote with their legacy types (MIG-25)', () => {
        expectExact(
            [
                paragraph({ text: 'Lorem' }),
                { type: 'textStyle', style: 'heading2', children: [{ text: 'Title' }] },
                { type: 'quote', children: [{ text: 'Said' }] },
            ],
            [
                { type: 'p', children: [{ text: 'Lorem' }] },
                { type: 'heading2', children: [{ text: 'Title' }] },
                { type: 'quote', children: [{ text: 'Said' }] },
            ],
        );
    });

    it.each(['left', 'center', 'right', 'justify'])(
        'should write the alignment %s through the reverse lookup (MIG-25)',
        (align) => {
            expectExact(
                [{ type: 'paragraph', align, children: [{ text: 'Lorem' }] }],
                [{ type: 'p', align, children: [{ text: 'Lorem' }] }],
            );
        },
    );

    it.each([
        {
            name: 'a paragraph',
            blocks: [{ type: 'paragraph', align: { url: 'javascript:alert(1)' }, children: [] }],
            path: [0],
        },
        {
            name: 'a text style',
            blocks: [{ type: 'textStyle', style: 'heading1', align: 1, children: [] }],
            path: [0],
        },
        { name: 'a quote', blocks: [{ type: 'quote', align: ['left'], children: [] }], path: [0] },
        {
            name: 'a list item paragraph',
            blocks: [
                {
                    type: 'bulletList',
                    children: [{ type: 'listItem', children: [{ type: 'paragraph', align: null, children: [] }] }],
                },
            ],
            path: [0, 0, 0],
        },
        {
            name: 'a check item paragraph',
            blocks: [checkList({ type: 'checkItem', children: [{ type: 'paragraph', align: true, children: [] }] })],
            path: [0, 0, 0],
        },
    ])('should not write an alignment that is not a string on $name (MIG-25)', ({ blocks, path }) => {
        expectNotReversible(blocks, [path]);
    });

    it('should write an alignment outside the table unchanged (MIG-25)', () => {
        expectExact(
            [{ type: 'paragraph', align: 'start', children: [{ text: 'Lorem' }] }],
            [{ type: 'p', align: 'start', children: [{ text: 'Lorem' }] }],
        );
    });

    it('should write bullet and numbered lists with li and lic and nested lists after the paragraph (MIG-25)', () => {
        expectExact(
            [
                {
                    type: 'bulletList',
                    children: [
                        {
                            type: 'listItem',
                            children: [
                                { type: 'paragraph', align: 'center', children: [{ text: 'One' }] },
                                {
                                    type: 'numberedList',
                                    children: [{ type: 'listItem', children: [paragraph({ text: 'Nested' })] }],
                                },
                            ],
                        },
                    ],
                },
            ],
            [
                {
                    type: 'ul',
                    children: [
                        {
                            type: 'li',
                            children: [
                                { type: 'lic', align: 'center', children: [{ text: 'One' }] },
                                {
                                    type: 'ol',
                                    children: [
                                        { type: 'li', children: [{ type: 'lic', children: [{ text: 'Nested' }] }] },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        );
    });

    it('should flatten a check list depth first into checkbox items with indent, checked and align (MIG-25)', () => {
        const nested = checkList({
            type: 'checkItem',
            checked: true,
            children: [{ type: 'paragraph', align: 'right', children: [{ text: 'Two' }] }],
        });

        expectExact(
            [checkList(checkItem('One', nested, ...[]), checkItem('Three'))],
            [
                { type: 'checkbox-item', children: [{ text: 'One' }] },
                { type: 'checkbox-item', align: 'right', indent: 2, checked: true, children: [{ text: 'Two' }] },
                { type: 'checkbox-item', children: [{ text: 'Three' }] },
            ],
        );
    });

    it('should write a deeper check item indent from its nesting level (MIG-25)', () => {
        const deepest = checkList(checkItem('Three'));
        const middle = checkList(checkItem('Two', deepest));

        expectExact(
            [checkList(checkItem('One', middle))],
            [
                { type: 'checkbox-item', children: [{ text: 'One' }] },
                { type: 'checkbox-item', indent: 2, children: [{ text: 'Two' }] },
                { type: 'checkbox-item', indent: 3, children: [{ text: 'Three' }] },
            ],
        );
    });

    it('should write two check lists apart when another block sits between them (MIG-25)', () => {
        expectExact(
            [checkList(checkItem('One')), paragraph({ text: 'Between' }), checkList(checkItem('Two'))],
            [
                { type: 'checkbox-item', children: [{ text: 'One' }] },
                { type: 'p', children: [{ text: 'Between' }] },
                { type: 'checkbox-item', children: [{ text: 'Two' }] },
            ],
        );
    });
});

describe('toLegacyRichText column breaks', () => {
    const blocks = [
        paragraph({ text: 'One' }),
        { type: 'columnBreak' },
        paragraph({ text: 'Two' }),
        { type: 'columnBreak' },
        paragraph({ text: 'Three' }),
        { type: 'columnBreak' },
        paragraph({ text: 'Four' }),
    ];

    it.each([
        { columns: undefined, values: ['inactive', 'inactive', 'inactive'] },
        { columns: 1, values: ['inactive', 'inactive', 'inactive'] },
        { columns: 2, values: ['active', 'inactive', 'inactive'] },
        { columns: 3, values: ['active', 'active', 'inactive'] },
    ])('should write the column breaks for columns $columns as $values (MIG-25)', ({ columns, values }) => {
        expectExact(
            blocks,
            [
                { type: 'p', breakAfterColumn: values[0], children: [{ text: 'One' }] },
                { type: 'p', breakAfterColumn: values[1], children: [{ text: 'Two' }] },
                { type: 'p', breakAfterColumn: values[2], children: [{ text: 'Three' }] },
                { type: 'p', children: [{ text: 'Four' }] },
            ],
            { columns },
        );
    });

    it('should put the column break on the last checkbox item of a check list (MIG-25)', () => {
        expectExact(
            [
                checkList(checkItem('One', checkList(checkItem('Two')))),
                { type: 'columnBreak' },
                paragraph({ text: 'Next' }),
            ],
            [
                { type: 'checkbox-item', children: [{ text: 'One' }] },
                { type: 'checkbox-item', indent: 2, breakAfterColumn: 'inactive', children: [{ text: 'Two' }] },
                { type: 'p', children: [{ text: 'Next' }] },
            ],
        );
    });

    it('should allow two check lists next to each other when a column break separates them (MIG-25)', () => {
        expectExact(
            [checkList(checkItem('One')), { type: 'columnBreak' }, checkList(checkItem('Two'))],
            [
                { type: 'checkbox-item', breakAfterColumn: 'inactive', children: [{ text: 'One' }] },
                { type: 'checkbox-item', children: [{ text: 'Two' }] },
            ],
        );
    });

    it('should write a column break after a list as a property of the list (MIG-25)', () => {
        expectExact(
            [
                { type: 'bulletList', children: [{ type: 'listItem', children: [paragraph({ text: 'One' })] }] },
                { type: 'columnBreak' },
            ],
            [
                {
                    type: 'ul',
                    breakAfterColumn: 'inactive',
                    children: [{ type: 'li', children: [{ type: 'lic', children: [{ text: 'One' }] }] }],
                },
            ],
        );
    });
});

describe('toLegacyRichText inline content', () => {
    it('should write marks as true in a fixed order, the colour as rgba and no text style (MIG-25)', () => {
        const result = toLegacy([
            paragraph({
                text: 'Lorem',
                superscript: true,
                code: true,
                bold: true,
                fontColor: { color: '#ff000080' },
            }),
        ]);

        expect(result).toEqual({
            outcome: 'exact',
            value: [
                {
                    type: 'p',
                    children: [
                        { text: 'Lorem', bold: true, code: true, superscript: true, color: 'rgba(255, 0, 0, 0.50)' },
                    ],
                },
            ],
            diagnostics: [],
        });
        expect(Object.keys((result.value as { children: object[] }[])[0].children[0])).toEqual([
            'text',
            'bold',
            'code',
            'superscript',
            'color',
        ]);
    });

    it('should write marks the new format does not declare back as leaf keys (MIG-25)', () => {
        expectExact(
            [paragraph({ text: 'Lorem', highlight: 'yellow', textStyle: 'heading9' })],
            [{ type: 'p', children: [{ text: 'Lorem', highlight: 'yellow', textStyle: 'heading9' }] }],
        );
    });

    it('should wrap consecutive leaves with the same link in one anchor with a target (MIG-25)', () => {
        const link = { href: 'https://example.com/a', openInNewTab: true };

        expectExact(
            [
                paragraph(
                    { text: 'Plain ' },
                    { text: 'one ', link },
                    { text: 'two', link, bold: true },
                    { text: ' other', link: { href: '/b' } },
                ),
            ],
            [
                {
                    type: 'p',
                    children: [
                        { text: 'Plain ' },
                        {
                            type: 'a',
                            url: 'https://example.com/a',
                            target: '_blank',
                            children: [{ text: 'one ' }, { text: 'two', bold: true }],
                        },
                        { type: 'a', url: '/b', target: '_self', children: [{ text: ' other' }] },
                    ],
                },
            ],
        );
    });

    it('should write a link with an appearance as a button with its style (MIG-25)', () => {
        expectExact(
            [paragraph({ text: 'Go', link: { href: '/go', appearance: 'tertiary', openInNewTab: true } })],
            [
                {
                    type: 'p',
                    children: [
                        {
                            type: 'button',
                            url: '/go',
                            target: '_blank',
                            buttonStyle: 'tertiary',
                            children: [{ text: 'Go' }],
                        },
                    ],
                },
            ],
        );
    });

    it('should end a link run at a mention and keep the mention outside the link (MIG-25)', () => {
        const link = { href: '/page' };

        expectExact(
            [
                paragraph(
                    { text: 'a', link },
                    { type: 'mention', id: 'user-1', username: '@one', name: 'One' },
                    { text: 'b', link },
                ),
            ],
            [
                {
                    type: 'p',
                    children: [
                        { type: 'a', url: '/page', target: '_self', children: [{ text: 'a' }] },
                        { type: 'mention', category: 'user', id: 'user-1', children: [{ text: '' }] },
                        { type: 'a', url: '/page', target: '_self', children: [{ text: 'b' }] },
                    ],
                },
            ],
        );
    });

    it('should append a break as a line feed to the preceding leaf that has no link and keep its marks (MIG-25)', () => {
        expectExact(
            [paragraph({ text: 'a', bold: true }, { type: 'break' }, { text: 'b' })],
            [{ type: 'p', children: [{ text: 'a\n', bold: true }, { text: 'b' }] }],
        );
    });

    it('should write a break after a linked leaf as a mark-less leaf outside the link (MIG-25)', () => {
        expectExact(
            [
                paragraph(
                    { text: 'a', link: { href: '/page' } },
                    { type: 'break' },
                    { text: 'Go', link: { href: '/go', appearance: 'primary' } },
                    { type: 'break' },
                    { text: 'b' },
                ),
            ],
            [
                {
                    type: 'p',
                    children: [
                        { type: 'a', url: '/page', target: '_self', children: [{ text: 'a' }] },
                        { text: '\n' },
                        {
                            type: 'button',
                            url: '/go',
                            target: '_self',
                            buttonStyle: 'primary',
                            children: [{ text: 'Go' }],
                        },
                        { text: '\nb' },
                    ],
                },
            ],
        );
    });

    it('should write a break at the start of a block or after a mention as a mark-less leaf (MIG-25)', () => {
        expectExact(
            [
                paragraph({ type: 'break' }, { text: 'a', bold: true }),
                paragraph({ type: 'mention', id: 'user-1', username: '', name: '' }, { type: 'break' }, { text: 'b' }),
            ],
            [
                { type: 'p', children: [{ text: '\n' }, { text: 'a', bold: true }] },
                {
                    type: 'p',
                    children: [
                        { type: 'mention', category: 'user', id: 'user-1', children: [{ text: '' }] },
                        { text: '\nb' },
                    ],
                },
            ],
        );
    });

    it('should join adjacent leaves with the same marks around a break (MIG-25)', () => {
        expectExact(
            [paragraph({ text: 'a' }, { type: 'break' }, { type: 'break' }, { text: 'b' })],
            [{ type: 'p', children: [{ text: 'a\n\nb' }] }],
        );
    });

    it('should drop empty leaves and give an element without children an empty leaf (MIG-25)', () => {
        expectExact(
            [paragraph({ text: '' }), paragraph(), paragraph({ text: 'a' }, { text: '' })],
            [
                { type: 'p', children: [{ text: '' }] },
                { type: 'p', children: [{ text: '' }] },
                { type: 'p', children: [{ text: 'a' }] },
            ],
        );
    });

    it.each([
        { kind: undefined, category: 'user' },
        { kind: 'user', category: 'user' },
        { kind: 'group', category: 'group' },
        { kind: 'all', category: 'all' },
    ])(
        'should write a mention of kind $kind with the category $category and no snapshot (MIG-25)',
        ({ kind, category }) => {
            expectExact(
                [paragraph({ type: 'mention', id: 'user-1', username: '@one', name: 'One', kind })],
                [
                    {
                        type: 'p',
                        children: [{ type: 'mention', category, id: 'user-1', children: [{ text: '' }] }],
                    },
                ],
            );
        },
    );
});

describe('toLegacyRichText content kept as stored', () => {
    it('should write unknown blocks and unknown inlines back whole in their stored key order (MIG-25)', () => {
        const unknownBlock = { type: 'emoji', name: 'smile', children: [{ text: '' }] };
        const unknownInline = { type: 'link', url: '/page', children: [{ text: 'Page' }] };
        const result = toLegacy([unknownBlock, paragraph(unknownInline)]);

        expect(result).toEqual({
            outcome: 'exact',
            value: [unknownBlock, { type: 'p', children: [unknownInline] }],
            diagnostics: [],
        });
        expect(JSON.stringify(result.value)).toBe(
            JSON.stringify([unknownBlock, { type: 'p', children: [unknownInline] }]),
        );
    });

    it.each([
        { name: 'without a username', mention: { type: 'mention', id: 'u1', kind: 'group', children: [{ text: '' }] } },
        {
            name: 'in the legacy shape',
            mention: { type: 'mention', category: 'group', id: 7, children: [{ text: '' }] },
        },
        { name: 'with a numeric id', mention: { type: 'mention', id: 7, username: 'a', name: 'b' } },
    ])('should not write a mention $name because convert never keeps one whole (MIG-25)', ({ mention }) => {
        expectNotReversible([paragraph(mention)], [[0, 0]]);
    });

    it.each([
        { name: 'children that are not nodes', node: { type: 'foo', children: [null, 5] } },
        {
            name: 'a nested child without type and children',
            node: { type: 'foo', children: [{ type: 'bar', children: [{}] }] },
        },
        { name: 'a nested child whose text is not a string', node: { type: 'foo', children: [{ text: 5 }] } },
    ])('should not write a node with $name whole (MIG-25)', ({ node }) => {
        expectNotReversible([node, paragraph(node)], [[0], [1, 0]]);
    });

    it('should write a nested legacy-shaped node whole back as stored (MIG-25)', () => {
        const node = { type: 'foo', children: [{ type: 'bar', children: [{ text: 'x' }, { text: '' }] }] };

        expectExact([node, paragraph(node)], [node, { type: 'p', children: [node] }]);
    });

    it('should write undeclared keys of known blocks back after the declared keys and before children (MIG-25)', () => {
        const result = toLegacy([{ type: 'paragraph', lineHeight: 2, align: 'center', children: [{ text: 'a' }] }]);

        expect(JSON.stringify(result.value)).toBe(
            '[{"type":"p","align":"center","lineHeight":2,"children":[{"text":"a"}]}]',
        );
    });

    it('should keep a __proto__ key of a block as plain data (MIG-25)', () => {
        const block: StoredBlock = { type: 'paragraph' };
        Object.defineProperty(block, '__proto__', { value: { polluted: true }, enumerable: true });
        block.children = [{ text: 'a' }];
        const result = toLegacy([block]);

        expect(result.outcome).toBe('exact');
        expect(Object.keys(result.value?.[0] ?? {})).toEqual(['type', '__proto__', 'children']);
        expect(Reflect.get({}, 'polluted')).toBeUndefined();
    });
});

describe('toLegacyRichText content without a legacy form', () => {
    it.each(['table', 'tableRow', 'tableCell', 'tableHeader'])('should not reverse a %s block (MIG-25)', (type) => {
        expectNotReversible([{ type, children: [] }], [[0]]);
    });

    it('should not reverse a numbered list with a start and still collect its other findings (MIG-25)', () => {
        expectNotReversible(
            [
                {
                    type: 'numberedList',
                    start: 3,
                    children: [{ type: 'listItem', children: [{ type: 'table', children: [] }] }],
                },
            ],
            [[0], [0, 0, 0]],
        );
    });

    it.each([
        { name: 'an empty bullet list', block: { type: 'bulletList', children: [] } },
        { name: 'an empty numbered list', block: { type: 'numberedList', children: [] } },
        { name: 'an empty list item', block: { type: 'bulletList', children: [{ type: 'listItem', children: [] }] } },
        { name: 'an empty check list', block: checkList() },
    ])('should not reverse $name (MIG-25)', ({ block }) => {
        expect(toLegacy([block]).outcome).toBe('not-reversible');
    });

    it('should report the path of an empty list item inside a list (MIG-25)', () => {
        expectNotReversible([{ type: 'bulletList', children: [{ type: 'listItem', children: [] }] }], [[0, 0]]);
    });

    it('should not reverse a check item without a paragraph first or with extra children (MIG-25)', () => {
        expectNotReversible(
            [
                checkList(
                    { type: 'checkItem', children: [] },
                    { type: 'checkItem', children: [{ type: 'quote', children: [] }] },
                    { type: 'checkItem', children: [paragraph(), paragraph()] },
                    { type: 'checkItem', children: [paragraph(), paragraph()], checked: true },
                ),
            ],
            [
                [0, 0],
                [0, 1],
                [0, 2],
                [0, 3],
            ],
        );
    });

    it.each(['inProgress', 'maybe', null])('should not reverse a check item checked as %j (MIG-25)', (checked) => {
        expectNotReversible([checkList({ type: 'checkItem', checked, children: [paragraph()] })], [[0, 0]]);
    });

    it('should not reverse a check list inside a list item or a text block (MIG-25)', () => {
        expectNotReversible(
            [
                { type: 'bulletList', children: [{ type: 'listItem', children: [checkList(checkItem('One'))] }] },
                { type: 'paragraph', children: [checkList(checkItem('One'))] },
            ],
            [
                [0, 0, 0],
                [1, 0],
            ],
        );
    });

    it('should not reverse a check list that follows another check list directly (MIG-25)', () => {
        expectNotReversible([checkList(checkItem('One')), checkList(checkItem('Two'))], [[1]]);
    });

    it('should not reverse a text style or a quote inside a list item (MIG-25)', () => {
        expectNotReversible(
            [
                {
                    type: 'bulletList',
                    children: [
                        {
                            type: 'listItem',
                            children: [
                                { type: 'quote', children: [] },
                                { type: 'textStyle', style: 'heading1', children: [] },
                            ],
                        },
                    ],
                },
            ],
            [
                [0, 0, 0],
                [0, 0, 1],
            ],
        );
    });

    it.each([
        { name: 'first', blocks: [{ type: 'columnBreak' }, paragraph()], paths: [[0]] },
        {
            name: 'after another column break',
            blocks: [paragraph(), { type: 'columnBreak' }, { type: 'columnBreak' }],
            paths: [[2]],
        },
        {
            name: 'inside a list item',
            blocks: [{ type: 'bulletList', children: [{ type: 'listItem', children: [{ type: 'columnBreak' }] }] }],
            paths: [[0, 0, 0]],
        },
        { name: 'with a key of its own', blocks: [paragraph(), { type: 'columnBreak', note: 'x' }], paths: [[1]] },
    ])('should not reverse a column break that is $name (MIG-25)', ({ blocks, paths }) => {
        expectNotReversible(blocks, paths);
    });

    it.each([
        { name: 'a colour tinycolor cannot read', leaf: { text: 'a', fontColor: { color: 'not a colour' } } },
        { name: 'a font colour without a colour', leaf: { text: 'a', fontColor: {} } },
        { name: 'both subscript and superscript', leaf: { text: 'a', subscript: true, superscript: true } },
        { name: 'a mark with a value other than true', leaf: { text: 'a', bold: false } },
        { name: 'a link without an href', leaf: { text: 'a', link: {} } },
        { name: 'a link with a key of its own', leaf: { text: 'a', link: { href: '/a', rel: 'x' } } },
        { name: 'a link with an unknown appearance', leaf: { text: 'a', link: { href: '/a', appearance: 'ghost' } } },
        { name: 'text that is not a string', leaf: { text: 5 } },
        { name: 'a leaf without text', leaf: {} },
    ])('should not reverse a leaf with $name (MIG-25)', ({ leaf }) => {
        expectNotReversible([paragraph(leaf)], [[0, 0]]);
    });

    it.each([
        { name: 'an unknown kind', node: { type: 'mention', id: 'user-1', username: '', name: '', kind: 'team' } },
        { name: 'a key of its own', node: { type: 'mention', id: 'user-1', username: '', name: '', extra: 1 } },
        { name: 'a key on a break', node: { type: 'break', extra: 1 } },
        { name: 'a known block type in an inline position', node: { type: 'paragraph', children: [] } },
        { name: 'an unknown inline without children', node: { type: 'emoji' } },
    ])('should not reverse an inline with $name (MIG-25)', ({ node }) => {
        expectNotReversible([paragraph(node)], [[0, 0]]);
    });

    it.each([
        { name: 'a style the format does not have', block: { type: 'textStyle', style: 'heading9', children: [] } },
        { name: 'a style that is not text', block: { type: 'textStyle', style: 1, children: [] } },
        { name: 'children that are not a list', block: { type: 'paragraph', children: 'text' } },
        { name: 'no children', block: { type: 'paragraph' } },
        { name: 'an unknown type without children', block: { type: 'emoji' } },
    ])('should not reverse a block with $name (MIG-25)', ({ block }) => {
        expectNotReversible([block], [[0]]);
    });

    it('should report each document key other than version and blocks at the root (MIG-25)', () => {
        const document = { version: 1 as const, blocks: [paragraph({ text: 'a' })], title: 'Lorem', locale: 'en' };

        expect(toLegacyRichText(document)).toEqual({
            outcome: 'not-reversible',
            value: null,
            diagnostics: [
                { code: 'no-legacy-form', path: [] },
                { code: 'no-legacy-form', path: [] },
            ],
        });
    });

    it.each([{ blocks: [] }, { version: 2, blocks: [] }, { version: '1', blocks: [] }, { version: null, blocks: [] }])(
        'should not reverse the document %j whose version is not 1 (MIG-25)',
        (document) => {
            const result: unknown = Reflect.apply(toLegacyRichText, undefined, [document]);

            expect(result).toEqual({
                outcome: 'not-reversible',
                value: null,
                diagnostics: [{ code: 'no-legacy-form', path: [] }],
            });
        },
    );

    it('should write a list item with an empty paragraph as a list item with an empty paragraph leaf (MIG-25)', () => {
        expectExact(
            [{ type: 'bulletList', children: [{ type: 'listItem', children: [paragraph()] }] }],
            [{ type: 'ul', children: [{ type: 'li', children: [{ type: 'lic', children: [{ text: '' }] }] }] }],
        );
    });

    it.each([
        { name: 'an anchor with an unsafe url', node: { type: 'a', url: 'javascript:alert(1)', children: [] } },
        { name: 'a button without a url', node: { type: 'button', children: [] } },
        {
            name: 'an anchor whose chosen link has an unsafe address',
            node: {
                type: 'a',
                url: '/page',
                chosenLink: { searchResult: { link: 'javascript:alert(1)' } },
                children: [],
            },
        },
    ])('should not write $name whole as a legacy link (MIG-25)', ({ node }) => {
        expectNotReversible([paragraph(node), node], [[0, 0], [1]]);
    });

    it.each([
        {
            name: 'an unknown block holding an anchor with an unsafe url',
            node: { type: 'callout', children: [{ type: 'a', url: 'javascript:alert(1)', children: [] }] },
        },
        {
            name: 'a safe anchor holding a nested button with an unsafe url',
            node: {
                type: 'a',
                url: '/page',
                children: [{ text: 'x' }, { type: 'button', url: 'data:text/html,x', children: [] }],
            },
        },
        {
            name: 'an unknown block whose property holds a link with an unsafe chosen link',
            node: {
                type: 'callout',
                children: [],
                extra: [
                    { type: 'a', url: '/page', chosenLink: { searchResult: { link: 'vbscript:x' } }, children: [] },
                ],
            },
        },
    ])('should not write $name whole (MIG-25)', ({ node }) => {
        expectNotReversible([paragraph(node), node], [[0, 0], [1]]);
    });

    it.each([['javascript:alert(1)'], 5, {}, null, true])(
        'should not write an anchor whole whose chosen link address %j is not a string (MIG-25)',
        (link) => {
            const node = {
                type: 'a',
                url: '/page',
                chosenLink: { searchResult: { link } },
                children: [],
            };

            expectNotReversible([paragraph(node)], [[0, 0]]);
        },
    );

    it.each([
        {
            name: 'a text leaf link in an unknown block',
            blocks: [{ type: 'callout', children: [{ text: 'x', link: { href: 'javascript:alert(1)' } }] }],
            path: [0],
        },
        {
            name: 'an undeclared value on a paragraph',
            blocks: [{ type: 'paragraph', extra: { type: 'a', url: 'javascript:alert(1)' }, children: [] }],
            path: [0],
        },
        {
            name: 'an undeclared value holding an href on a list',
            blocks: [
                {
                    type: 'bulletList',
                    extra: [{ href: 'vbscript:x' }],
                    children: [{ type: 'listItem', children: [paragraph()] }],
                },
            ],
            path: [0],
        },
        {
            name: 'an undeclared value on a list item',
            blocks: [
                {
                    type: 'bulletList',
                    children: [{ type: 'listItem', extra: { url: 'data:text/html,x' }, children: [paragraph()] }],
                },
            ],
            path: [0, 0],
        },
        {
            name: 'an undeclared value on a check item',
            blocks: [checkList({ type: 'checkItem', extra: { href: 'javascript:x' }, children: [paragraph()] })],
            path: [0, 0],
        },
        {
            name: 'an unknown mark value on a leaf',
            blocks: [paragraph({ text: 'a', extra: { href: 'javascript:x' } })],
            path: [0, 0],
        },
        {
            name: 'a chosen link that is not a string in an undeclared value',
            blocks: [{ type: 'paragraph', extra: { chosenLink: { searchResult: { link: ['x'] } } }, children: [] }],
            path: [0],
        },
    ])('should not write $name that holds an unsafe address (MIG-25)', ({ blocks, path }) => {
        expectNotReversible(blocks, [path]);
    });

    it.each([
        {
            name: 'a paragraph',
            build: (entry: object): StoredBlock[] => [{ type: 'paragraph', ...entry, children: [] }],
            path: [0],
        },
        {
            name: 'a leaf',
            build: (entry: object): StoredBlock[] => [paragraph({ text: 'a', ...entry })],
            path: [0, 0],
        },
        {
            name: 'a list',
            build: (entry: object): StoredBlock[] => [
                { type: 'bulletList', ...entry, children: [{ type: 'listItem', children: [paragraph()] }] },
            ],
            path: [0],
        },
        {
            name: 'a list item',
            build: (entry: object): StoredBlock[] => [
                { type: 'bulletList', children: [{ type: 'listItem', ...entry, children: [paragraph()] }] },
            ],
            path: [0, 0],
        },
        {
            name: 'a check item',
            build: (entry: object): StoredBlock[] => [
                checkList({ type: 'checkItem', ...entry, children: [paragraph()] }),
            ],
            path: [0, 0],
        },
    ])('should not write $name whose own undeclared address is unsafe (MIG-25)', ({ build, path }) => {
        for (const entry of [
            { url: 'javascript:alert(1)' },
            { href: 'javascript:alert(1)' },
            { chosenLink: { searchResult: { link: 'javascript:alert(1)' } } },
        ]) {
            expectNotReversible(build(entry), [path]);
        }
    });

    it('should write undeclared values with safe addresses back as stored (MIG-25)', () => {
        const extra = {
            href: 'https://example.com',
            url: '/page',
            empty: '',
            chosenLink: { searchResult: { link: '/a' } },
        };

        expectExact(
            [{ type: 'paragraph', extra, children: [{ text: 'a', other: extra }] }],
            [{ type: 'p', extra, children: [{ text: 'a', other: extra }] }],
        );
    });

    it('should write an unknown block holding safe links and other nested objects back as stored (MIG-25)', () => {
        const node = {
            type: 'callout',
            children: [{ type: 'a', url: 'https://example.com', children: [{ text: 'x' }] }],
            meta: { type: 'note', items: [1, { type: 'a', url: '/page' }] },
        };

        expectExact([node], [node]);
    });

    it('should write a whole anchor with safe addresses back as stored (MIG-25)', () => {
        const node = {
            type: 'a',
            url: '/page',
            rel: 'nofollow',
            chosenLink: { searchResult: { link: 'https://example.com/a' }, other: 1 },
            children: [{ text: 'Page' }],
        };

        expectExact([paragraph(node)], [{ type: 'p', children: [node] }]);
    });

    it('should not reverse a leaf whose text holds a line feed (MIG-25)', () => {
        expectNotReversible([paragraph({ text: 'a\nb' })], [[0, 0]]);
    });

    it('should not reverse a font colour with a key other than color (MIG-25)', () => {
        expectNotReversible([paragraph({ text: 'a', fontColor: { color: '#ff0000', opacity: 0.5 } })], [[0, 0]]);
    });

    it.each([
        {
            name: 'an undeclared indent on a check item nested a level down',
            blocks: [checkList(checkItem('One', checkList({ type: 'checkItem', indent: 5, children: [paragraph()] })))],
            path: [0, 0, 1, 0],
        },
        {
            name: 'an undeclared breakAfterColumn on a block followed by a column break',
            blocks: [{ type: 'paragraph', breakAfterColumn: 'active', children: [] }, { type: 'columnBreak' }],
            path: [0],
        },
        {
            name: 'an undeclared breakAfterColumn on an unknown block followed by a column break',
            blocks: [{ type: 'emoji', breakAfterColumn: 'active', children: [] }, { type: 'columnBreak' }],
            path: [0],
        },
        {
            name: 'an undeclared text on a block',
            blocks: [{ type: 'paragraph', text: 'x', children: [] }],
            path: [0],
        },
        {
            name: 'an undeclared color beside a font colour',
            blocks: [paragraph({ text: 'a', fontColor: { color: '#ff0000' }, color: 'blue' })],
            path: [0, 0],
        },
        {
            name: 'an undeclared children on a leaf',
            blocks: [paragraph({ text: 'a', children: [] })],
            path: [0, 0],
        },
        {
            name: 'an undeclared breakAfterColumn on a list followed by a column break',
            blocks: [
                {
                    type: 'bulletList',
                    breakAfterColumn: 'x',
                    children: [{ type: 'listItem', children: [paragraph()] }],
                },
                { type: 'columnBreak' },
            ],
            path: [0],
        },
    ])('should not reverse $name that clashes with a key the writer sets (MIG-25)', ({ blocks, path }) => {
        expectNotReversible(blocks, [path]);
    });

    it.each([
        {
            name: 'an undeclared indent on a check item at level one',
            blocks: [checkList({ type: 'checkItem', indent: 3, children: [paragraph()] })],
            path: [0, 0],
        },
        {
            name: 'an undeclared breakAfterColumn on a block with no column break after it',
            blocks: [{ type: 'paragraph', breakAfterColumn: 'active', children: [] }],
            path: [0],
        },
        {
            name: 'an undeclared color on a leaf without a font colour',
            blocks: [paragraph({ text: 'a', color: 'blue' })],
            path: [0, 0],
        },
        {
            name: 'an undeclared align on a check item',
            blocks: [checkList({ type: 'checkItem', align: 'start', children: [paragraph()] })],
            path: [0, 0],
        },
    ])('should not reverse $name because the legacy editor gives that key a meaning (MIG-25)', ({ blocks, path }) => {
        expectNotReversible(blocks, [path]);
    });

    it.each([
        { name: 'one that the check item also has', paragraph: { type: 'paragraph', note: 'x', children: [] } },
        { name: 'one that only the paragraph has', paragraph: { type: 'paragraph', checked: true, children: [] } },
    ])('should not reverse a check item whose paragraph has an undeclared key, $name (MIG-25)', ({ paragraph }) => {
        expectNotReversible(
            [checkList({ type: 'checkItem', note: 'y', checked: true, children: [paragraph] })],
            [[0, 0, 0]],
        );
    });

    it('should still write the undeclared keys of the check item itself (MIG-25)', () => {
        expectExact(
            [checkList({ type: 'checkItem', note: 'y', children: [paragraph()] })],
            [{ type: 'checkbox-item', note: 'y', children: [{ text: '' }] }],
        );
    });

    it.each(['emoji', 'mention'])('should not reverse an unknown %s node with a text key (MIG-25)', (type) => {
        expectNotReversible(
            [{ type: 'unknownBlock', text: 'x', children: [] }, paragraph({ type, text: 'x', children: [] })],
            [[0], [1, 0]],
        );
    });

    it('should still write undeclared keys the legacy editor gives no meaning on that node (MIG-25)', () => {
        expectExact(
            [
                {
                    type: 'bulletList',
                    align: 'start',
                    children: [{ type: 'listItem', children: [paragraph({ text: 'a', textStyle: 'heading9' })] }],
                },
                { type: 'paragraph', indent: 5, children: [] },
            ],
            [
                {
                    type: 'ul',
                    align: 'start',
                    children: [
                        {
                            type: 'li',
                            children: [{ type: 'lic', children: [{ text: 'a', textStyle: 'heading9' }] }],
                        },
                    ],
                },
                { type: 'p', indent: 5, children: [{ text: '' }] },
            ],
        );
    });

    it('should collect every offending path and return no partial tree (MIG-25)', () => {
        expectNotReversible(
            [
                paragraph({ text: 'fine' }),
                { type: 'table', children: [] },
                { type: 'columnBreak' },
                { type: 'columnBreak' },
            ],
            [[1], [3]],
        );
    });
});

describe('toLegacyRichText links', () => {
    it.each([
        { openInNewTab: true, target: '_blank' },
        { openInNewTab: undefined, target: '_self' },
    ])('should write the target $target for openInNewTab $openInNewTab (MIG-25)', ({ openInNewTab, target }) => {
        expectExact(
            [paragraph({ text: 'a', link: { href: '/page', openInNewTab } })],
            [{ type: 'p', children: [{ type: 'a', url: '/page', target, children: [{ text: 'a' }] }] }],
        );
    });

    it('should keep a same-tab button same-tab through a round trip (MIG-60)', () => {
        const legacy = JSON.stringify([
            {
                type: 'p',
                children: [
                    {
                        type: 'button',
                        url: '/page',
                        target: '_self',
                        buttonStyle: 'secondary',
                        children: [{ text: 'Go' }],
                    },
                ],
            },
        ]);
        const converted = convertLegacyRichText(legacy);

        expect(converted.outcome).toBe('exact');
        const written = toLegacyRichText(converted.document ?? { version: 1, blocks: [] });

        const expected: unknown = JSON.parse(legacy);
        expect(written).toEqual({ outcome: 'exact', value: expected, diagnostics: [] });
    });

    it('should write a button without a target as a new-tab button (MIG-60)', () => {
        const converted = convertLegacyRichText(
            JSON.stringify([{ type: 'p', children: [{ type: 'button', url: '/page', children: [{ text: 'Go' }] }] }]),
        );
        const written = toLegacyRichText(converted.document ?? { version: 1, blocks: [] });

        expect(written.value).toEqual([
            {
                type: 'p',
                children: [
                    {
                        type: 'button',
                        url: '/page',
                        target: '_blank',
                        buttonStyle: 'primary',
                        children: [{ text: 'Go' }],
                    },
                ],
            },
        ]);
    });
});

describe('toLegacyRichText determinism', () => {
    it('should give identical output for the same document on every run (MIG-26)', () => {
        const document = {
            version: 1 as const,
            blocks: [paragraph({ text: 'a', bold: true }, { type: 'break' }, { text: 'b' })],
        };

        expect(JSON.stringify(toLegacyRichText(document))).toBe(JSON.stringify(toLegacyRichText(document)));
    });
});
