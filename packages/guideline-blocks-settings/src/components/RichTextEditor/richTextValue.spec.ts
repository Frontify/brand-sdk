/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type RteDocument, toPlainText } from '@frontify/fondue/rich-text-editor';
import { columnBreakPlugin, defaultPlugins } from '@frontify/fondue/rich-text-editor/plugins';
import { describe, expect, it } from 'vitest';

import { readRichTextValue, writeRichTextValue } from './richTextValue';
import { TextStylePluginsWithoutImage } from './textStylePlugins';

const COLUMNS = 2;
const EDITOR_PLUGINS = [...defaultPlugins, columnBreakPlugin({ columns: COLUMNS })];
const OVER_THE_TEXT_LIMIT = 1_000_001;

const stringify = (tree: unknown[]): string => JSON.stringify(tree);

const readEditableDocument = (value: string): RteDocument => {
    const stored = readRichTextValue(value, EDITOR_PLUGINS);
    if (stored.access !== 'editable') {
        throw new Error(`Expected an editable value, got ${stored.access}`);
    }

    return stored.document;
};

const PARAGRAPH = stringify([{ type: 'p', children: [{ text: 'Lorem ipsum' }] }]);
const ALIGNED_PARAGRAPH = stringify([{ type: 'p', align: 'center', children: [{ text: 'Lorem ipsum' }] }]);
const MARKED_PARAGRAPH = stringify([{ type: 'p', children: [{ text: 'Lorem ipsum', bold: true }] }]);
const BULLET_LIST = stringify([
    { type: 'ul', children: [{ type: 'li', children: [{ type: 'lic', children: [{ text: 'Lorem ipsum' }] }] }] },
]);

const ROUND_TRIP_VALUES = {
    'headings, marks and colour': stringify([
        { type: 'heading1', align: 'center', children: [{ text: 'Title', bold: true }] },
        { type: 'custom2', children: [{ text: 'Sub', italic: true, underline: true, color: 'rgba(255, 0, 0, 1)' }] },
        {
            type: 'p',
            children: [
                { text: 'Styled', strikethrough: true, code: true },
                { text: 'Low', subscript: true },
            ],
        },
    ]),
    'links and buttons': stringify([
        {
            type: 'p',
            children: [
                { text: 'Read ' },
                { type: 'a', url: 'https://example.com/docs', target: '_blank', children: [{ text: 'docs' }] },
                { text: ' or ' },
                {
                    type: 'button',
                    url: 'https://example.com/start',
                    target: '_self',
                    buttonStyle: 'secondary',
                    children: [{ text: 'start' }],
                },
                { text: '' },
            ],
        },
    ]),
    'nested lists': stringify([
        {
            type: 'ul',
            children: [
                {
                    type: 'li',
                    children: [
                        { type: 'lic', children: [{ text: 'First item' }] },
                        {
                            type: 'ol',
                            children: [{ type: 'li', children: [{ type: 'lic', children: [{ text: 'Nested' }] }] }],
                        },
                    ],
                },
            ],
        },
    ]),
    'check lists': stringify([
        { type: 'checkbox-item', checked: true, children: [{ text: 'Level one' }] },
        { type: 'checkbox-item', indent: 2, align: 'center', children: [{ text: 'Level two' }] },
        { type: 'checkbox-item', indent: 1, children: [{ text: 'Back to one' }] },
    ]),
    'column breaks': stringify([
        { type: 'p', breakAfterColumn: 'active', children: [{ text: 'Left column' }] },
        { type: 'p', breakAfterColumn: 'inactive', children: [{ text: 'Right column' }] },
    ]),
};

describe('readRichTextValue', () => {
    it('should make an exact value editable when the plugins cover it', () => {
        const stored = readRichTextValue(PARAGRAPH, EDITOR_PLUGINS);

        expect(stored).toEqual({
            access: 'editable',
            document: { version: 1, blocks: [{ type: 'paragraph', children: [{ text: 'Lorem ipsum' }] }] },
        });
    });

    it('should make an empty value editable', () => {
        expect(readRichTextValue(undefined, EDITOR_PLUGINS)).toEqual({
            access: 'editable',
            document: { version: 1, blocks: [] },
        });
    });

    it.each([
        ['a list', BULLET_LIST],
        ['an alignment', ALIGNED_PARAGRAPH],
        ['a mark', MARKED_PARAGRAPH],
    ])('should keep an exact value with %s read only when no plugin covers it', (_name, value) => {
        const stored = readRichTextValue(value, TextStylePluginsWithoutImage);

        expect(stored.access).toBe('readonly');
    });

    it('should keep a value that may have lost something read only', () => {
        const value = stringify([{ type: 'emoji', name: 'smile', children: [{ text: '' }] }]);

        const stored = readRichTextValue(value, EDITOR_PLUGINS);

        expect(stored.access).toBe('readonly');
    });

    it('should show HTML read only through the plugins', () => {
        const stored = readRichTextValue('<p>Lorem <strong>ipsum</strong></p>', EDITOR_PLUGINS);

        expect(stored.access).toBe('readonly');
        if (stored.access === 'readonly') {
            expect(toPlainText(stored.document, { plugins: EDITOR_PLUGINS })).toBe('Lorem ipsum');
        }
    });

    it('should show plain text read only', () => {
        const stored = readRichTextValue('Lorem ipsum', EDITOR_PLUGINS);

        expect(stored.access).toBe('readonly');
        if (stored.access === 'readonly') {
            expect(toPlainText(stored.document, { plugins: EDITOR_PLUGINS })).toBe('Lorem ipsum');
        }
    });

    it.each([
        ['JSON that is not a list', '42'],
        ['a node that is not a text or an element', JSON.stringify([{ type: 'p', children: [{ text: 5 }] }])],
        [
            'a text over the size limit',
            stringify([{ type: 'p', children: [{ text: 'a'.repeat(OVER_THE_TEXT_LIMIT) }] }]),
        ],
        ['an element named like a new format block', stringify([{ type: 'textStyle', children: [{ text: 'Lorem' }] }])],
    ])('should not read %s', (_name, value) => {
        expect(readRichTextValue(value, EDITOR_PLUGINS)).toEqual({ access: 'unreadable' });
    });
});

describe('writeRichTextValue', () => {
    it('should write a document as legacy JSON', () => {
        const written = writeRichTextValue(readEditableDocument(PARAGRAPH), COLUMNS);

        expect(written).toEqual({ outcome: 'written', value: PARAGRAPH });
    });

    it('should report the codes of a document that has no legacy form', () => {
        const table: RteDocument = { version: 1, blocks: [{ type: 'table', children: [] }] };

        const written = writeRichTextValue(table, COLUMNS);

        expect(written).toEqual({ outcome: 'not-reversible', diagnostics: [{ code: 'no-legacy-form', path: [0] }] });
    });

    it.each(Object.entries(ROUND_TRIP_VALUES))('should read back what it wrote for %s', (_name, value) => {
        const document = readEditableDocument(value);

        const written = writeRichTextValue(document, COLUMNS);

        expect(written.outcome).toBe('written');
        if (written.outcome === 'written') {
            expect(readEditableDocument(written.value)).toEqual(document);
        }
    });
});
