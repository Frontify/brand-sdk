/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it, vi } from 'vitest';

import { toLegacyPlainText } from './toLegacyPlainText';
import { type MentionText, type ToLegacyPlainTextResult } from './types';

const BYTES_PER_MEBIBYTE = 1024 * 1024;
const OVER_LIMIT_MEBIBYTES = 6;
const NESTING_DEPTH = 70;
const NESTING_FAR_OVER_LIMIT = 100_000;
const NESTED_OPEN = '{"type":"p","children":[';
const NESTED_CLOSE = ']}';
const NODES_OVER_LIMIT = 50_001;
const SLOW_TEST_TIMEOUT_MS = 30_000;

const mentionText: MentionText = (kind, id) => `${kind ?? 'person'}:${id}`;

const read = (tree: unknown): ToLegacyPlainTextResult => {
    return toLegacyPlainText(JSON.stringify(tree), { mentionText });
};

const text = (value: string): ToLegacyPlainTextResult => {
    return { status: 'text', text: value };
};

const NO_LEGACY_TREE: ToLegacyPlainTextResult = { status: 'no-legacy-tree' };

describe('toLegacyPlainText', () => {
    it.each([
        { name: 'null', value: null },
        { name: 'undefined', value: undefined },
        { name: 'an empty string', value: '' },
        { name: 'the string null', value: 'null' },
        { name: 'a line break tag', value: '<br />' },
        { name: 'JSON null with spaces', value: ' null ' },
    ])('should read $name as empty text (MIG-16)', ({ value }) => {
        expect(toLegacyPlainText(value, { mentionText })).toEqual(text(''));
    });

    it('should read an empty array as empty text (MIG-16)', () => {
        expect(read([])).toEqual(text(''));
    });

    it.each([
        { name: 'HTML', value: '<p>Lorem</p>' },
        { name: 'plain text', value: 'Lorem' },
        { name: 'a JSON object', value: '{"type":"p","children":[{"text":"Lorem"}]}' },
        { name: 'a JSON number', value: '42' },
        { name: 'a JSON string', value: '"Lorem"' },
    ])('should report no legacy tree for $name (MIG-16)', ({ value }) => {
        expect(toLegacyPlainText(value, { mentionText })).toEqual(NO_LEGACY_TREE);
    });

    it('should read one line from the paragraph holding text leaves (MIG-16)', () => {
        expect(read([{ type: 'p', children: [{ text: 'Lorem ' }, { text: 'ipsum', bold: true }] }])).toEqual(
            text('Lorem ipsum'),
        );
    });

    it('should join the lines of several blocks with a line break (MIG-16)', () => {
        expect(
            read([
                { type: 'p', children: [{ text: 'Lorem' }] },
                { type: 'quote', children: [{ text: 'ipsum' }] },
            ]),
        ).toEqual(text('Lorem\nipsum'));
    });

    it('should read the text leaves of the root array as lines (MIG-16)', () => {
        expect(read([{ text: 'Lorem' }, { text: ' ipsum' }, { type: 'p', children: [{ text: 'dolor' }] }])).toEqual(
            text('Lorem ipsum\ndolor'),
        );
    });

    it('should read an empty paragraph as an empty line (MIG-16)', () => {
        expect(
            read([
                { type: 'p', children: [{ text: 'Lorem' }] },
                { type: 'p', children: [{ text: '' }] },
                { type: 'p', children: [{ text: 'ipsum' }] },
            ]),
        ).toEqual(text('Lorem\n\nipsum'));
    });

    it('should give no line for a block without children (MIG-16)', () => {
        expect(
            read([
                { type: 'p', children: [{ text: 'Lorem' }] },
                { type: 'p', children: [] },
                { type: 'p', children: [{ text: 'ipsum' }] },
            ]),
        ).toEqual(text('Lorem\nipsum'));
    });

    it('should read the lines of a nested list in order without a line for the list item (MIG-16)', () => {
        const tree = [
            {
                type: 'ul',
                children: [
                    {
                        type: 'li',
                        children: [
                            { type: 'lic', children: [{ text: 'one' }] },
                            {
                                type: 'ul',
                                children: [{ type: 'li', children: [{ type: 'lic', children: [{ text: 'nested' }] }] }],
                            },
                        ],
                    },
                    { type: 'li', children: [{ type: 'lic', children: [{ text: 'two' }] }] },
                ],
            },
        ];

        expect(read(tree)).toEqual(text('one\nnested\ntwo'));
    });

    it('should start a new line for the inline content after a child block (MIG-16)', () => {
        const tree = [
            { type: 'p', children: [{ text: 'before' }, { type: 'ul', children: [] }, { text: 'after' }] },
            { type: 'p', children: [{ text: 'next' }] },
        ];

        expect(read(tree)).toEqual(text('before\nafter\nnext'));
    });

    it('should read an unknown element type as a block (MIG-16)', () => {
        expect(
            read([
                { type: 'p', children: [{ text: 'Lorem' }] },
                { type: 'callout', children: [{ text: 'ipsum' }] },
            ]),
        ).toEqual(text('Lorem\nipsum'));
    });

    it('should read a reserved new-format element type as a block (MIG-16)', () => {
        expect(
            read([
                { type: 'paragraph', children: [{ text: 'Lorem' }] },
                { type: 'bulletList', children: [{ text: 'ipsum' }] },
            ]),
        ).toEqual(text('Lorem\nipsum'));
    });

    it('should keep a line break inside a text leaf (MIG-16)', () => {
        expect(read([{ type: 'p', children: [{ text: 'Lorem\nipsum' }] }])).toEqual(text('Lorem\nipsum'));
    });

    it('should read no marks, list markers, alignment or link urls (MIG-16)', () => {
        const tree = [
            { type: 'p', align: 'center', children: [{ text: 'Lorem', bold: true, color: '#ff0000' }] },
            {
                type: 'ol',
                children: [{ type: 'li', children: [{ type: 'lic', children: [{ text: 'item' }] }] }],
            },
            { type: 'p', children: [{ type: 'a', url: 'https://example.com', children: [{ text: 'link' }] }] },
        ];

        expect(read(tree)).toEqual(text('Lorem\nitem\nlink'));
    });

    it.each(['a', 'link', 'button', 'emoji'])(
        'should read the children of a %s element in its line (MIG-16)',
        (type) => {
            const tree = [
                {
                    type: 'p',
                    children: [{ text: 'before ' }, { type, children: [{ text: 'inside' }] }, { text: ' after' }],
                },
            ];

            expect(read(tree)).toEqual(text('before inside after'));
        },
    );

    it('should descend into the children of nested inline elements in order (MIG-16)', () => {
        const tree = [
            {
                type: 'p',
                children: [
                    { text: '1 ' },
                    {
                        type: 'a',
                        children: [{ text: '2 ' }, { type: 'button', children: [{ text: '3' }] }, { text: ' 4' }],
                    },
                    { text: ' 5' },
                ],
            },
        ];

        expect(read(tree)).toEqual(text('1 2 3 4 5'));
    });

    it.each([
        { name: 'person', category: 'user', expected: 'person:7' },
        { name: 'group', category: 'group', expected: 'group:7' },
        { name: 'all', category: 'all', expected: 'all:7' },
    ])('should read a $name mention through mentionText (MIG-16)', ({ category, expected }) => {
        const tree = [
            {
                type: 'p',
                children: [
                    { text: 'Hi ' },
                    { type: 'mention', category, id: 7, value: 'Ignored', children: [{ text: 'Child' }] },
                ],
            },
        ];

        expect(read(tree)).toEqual(text(`Hi ${expected}`));
    });

    it('should pass the id of a mention as a string (MIG-16)', () => {
        const received = vi.fn<MentionText>(() => '@');

        toLegacyPlainText(JSON.stringify([{ type: 'mention', category: 'user', id: 7, children: [{ text: '' }] }]), {
            mentionText: received,
        });

        expect(received).toHaveBeenCalledExactlyOnceWith(undefined, '7');
    });

    it.each([
        { name: 'an unknown category', node: { category: 'team', id: 7 } },
        { name: 'no category', node: { id: 7 } },
        { name: 'no id', node: { category: 'user' } },
        { name: 'an id that is not a string or number', node: { category: 'user', id: { nested: true } } },
    ])('should read the children of a mention with $name like any inline element (MIG-16)', ({ node }) => {
        const tree = [{ type: 'p', children: [{ type: 'mention', ...node, children: [{ text: 'Child' }] }] }];

        expect(read(tree)).toEqual(text('Child'));
    });

    it('should skip nodes that are neither a text nor an element (MIG-16)', () => {
        const tree = [
            null,
            42,
            'Lorem',
            [{ text: 'nested array' }],
            { type: 'p', children: 'ipsum' },
            { type: 'p' },
            { text: 7 },
            {
                type: 'p',
                children: [{ text: 'kept' }, null, true, { type: 7, children: [{ text: 'skipped' }] }],
            },
        ];

        expect(read(tree)).toEqual(text('kept'));
    });

    it(
        'should read an array over 5 MiB that the converter refuses (MIG-16)',
        () => {
            const longText = 'a'.repeat(OVER_LIMIT_MEBIBYTES * BYTES_PER_MEBIBYTE);

            expect(read([{ type: 'p', children: [{ text: longText }] }])).toEqual(text(longText));
        },
        SLOW_TEST_TIMEOUT_MS,
    );

    it('should read past the depth limit of the converter (MIG-16)', () => {
        let nested: unknown = { text: 'deep' };
        for (let level = 0; level < NESTING_DEPTH; level++) {
            nested = { type: 'p', children: [nested] };
        }

        expect(read([nested])).toEqual(text('deep'));
    });

    it('should read 100,000 nesting levels, which proves no depth cap and no recursion (MIG-16)', () => {
        const nested = `[${NESTED_OPEN.repeat(NESTING_FAR_OVER_LIMIT)}{"text":"x"}${NESTED_CLOSE.repeat(NESTING_FAR_OVER_LIMIT)}]`;

        expect(toLegacyPlainText(nested, { mentionText })).toEqual(text('x'));
    });

    it('should read a node with both text and children as a text leaf (MIG-16)', () => {
        expect(read([{ type: 'p', text: 'x', children: [{ text: 'y' }] }])).toEqual(text('x'));
    });

    it('should read prototype property names as plain names (MIG-16)', () => {
        const value =
            '[{"type":"__proto__","children":[{"text":"a"}]},{"type":"mention","category":"__proto__","id":1,"children":[{"text":"b"}]}]';

        expect(toLegacyPlainText(value, { mentionText })).toEqual(text('a\nb'));
    });

    it('should read a tree of more nodes than the converter allows (MIG-16)', () => {
        const leaves = Array.from({ length: NODES_OVER_LIMIT }, () => ({ text: 'a' }));

        expect(read(leaves)).toEqual(text('a'.repeat(NODES_OVER_LIMIT)));
    });
});
