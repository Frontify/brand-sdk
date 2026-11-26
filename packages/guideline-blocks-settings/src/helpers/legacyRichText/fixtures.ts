/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type RteBlock, type RteDocument } from '@frontify/fondue/rich-text-editor';

import {
    type ConvertLegacyRichTextResult,
    type LegacyRichTextDiagnostic,
    type LegacyRichTextTree,
    type OpenRichTextDocument,
} from './types';

export type LegacyFixture = {
    id: string;
    legacy: string;
    expectedOutcome: ConvertLegacyRichTextResult['outcome'];
    expectedDocument?: OpenRichTextDocument;
    expectedDiagnostics?: LegacyRichTextDiagnostic<string>[];
};

const NESTING_OVER_LIMIT = 65;

const stringify = (tree: LegacyRichTextTree): string => JSON.stringify(tree);

const documentOf = (blocks: RteBlock[]): RteDocument => ({ version: 1, blocks });

// Built apart from the document so the open format's undeclared keys are not excess-property errors.
const EMOJI_BLOCK = { type: 'emoji', name: 'smile', children: [{ text: '' }] };
const HIGHLIGHT_BLOCK = { type: 'paragraph', children: [{ text: 'Lorem', highlight: 'yellow' }] };
const UNKNOWN_ELEMENT_DOCUMENT: OpenRichTextDocument = { version: 1, blocks: [EMOJI_BLOCK] };
const UNKNOWN_PROPERTY_DOCUMENT: OpenRichTextDocument = { version: 1, blocks: [HIGHLIGHT_BLOCK] };
const UNKNOWN_ALIGN_BLOCK = { type: 'paragraph', align: 'start', children: [{ text: 'Lorem ipsum' }] };
const UNKNOWN_ALIGN_DOCUMENT: OpenRichTextDocument = { version: 1, blocks: [UNKNOWN_ALIGN_BLOCK] };
const UNKNOWN_TEXT_STYLE_DOCUMENT: OpenRichTextDocument = {
    version: 1,
    blocks: [{ type: 'paragraph', children: [{ text: 'Lorem ipsum', textStyle: 'heading9' }] }],
};

const createDeeplyNestedTree = (depth: number): LegacyRichTextTree => {
    let node: LegacyRichTextTree[number] = { text: 'Lorem ipsum' };
    for (let level = 0; level < depth; level++) {
        node = { type: 'p', children: [node] };
    }

    return [node];
};

export const LEGACY_FIXTURES: LegacyFixture[] = [
    {
        id: 'empty-string',
        legacy: '',
        expectedOutcome: 'exact',
        expectedDocument: documentOf([]),
    },
    {
        id: 'null-literal',
        legacy: 'null',
        expectedOutcome: 'exact',
        expectedDocument: documentOf([]),
    },
    {
        id: 'line-break-tag',
        legacy: '<br />',
        expectedOutcome: 'exact',
        expectedDocument: documentOf([]),
    },
    {
        id: 'emoji-characters',
        legacy: stringify([{ type: 'p', children: [{ text: 'Lorem 😀 ipsum 🎉 dolor' }] }]),
        expectedOutcome: 'exact',
        expectedDocument: documentOf([{ type: 'paragraph', children: [{ text: 'Lorem 😀 ipsum 🎉 dolor' }] }]),
    },
    {
        id: 'unicode-escapes',
        legacy: String.raw`[{"type":"p","children":[{"text":"Caf\u00e9 \u2603"}]}]`,
        expectedOutcome: 'exact',
        expectedDocument: documentOf([{ type: 'paragraph', children: [{ text: 'Café ☃' }] }]),
    },
    {
        id: 'several-top-level-blocks',
        legacy: stringify([
            { type: 'p', children: [{ text: 'First block' }] },
            { type: 'quote', children: [{ text: 'Second block' }] },
            { type: 'p', children: [{ text: 'Third block' }] },
        ]),
        expectedOutcome: 'exact',
        expectedDocument: documentOf([
            { type: 'paragraph', children: [{ text: 'First block' }] },
            { type: 'quote', children: [{ text: 'Second block' }] },
            { type: 'paragraph', children: [{ text: 'Third block' }] },
        ]),
    },
    {
        id: 'image-title-centred',
        legacy: stringify([{ type: 'imageTitle', align: 'center', children: [{ text: 'Lorem caption' }] }]),
        expectedOutcome: 'exact',
        expectedDocument: documentOf([
            { type: 'textStyle', style: 'imageTitle', align: 'center', children: [{ text: 'Lorem caption' }] },
        ]),
    },
    {
        id: 'paragraph-aligned',
        legacy: stringify([{ type: 'p', align: 'center', children: [{ text: 'Lorem ipsum dolor' }] }]),
        expectedOutcome: 'exact',
        expectedDocument: documentOf([
            { type: 'paragraph', align: 'center', children: [{ text: 'Lorem ipsum dolor' }] },
        ]),
    },
    {
        id: 'text-styles',
        legacy: stringify([
            { type: 'heading1', children: [{ text: 'Lorem title' }] },
            { type: 'custom2', align: 'right', children: [{ text: 'Sit amet' }] },
            { type: 'imageCaption', children: [{ text: 'Consectetur' }] },
        ]),
        expectedOutcome: 'exact',
        expectedDocument: documentOf([
            { type: 'textStyle', style: 'heading1', children: [{ text: 'Lorem title' }] },
            { type: 'textStyle', style: 'custom2', align: 'right', children: [{ text: 'Sit amet' }] },
            { type: 'textStyle', style: 'imageCaption', children: [{ text: 'Consectetur' }] },
        ]),
    },
    {
        id: 'quote',
        legacy: stringify([{ type: 'quote', children: [{ text: 'Adipiscing elit' }] }]),
        expectedOutcome: 'exact',
        expectedDocument: documentOf([{ type: 'quote', children: [{ text: 'Adipiscing elit' }] }]),
    },
    {
        id: 'nested-lists',
        legacy: stringify([
            {
                type: 'ul',
                children: [
                    {
                        type: 'li',
                        children: [
                            { type: 'lic', children: [{ text: 'First item' }] },
                            {
                                type: 'ol',
                                children: [
                                    { type: 'li', children: [{ type: 'lic', children: [{ text: 'Nested item' }] }] },
                                ],
                            },
                        ],
                    },
                ],
            },
        ]),
        expectedOutcome: 'exact',
        expectedDocument: documentOf([
            {
                type: 'bulletList',
                children: [
                    {
                        type: 'listItem',
                        children: [
                            { type: 'paragraph', children: [{ text: 'First item' }] },
                            {
                                type: 'numberedList',
                                children: [
                                    {
                                        type: 'listItem',
                                        children: [{ type: 'paragraph', children: [{ text: 'Nested item' }] }],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ]),
    },
    {
        id: 'list-item-inline-run',
        legacy: stringify([
            {
                type: 'ul',
                children: [
                    {
                        type: 'li',
                        children: [
                            { text: 'Bare text ' },
                            { type: 'a', url: 'https://example.com/page', children: [{ text: 'linked' }] },
                        ],
                    },
                ],
            },
        ]),
        expectedOutcome: 'exact',
        expectedDocument: documentOf([
            {
                type: 'bulletList',
                children: [
                    {
                        type: 'listItem',
                        children: [
                            {
                                type: 'paragraph',
                                children: [
                                    { text: 'Bare text ' },
                                    { text: 'linked', link: { href: 'https://example.com/page' } },
                                ],
                            },
                        ],
                    },
                ],
            },
        ]),
    },
    {
        id: 'check-list-levels',
        legacy: stringify([
            { type: 'checkbox-item', checked: true, children: [{ text: 'Level one' }] },
            { type: 'checkbox-item', indent: 2, align: 'center', children: [{ text: 'Level two' }] },
            { type: 'checkbox-item', indent: 1, children: [{ text: 'Back to one' }] },
        ]),
        expectedOutcome: 'exact',
        expectedDocument: documentOf([
            {
                type: 'checkList',
                children: [
                    {
                        type: 'checkItem',
                        checked: true,
                        children: [
                            { type: 'paragraph', children: [{ text: 'Level one' }] },
                            {
                                type: 'checkList',
                                children: [
                                    {
                                        type: 'checkItem',
                                        children: [
                                            { type: 'paragraph', align: 'center', children: [{ text: 'Level two' }] },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    { type: 'checkItem', children: [{ type: 'paragraph', children: [{ text: 'Back to one' }] }] },
                ],
            },
        ]),
    },
    {
        id: 'column-breaks',
        legacy: stringify([
            { type: 'p', breakAfterColumn: 'active', children: [{ text: 'Left column' }] },
            { type: 'p', breakAfterColumn: 'inactive', children: [{ text: 'Right column' }] },
        ]),
        expectedOutcome: 'exact',
        expectedDocument: documentOf([
            { type: 'paragraph', children: [{ text: 'Left column' }] },
            { type: 'columnBreak' },
            { type: 'paragraph', children: [{ text: 'Right column' }] },
            { type: 'columnBreak' },
        ]),
    },
    {
        id: 'marks',
        legacy: stringify([
            {
                type: 'p',
                children: [
                    { text: 'Styled', bold: true, italic: true, underline: true, strikethrough: true, code: true },
                    { text: 'Plain', bold: false },
                    { text: 'Low', subscript: true },
                    { text: 'High', superscript: true },
                ],
            },
        ]),
        expectedOutcome: 'exact',
        expectedDocument: documentOf([
            {
                type: 'paragraph',
                children: [
                    { text: 'Styled', bold: true, italic: true, underline: true, strikethrough: true, code: true },
                    { text: 'Plain' },
                    { text: 'Low', subscript: true },
                    { text: 'High', superscript: true },
                ],
            },
        ]),
    },
    {
        id: 'font-color',
        legacy: stringify([{ type: 'p', children: [{ text: 'Colourful', color: 'rgba(255, 0, 0, 1)' }] }]),
        expectedOutcome: 'exact',
        expectedDocument: documentOf([
            { type: 'paragraph', children: [{ text: 'Colourful', fontColor: { color: '#ff0000' } }] },
        ]),
    },
    {
        id: 'line-breaks',
        legacy: stringify([{ type: 'p', children: [{ text: 'First line\nSecond line' }] }]),
        expectedOutcome: 'exact',
        expectedDocument: documentOf([
            { type: 'paragraph', children: [{ text: 'First line' }, { type: 'break' }, { text: 'Second line' }] },
        ]),
    },
    {
        id: 'adjacent-leaves-merged',
        legacy: stringify([
            {
                type: 'p',
                children: [{ text: 'Lorem ', bold: true }, { text: 'ipsum', bold: true }, { text: ' dolor' }],
            },
        ]),
        expectedOutcome: 'exact',
        expectedDocument: documentOf([
            { type: 'paragraph', children: [{ text: 'Lorem ipsum', bold: true }, { text: ' dolor' }] },
        ]),
    },
    {
        id: 'anchor-new-tab',
        legacy: stringify([
            {
                type: 'p',
                children: [
                    { type: 'a', url: 'https://example.com/docs', target: '_blank', children: [{ text: 'Docs' }] },
                ],
            },
        ]),
        expectedOutcome: 'exact',
        expectedDocument: documentOf([
            {
                type: 'paragraph',
                children: [{ text: 'Docs', link: { href: 'https://example.com/docs', openInNewTab: true } }],
            },
        ]),
    },
    {
        id: 'anchor-chosen-link',
        legacy: stringify([
            {
                type: 'p',
                children: [
                    {
                        type: 'a',
                        url: 'https://example.com/ignored',
                        target: '_self',
                        chosenLink: { searchResult: { link: '/document/42' }, openInNewTab: true },
                        children: [{ text: 'Guideline' }],
                    },
                ],
            },
        ]),
        expectedOutcome: 'requires-review',
        expectedDocument: documentOf([
            {
                type: 'paragraph',
                children: [{ text: 'Guideline', link: { href: '/document/42', openInNewTab: true } }],
            },
        ]),
        expectedDiagnostics: [{ code: 'link-conflict', path: [0, 0] }],
    },
    {
        id: 'anchor-chosen-link-href-conflict',
        legacy: stringify([
            {
                type: 'p',
                children: [
                    {
                        type: 'a',
                        url: '/editor-page',
                        target: '_blank',
                        chosenLink: { searchResult: { link: '/display-page' }, openInNewTab: true },
                        children: [{ text: 'Page' }],
                    },
                ],
            },
        ]),
        expectedOutcome: 'requires-review',
        expectedDocument: documentOf([
            { type: 'paragraph', children: [{ text: 'Page', link: { href: '/display-page', openInNewTab: true } }] },
        ]),
        expectedDiagnostics: [{ code: 'link-conflict', path: [0, 0] }],
    },
    {
        id: 'anchor-chosen-link-tab-conflict',
        legacy: stringify([
            {
                type: 'p',
                children: [
                    {
                        type: 'a',
                        url: '/page',
                        target: '_self',
                        chosenLink: { searchResult: { link: '/page' }, openInNewTab: true },
                        children: [{ text: 'Page' }],
                    },
                ],
            },
        ]),
        expectedOutcome: 'requires-review',
        expectedDocument: documentOf([
            { type: 'paragraph', children: [{ text: 'Page', link: { href: '/page', openInNewTab: true } }] },
        ]),
        expectedDiagnostics: [{ code: 'link-conflict', path: [0, 0] }],
    },
    {
        id: 'anchor-chosen-link-reverse-tab-conflict',
        legacy: stringify([
            {
                type: 'p',
                children: [
                    {
                        type: 'a',
                        url: '/page',
                        target: '_blank',
                        chosenLink: { searchResult: { link: '/page' } },
                        children: [{ text: 'Page' }],
                    },
                ],
            },
        ]),
        expectedOutcome: 'requires-review',
        expectedDocument: documentOf([{ type: 'paragraph', children: [{ text: 'Page', link: { href: '/page' } }] }]),
        expectedDiagnostics: [{ code: 'link-conflict', path: [0, 0] }],
    },
    {
        id: 'anchor-chosen-link-url-only',
        legacy: stringify([
            {
                type: 'p',
                children: [
                    {
                        type: 'a',
                        url: '/page',
                        target: '_blank',
                        chosenLink: { searchResult: { link: '' }, openInNewTab: true },
                        children: [{ text: 'Page' }],
                    },
                ],
            },
        ]),
        expectedOutcome: 'exact',
        expectedDocument: documentOf([
            { type: 'paragraph', children: [{ text: 'Page', link: { href: '/page', openInNewTab: true } }] },
        ]),
    },
    {
        id: 'anchor-chosen-link-link-only',
        legacy: stringify([
            {
                type: 'p',
                children: [
                    {
                        type: 'a',
                        target: '_blank',
                        chosenLink: { searchResult: { link: '/page' }, openInNewTab: true },
                        children: [{ text: 'Page' }],
                    },
                ],
            },
        ]),
        expectedOutcome: 'exact',
        expectedDocument: documentOf([
            { type: 'paragraph', children: [{ text: 'Page', link: { href: '/page', openInNewTab: true } }] },
        ]),
    },
    {
        id: 'anchor-chosen-link-agreeing',
        legacy: stringify([
            {
                type: 'p',
                children: [
                    {
                        type: 'a',
                        url: '/page',
                        target: '_blank',
                        chosenLink: { searchResult: { link: '/page' }, openInNewTab: true },
                        children: [{ text: 'Page' }],
                    },
                ],
            },
        ]),
        expectedOutcome: 'exact',
        expectedDocument: documentOf([
            { type: 'paragraph', children: [{ text: 'Page', link: { href: '/page', openInNewTab: true } }] },
        ]),
    },
    {
        id: 'button-secondary',
        legacy: stringify([
            {
                type: 'p',
                children: [
                    {
                        type: 'button',
                        url: 'https://example.com/start',
                        target: '_self',
                        buttonStyle: 'secondary',
                        children: [{ text: 'Start' }],
                    },
                ],
            },
        ]),
        expectedOutcome: 'exact',
        expectedDocument: documentOf([
            {
                type: 'paragraph',
                children: [{ text: 'Start', link: { href: 'https://example.com/start', appearance: 'secondary' } }],
            },
        ]),
    },
    {
        id: 'button-defaults',
        legacy: stringify([
            {
                type: 'p',
                children: [{ type: 'button', url: 'https://example.com/go', children: [{ text: 'Go' }] }],
            },
        ]),
        expectedOutcome: 'exact',
        expectedDocument: documentOf([
            {
                type: 'paragraph',
                children: [
                    {
                        text: 'Go',
                        link: { href: 'https://example.com/go', appearance: 'primary', openInNewTab: true },
                    },
                ],
            },
        ]),
    },
    {
        id: 'mention-unresolved',
        legacy: stringify([
            {
                type: 'p',
                children: [
                    {
                        type: 'mention',
                        value: 'Ada Lovelace',
                        category: 'user',
                        id: 'user-1',
                        children: [{ text: '' }],
                    },
                ],
            },
        ]),
        expectedOutcome: 'requires-review',
        expectedDocument: documentOf([
            { type: 'paragraph', children: [{ type: 'mention', id: 'user-1', username: '', name: 'Ada Lovelace' }] },
        ]),
        expectedDiagnostics: [{ code: 'mention-unresolved', path: [0, 0] }],
    },
    {
        id: 'mention-group-unresolved',
        legacy: stringify([
            {
                type: 'p',
                children: [
                    {
                        type: 'mention',
                        value: 'Ada Lovelace',
                        category: 'group',
                        id: 'group-1',
                        children: [{ text: '' }],
                    },
                ],
            },
        ]),
        expectedOutcome: 'requires-review',
        expectedDocument: documentOf([
            {
                type: 'paragraph',
                children: [{ type: 'mention', id: 'group-1', username: '', name: 'Ada Lovelace', kind: 'group' }],
            },
        ]),
        expectedDiagnostics: [{ code: 'mention-unresolved', path: [0, 0] }],
    },
    {
        id: 'mention-all-unresolved',
        legacy: stringify([
            {
                type: 'p',
                children: [
                    { type: 'mention', value: 'Ada Lovelace', category: 'all', id: 'all', children: [{ text: '' }] },
                ],
            },
        ]),
        expectedOutcome: 'requires-review',
        expectedDocument: documentOf([
            {
                type: 'paragraph',
                children: [{ type: 'mention', id: 'all', username: '', name: 'Ada Lovelace', kind: 'all' }],
            },
        ]),
        expectedDiagnostics: [{ code: 'mention-unresolved', path: [0, 0] }],
    },
    {
        id: 'mention-empty-value-unresolved',
        legacy: stringify([
            {
                type: 'p',
                children: [{ type: 'mention', value: '', category: 'user', id: 'user-1', children: [{ text: '' }] }],
            },
        ]),
        expectedOutcome: 'requires-review',
        expectedDocument: documentOf([
            { type: 'paragraph', children: [{ type: 'mention', id: 'user-1', username: '', name: '' }] },
        ]),
        expectedDiagnostics: [{ code: 'mention-unresolved', path: [0, 0] }],
    },
    {
        id: 'align-outside-the-four',
        legacy: stringify([{ type: 'p', align: 'start', children: [{ text: 'Lorem ipsum' }] }]),
        expectedOutcome: 'requires-review',
        expectedDocument: UNKNOWN_ALIGN_DOCUMENT,
        expectedDiagnostics: [{ code: 'unknown-property', path: [0] }],
    },
    {
        id: 'text-style-outside-the-known-styles',
        legacy: stringify([{ type: 'p', children: [{ text: 'Lorem ipsum', textStyle: 'heading9' }] }]),
        expectedOutcome: 'requires-review',
        expectedDocument: UNKNOWN_TEXT_STYLE_DOCUMENT,
        expectedDiagnostics: [{ code: 'unknown-property', path: [0, 0] }],
    },
    {
        id: 'indent-jump',
        legacy: stringify([
            { type: 'checkbox-item', children: [{ text: 'Level one' }] },
            { type: 'checkbox-item', indent: 3, children: [{ text: 'Jumped' }] },
        ]),
        expectedOutcome: 'requires-review',
        expectedDocument: documentOf([
            {
                type: 'checkList',
                children: [
                    {
                        type: 'checkItem',
                        children: [
                            { type: 'paragraph', children: [{ text: 'Level one' }] },
                            {
                                type: 'checkList',
                                children: [
                                    {
                                        type: 'checkItem',
                                        children: [{ type: 'paragraph', children: [{ text: 'Jumped' }] }],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ]),
        expectedDiagnostics: [{ code: 'indent-jump', path: [1] }],
    },
    {
        id: 'link-unsafe',
        legacy: stringify([
            {
                type: 'p',
                children: [{ type: 'a', url: 'javascript:alert(1)', children: [{ text: 'Click here' }] }],
            },
        ]),
        expectedOutcome: 'requires-review',
        expectedDocument: documentOf([{ type: 'paragraph', children: [{ text: 'Click here' }] }]),
        expectedDiagnostics: [{ code: 'link-unsafe', path: [0, 0] }],
    },
    {
        id: 'button-style-unknown',
        legacy: stringify([
            {
                type: 'p',
                children: [
                    {
                        type: 'button',
                        url: 'https://example.com/more',
                        target: '_self',
                        buttonStyle: 'ghost',
                        children: [{ text: 'More' }],
                    },
                ],
            },
        ]),
        expectedOutcome: 'requires-review',
        expectedDocument: documentOf([
            { type: 'paragraph', children: [{ text: 'More', link: { href: 'https://example.com/more' } }] },
        ]),
        expectedDiagnostics: [{ code: 'button-style-unknown', path: [0, 0] }],
    },
    {
        id: 'excluded-marks',
        legacy: stringify([{ type: 'p', children: [{ text: 'Both', subscript: true, superscript: true }] }]),
        expectedOutcome: 'requires-review',
        expectedDocument: documentOf([{ type: 'paragraph', children: [{ text: 'Both', subscript: true }] }]),
        expectedDiagnostics: [{ code: 'excluded-marks', path: [0, 0] }],
    },
    {
        id: 'color-unparsed',
        legacy: stringify([{ type: 'p', children: [{ text: 'Named', color: 'red' }] }]),
        expectedOutcome: 'requires-review',
        expectedDocument: documentOf([{ type: 'paragraph', children: [{ text: 'Named' }] }]),
        expectedDiagnostics: [{ code: 'color-unparsed', path: [0, 0] }],
    },
    {
        id: 'unknown-element',
        legacy: stringify([{ type: 'emoji', name: 'smile', children: [{ text: '' }] }]),
        expectedOutcome: 'requires-review',
        expectedDocument: UNKNOWN_ELEMENT_DOCUMENT,
        expectedDiagnostics: [{ code: 'unknown-element', path: [0] }],
    },
    {
        id: 'unknown-property',
        legacy: stringify([{ type: 'p', children: [{ text: 'Lorem', highlight: 'yellow' }] }]),
        expectedOutcome: 'requires-review',
        expectedDocument: UNKNOWN_PROPERTY_DOCUMENT,
        expectedDiagnostics: [{ code: 'unknown-property', path: [0, 0] }],
    },
    {
        id: 'html-value',
        legacy: '<p>Lorem ipsum</p>',
        expectedOutcome: 'unsupported',
        expectedDiagnostics: [{ code: 'html-value', path: [] }],
    },
    {
        id: 'limit-exceeded',
        legacy: stringify(createDeeplyNestedTree(NESTING_OVER_LIMIT)),
        expectedOutcome: 'unsupported',
        expectedDiagnostics: [{ code: 'limit-exceeded', path: [] }],
    },
    {
        id: 'invalid-value',
        legacy: '42',
        expectedOutcome: 'invalid',
        expectedDiagnostics: [{ code: 'invalid-value', path: [] }],
    },
    {
        id: 'footer-column-layout',
        legacy: JSON.stringify([
            [{ type: 'p', children: [{ text: 'Left column' }] }],
            [{ type: 'p', children: [{ text: 'Right column' }] }],
        ]),
        expectedOutcome: 'invalid',
        expectedDiagnostics: [{ code: 'invalid-node', path: [0] }],
    },
    {
        id: 'invalid-node',
        legacy: JSON.stringify([{ type: 'p', children: [{ text: 5 }] }]),
        expectedOutcome: 'invalid',
        expectedDiagnostics: [{ code: 'invalid-node', path: [0, 0] }],
    },
];
