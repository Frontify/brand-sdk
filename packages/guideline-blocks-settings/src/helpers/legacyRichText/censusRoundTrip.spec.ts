/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { convertLegacyRichText } from './convertLegacyRichText';
import { toLegacyRichText } from './toLegacyRichText';
import {
    type ConvertLegacyRichTextResult,
    type LegacyElement,
    type LegacyNode,
    type LegacyRichTextPath,
    type LegacyRichTextTree,
    type LegacyText,
    type OpenRichTextDocument,
    type ResolveMention,
} from './types';
import { INACTIVE_COLUMN_BREAK } from './vocabulary';

const COMMENTS_CENSUS = 'comments census';
const THEME_CENSUS = 'theme census';

type Census = typeof COMMENTS_CENSUS | typeof THEME_CENSUS;

type Normalisation = 'inline-edge-padding' | 'text-style-p-leaf-merge' | 'text-style-block-leaf-drop';

type ApprovedFallbackExpectation = {
    kind: 'approved-fallback';
    outcome: ConvertLegacyRichTextResult['outcome'];
    diagnostics: ConvertLegacyRichTextResult['diagnostics'];
    document: ConvertLegacyRichTextResult['document'];
    reason: string;
};

type Expectation =
    | { kind: 'identity' }
    | { kind: 'normalised'; normalisation: Normalisation; legacy: LegacyRichTextTree }
    | ApprovedFallbackExpectation;

type CensusRow = { census: Census; row: string; stored: string | undefined; expected: Expectation };

type ApprovedFallbackSummary = Pick<CensusRow, 'census' | 'row'> & Omit<ApprovedFallbackExpectation, 'kind'>;

type NormalisedSummary = Pick<CensusRow, 'census' | 'row'> & { normalisation: Normalisation };

const MENTIONED_USER = { id: 'user-1', name: 'Ada Lovelace' };

const FIRST_PART = 'Lorem ';
const SECOND_PART = 'ipsum';
const SAMPLE_TEXT = `${FIRST_PART}${SECOND_PART}`;
const OTHER_SAMPLE_TEXT = 'Dolor sit amet';
const GREETING_TEXT = 'Hi ';
const FOLLOW_UP_TEXT = ', please check';
const SOFT_BREAK_TEXT = 'First line\nSecond line';
const EMOJI_TEXT = 'Lorem 😀 ipsum 🎉 dolor';
const ESCAPED_TEXT_JSON = String.raw`[{"type":"p","children":[{"text":"Caf\u00e9 \u2603"}]}]`;
const JSON_UNICODE_ESCAPE = String.raw`\u`;
const CODE_TEXT = 'pnpm test';
const LINK_LABEL = 'Docs';
const BUTTON_LABEL = 'Start';
const DOCS_URL = 'https://example.com/docs';
const START_URL = 'https://example.com/start';
const NEW_TAB_TARGET = '_blank';
const SAME_TAB_TARGET = '_self';

const BODY_TEXT_STYLE = 'p';
const LEGACY_PARAGRAPH_TYPE = 'p';
const DOCUMENT_PARAGRAPH_TYPE = 'paragraph';
const HEADING1_STYLE = 'heading1';
const HEADING2_STYLE = 'heading2';
const HEADING3_STYLE = 'heading3';
const HEADING4_STYLE = 'heading4';
const CUSTOM1_STYLE = 'custom1';
const CUSTOM2_STYLE = 'custom2';
const CUSTOM3_STYLE = 'custom3';
const QUOTE_STYLE = 'quote';
const IMAGE_TITLE_STYLE = 'imageTitle';
const IMAGE_CAPTION_STYLE = 'imageCaption';
const PRIMARY_BUTTON_STYLE = 'primary';
const SECONDARY_BUTTON_STYLE = 'secondary';
const TERTIARY_BUTTON_STYLE = 'tertiary';
const LEFT_ALIGN = 'left';
const CENTER_ALIGN = 'center';
const RIGHT_ALIGN = 'right';
const JUSTIFY_ALIGN = 'justify';

// Placeholders: the census counts rows but does not name the values, so swap in the real names when they are known.
const SYNTHETIC_UNKNOWN_ELEMENT_TYPE = 'synthetic-unknown-element';
const SYNTHETIC_OTHER_TEXT_STYLE = 'synthetic-other-text-style';
const SYNTHETIC_OTHER_ALIGN = 'synthetic-other-align';

const PLAIN_TEXT_VALUE = 'Lorem ipsum dolor';
const HTML_VALUE = '<p>Lorem ipsum</p>';
const BLANK_VALUE = '';
const NULL_VALUE = 'null';
const JSON_SCALAR_VALUE = '42';
const MISSING_VALUE = undefined;

const DOCUMENT_PATH: LegacyRichTextPath = [];
const FIRST_BLOCK_PATH: LegacyRichTextPath = [0];
const FIRST_LEAF_PATH: LegacyRichTextPath = [0, 0];

const EMPTY_VALUE_REASON = 'An empty value converts to the empty document.';
const MISSING_KEY_REASON = 'A missing key has no stored value, so it converts to the empty document.';
const OTHER_TEXT_STYLE_REASON = 'The leaf keeps its text style as an unknown property and is flagged for review.';
const UNKNOWN_ELEMENT_REASON = 'The element is kept whole and is flagged for review.';
const OTHER_ALIGN_REASON = 'The block keeps its alignment as an unknown property and is flagged for review.';

const PLAIN_TEXT_REASON = 'Plain text is not JSON, so it takes the html-value path.';
const JSON_SCALAR_REASON = 'A bare JSON scalar is not a legacy tree.';
const HTML_REASON = 'HTML is not JSON, so it takes the html-value path.';
const COLUMN_LAYOUT_REASON = 'An array of column arrays has an array where a node belongs, so it is an invalid node.';

const EMPTY_DOCUMENT: OpenRichTextDocument = { version: 1, blocks: [] };

// Built apart from the documents so the open format's undeclared keys are not excess-property errors.
const UNKNOWN_ELEMENT_BLOCK = { type: SYNTHETIC_UNKNOWN_ELEMENT_TYPE, children: [{ text: SAMPLE_TEXT }] };
const OTHER_TEXT_STYLE_BLOCK = {
    type: DOCUMENT_PARAGRAPH_TYPE,
    children: [{ text: SAMPLE_TEXT, textStyle: SYNTHETIC_OTHER_TEXT_STYLE }],
};
const OTHER_ALIGN_BLOCK = {
    type: DOCUMENT_PARAGRAPH_TYPE,
    align: SYNTHETIC_OTHER_ALIGN,
    children: [{ text: SAMPLE_TEXT }],
};
const UNKNOWN_ELEMENT_DOCUMENT: OpenRichTextDocument = { version: 1, blocks: [UNKNOWN_ELEMENT_BLOCK] };
const OTHER_TEXT_STYLE_DOCUMENT: OpenRichTextDocument = { version: 1, blocks: [OTHER_TEXT_STYLE_BLOCK] };
const OTHER_ALIGN_DOCUMENT: OpenRichTextDocument = { version: 1, blocks: [OTHER_ALIGN_BLOCK] };

const EMPTY_TEXT: LegacyText = { text: '' };

const resolveEveryMention: ResolveMention = () => ({
    status: 'resolved',
    username: MENTIONED_USER.name,
    name: MENTIONED_USER.name,
});

const stringify = (tree: LegacyRichTextTree): string => JSON.stringify(tree);

const block = (type: string, ...children: LegacyNode[]): LegacyElement => ({ type, children });

const paragraph = (...children: LegacyNode[]): LegacyElement => block(LEGACY_PARAGRAPH_TYPE, ...children);

const alignedParagraph = (align: string, ...children: LegacyNode[]): LegacyElement => ({
    type: LEGACY_PARAGRAPH_TYPE,
    align,
    children,
});

const userMention = (): LegacyElement => ({
    type: 'mention',
    value: MENTIONED_USER.name,
    category: 'user',
    id: MENTIONED_USER.id,
    children: [{ text: '' }],
});

const anchor = (target: string): LegacyElement => ({
    type: 'a',
    url: DOCS_URL,
    target,
    children: [{ text: LINK_LABEL }],
});

const button = (buttonStyle: string): LegacyElement => ({
    type: 'button',
    url: START_URL,
    target: NEW_TAB_TARGET,
    buttonStyle,
    children: [{ text: BUTTON_LABEL }],
});

const listItemContent = (...children: LegacyNode[]): LegacyElement => block('lic', ...children);

const listItem = (...children: LegacyNode[]): LegacyElement => block('li', ...children);

const bulletList = (...items: LegacyElement[]): LegacyElement => block('ul', ...items);

const numberedList = (...items: LegacyElement[]): LegacyElement => block('ol', ...items);

const textItem = (text: string): LegacyElement => listItem(listItemContent({ text }));

const IDENTITY: Expectation = { kind: 'identity' };

const CENSUS_ROWS: CensusRow[] = [
    {
        census: COMMENTS_CENSUS,
        row: 'Slate JSON array',
        stored: stringify([paragraph({ text: SAMPLE_TEXT })]),
        expected: IDENTITY,
    },
    {
        census: COMMENTS_CENSUS,
        row: 'Paragraph',
        stored: stringify([paragraph({ text: SAMPLE_TEXT })]),
        expected: IDENTITY,
    },
    {
        census: COMMENTS_CENSUS,
        row: 'align left',
        stored: stringify([alignedParagraph(LEFT_ALIGN, { text: SAMPLE_TEXT })]),
        expected: IDENTITY,
    },
    {
        census: COMMENTS_CENSUS,
        row: 'textStyle p',
        stored: stringify([
            alignedParagraph(
                LEFT_ALIGN,
                { text: FIRST_PART, textStyle: BODY_TEXT_STYLE },
                { text: SECOND_PART, textStyle: BODY_TEXT_STYLE },
            ),
        ]),
        expected: {
            kind: 'normalised',
            normalisation: 'text-style-p-leaf-merge',
            legacy: [alignedParagraph(LEFT_ALIGN, { text: SAMPLE_TEXT })],
        },
    },
    {
        census: COMMENTS_CENSUS,
        row: 'Mention',
        stored: stringify([paragraph(userMention())]),
        expected: {
            kind: 'normalised',
            normalisation: 'inline-edge-padding',
            legacy: [paragraph(EMPTY_TEXT, userMention(), EMPTY_TEXT)],
        },
    },
    {
        census: COMMENTS_CENSUS,
        row: 'Mention category user',
        stored: stringify([paragraph({ text: GREETING_TEXT }, userMention(), { text: FOLLOW_UP_TEXT })]),
        expected: IDENTITY,
    },
    {
        census: COMMENTS_CENSUS,
        row: 'More than one top-level block',
        stored: stringify([paragraph({ text: SAMPLE_TEXT }), paragraph({ text: OTHER_SAMPLE_TEXT })]),
        expected: IDENTITY,
    },
    {
        census: COMMENTS_CENSUS,
        row: 'Link a',
        stored: stringify([paragraph({ text: GREETING_TEXT }, anchor(SAME_TAB_TARGET), EMPTY_TEXT)]),
        expected: IDENTITY,
    },
    {
        census: COMMENTS_CENSUS,
        row: 'Link with target _blank',
        stored: stringify([paragraph({ text: GREETING_TEXT }, anchor(NEW_TAB_TARGET), EMPTY_TEXT)]),
        expected: IDENTITY,
    },
    {
        census: COMMENTS_CENSUS,
        row: 'Bold',
        stored: stringify([paragraph({ text: FIRST_PART }, { text: SECOND_PART, bold: true })]),
        expected: IDENTITY,
    },
    {
        census: COMMENTS_CENSUS,
        row: 'Emoji character in text',
        stored: stringify([paragraph({ text: EMOJI_TEXT })]),
        expected: IDENTITY,
    },
    {
        census: COMMENTS_CENSUS,
        row: 'List item content lic',
        stored: stringify([bulletList(textItem(SAMPLE_TEXT), textItem(OTHER_SAMPLE_TEXT))]),
        expected: IDENTITY,
    },
    {
        census: COMMENTS_CENSUS,
        row: 'Soft break',
        stored: stringify([paragraph({ text: SOFT_BREAK_TEXT })]),
        expected: IDENTITY,
    },
    {
        census: COMMENTS_CENSUS,
        row: 'Bullet list',
        stored: stringify([bulletList(textItem(SAMPLE_TEXT))]),
        expected: IDENTITY,
    },
    {
        census: COMMENTS_CENSUS,
        row: 'Italic',
        stored: stringify([paragraph({ text: FIRST_PART }, { text: SECOND_PART, italic: true })]),
        expected: IDENTITY,
    },
    {
        census: COMMENTS_CENSUS,
        row: 'Numbered list',
        stored: stringify([numberedList(textItem(SAMPLE_TEXT), textItem(OTHER_SAMPLE_TEXT))]),
        expected: IDENTITY,
    },
    {
        census: COMMENTS_CENSUS,
        row: 'Nested list',
        stored: stringify([
            bulletList(listItem(listItemContent({ text: SAMPLE_TEXT }), bulletList(textItem(OTHER_SAMPLE_TEXT)))),
        ]),
        expected: IDENTITY,
    },
    {
        census: COMMENTS_CENSUS,
        row: 'textStyle other than p',
        stored: stringify([paragraph({ text: SAMPLE_TEXT, textStyle: SYNTHETIC_OTHER_TEXT_STYLE })]),
        expected: {
            kind: 'approved-fallback',
            outcome: 'requires-review',
            diagnostics: [{ code: 'unknown-property', path: FIRST_LEAF_PATH }],
            document: OTHER_TEXT_STYLE_DOCUMENT,
            reason: OTHER_TEXT_STYLE_REASON,
        },
    },
    {
        census: COMMENTS_CENSUS,
        row: 'Element type outside the known set',
        stored: stringify([block(SYNTHETIC_UNKNOWN_ELEMENT_TYPE, { text: SAMPLE_TEXT })]),
        expected: {
            kind: 'approved-fallback',
            outcome: 'requires-review',
            diagnostics: [{ code: 'unknown-element', path: FIRST_BLOCK_PATH }],
            document: UNKNOWN_ELEMENT_DOCUMENT,
            reason: UNKNOWN_ELEMENT_REASON,
        },
    },
    {
        census: COMMENTS_CENSUS,
        row: 'Strikethrough',
        stored: stringify([paragraph({ text: FIRST_PART }, { text: SECOND_PART, strikethrough: true })]),
        expected: IDENTITY,
    },
    {
        census: COMMENTS_CENSUS,
        row: 'Underline',
        stored: stringify([paragraph({ text: FIRST_PART }, { text: SECOND_PART, underline: true })]),
        expected: IDENTITY,
    },
    {
        census: COMMENTS_CENSUS,
        row: 'align other than left',
        stored: stringify([alignedParagraph(CENTER_ALIGN, { text: SAMPLE_TEXT })]),
        expected: IDENTITY,
    },
    {
        census: COMMENTS_CENSUS,
        row: 'Inline code',
        stored: stringify([paragraph({ text: FIRST_PART }, { text: CODE_TEXT, code: true })]),
        expected: IDENTITY,
    },
    {
        census: COMMENTS_CENSUS,
        row: 'Empty document',
        stored: stringify([paragraph({ text: '' })]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'Slate JSON',
        stored: stringify([paragraph({ text: SAMPLE_TEXT })]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'Plain text',
        stored: PLAIN_TEXT_VALUE,
        expected: {
            kind: 'approved-fallback',
            outcome: 'unsupported',
            diagnostics: [{ code: 'html-value', path: DOCUMENT_PATH }],
            document: null,
            reason: PLAIN_TEXT_REASON,
        },
    },
    {
        census: THEME_CENSUS,
        row: 'Blank',
        stored: BLANK_VALUE,
        expected: {
            kind: 'approved-fallback',
            outcome: 'exact',
            diagnostics: [],
            document: EMPTY_DOCUMENT,
            reason: EMPTY_VALUE_REASON,
        },
    },
    {
        census: THEME_CENSUS,
        row: 'Null',
        stored: NULL_VALUE,
        expected: {
            kind: 'approved-fallback',
            outcome: 'exact',
            diagnostics: [],
            document: EMPTY_DOCUMENT,
            reason: EMPTY_VALUE_REASON,
        },
    },
    {
        census: THEME_CENSUS,
        row: 'Video key missing',
        stored: MISSING_VALUE,
        expected: {
            kind: 'approved-fallback',
            outcome: 'exact',
            diagnostics: [],
            document: EMPTY_DOCUMENT,
            reason: MISSING_KEY_REASON,
        },
    },
    {
        census: THEME_CENSUS,
        row: 'JSON scalar',
        stored: JSON_SCALAR_VALUE,
        expected: {
            kind: 'approved-fallback',
            outcome: 'invalid',
            diagnostics: [{ code: 'invalid-value', path: DOCUMENT_PATH }],
            document: null,
            reason: JSON_SCALAR_REASON,
        },
    },
    {
        census: THEME_CENSUS,
        row: 'HTML',
        stored: HTML_VALUE,
        expected: {
            kind: 'approved-fallback',
            outcome: 'unsupported',
            diagnostics: [{ code: 'html-value', path: DOCUMENT_PATH }],
            document: null,
            reason: HTML_REASON,
        },
    },
    {
        census: THEME_CENSUS,
        row: 'Footer column layout',
        stored: JSON.stringify([[paragraph({ text: SAMPLE_TEXT })], [paragraph({ text: OTHER_SAMPLE_TEXT })]]),
        expected: {
            kind: 'approved-fallback',
            outcome: 'invalid',
            diagnostics: [{ code: 'invalid-node', path: FIRST_BLOCK_PATH }],
            document: null,
            reason: COLUMN_LAYOUT_REASON,
        },
    },
    {
        census: THEME_CENSUS,
        row: 'Empty document',
        stored: stringify([paragraph({ text: '' })]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'Paragraph p',
        stored: stringify([paragraph({ text: SAMPLE_TEXT })]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'heading1',
        stored: stringify([block(HEADING1_STYLE, { text: SAMPLE_TEXT })]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'heading2',
        stored: stringify([block(HEADING2_STYLE, { text: SAMPLE_TEXT })]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'heading3',
        stored: stringify([block(HEADING3_STYLE, { text: SAMPLE_TEXT })]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'heading4',
        stored: stringify([block(HEADING4_STYLE, { text: SAMPLE_TEXT })]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'custom1',
        stored: stringify([block(CUSTOM1_STYLE, { text: SAMPLE_TEXT })]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'custom2',
        stored: stringify([block(CUSTOM2_STYLE, { text: SAMPLE_TEXT })]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'custom3',
        stored: stringify([block(CUSTOM3_STYLE, { text: SAMPLE_TEXT })]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'quote',
        stored: stringify([block(QUOTE_STYLE, { text: SAMPLE_TEXT })]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'imageTitle',
        stored: stringify([{ type: IMAGE_TITLE_STYLE, align: CENTER_ALIGN, children: [{ text: SAMPLE_TEXT }] }]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'imageCaption',
        stored: stringify([block(IMAGE_CAPTION_STYLE, { text: SAMPLE_TEXT })]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'Link a',
        stored: stringify([paragraph({ text: GREETING_TEXT }, anchor(SAME_TAB_TARGET), EMPTY_TEXT)]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'Link target _blank',
        stored: stringify([paragraph({ text: GREETING_TEXT }, anchor(NEW_TAB_TARGET), EMPTY_TEXT)]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'Button',
        stored: stringify([paragraph(button(PRIMARY_BUTTON_STYLE))]),
        expected: {
            kind: 'normalised',
            normalisation: 'inline-edge-padding',
            legacy: [paragraph(EMPTY_TEXT, button(PRIMARY_BUTTON_STYLE), EMPTY_TEXT)],
        },
    },
    {
        census: THEME_CENSUS,
        row: 'Button primary',
        stored: stringify([paragraph({ text: GREETING_TEXT }, button(PRIMARY_BUTTON_STYLE), EMPTY_TEXT)]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'Button secondary',
        stored: stringify([paragraph({ text: GREETING_TEXT }, button(SECONDARY_BUTTON_STYLE), EMPTY_TEXT)]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'Button tertiary',
        stored: stringify([paragraph({ text: GREETING_TEXT }, button(TERTIARY_BUTTON_STYLE), EMPTY_TEXT)]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'Bullet list',
        stored: stringify([bulletList(textItem(SAMPLE_TEXT), textItem(OTHER_SAMPLE_TEXT))]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'Numbered list',
        stored: stringify([numberedList(textItem(SAMPLE_TEXT), textItem(OTHER_SAMPLE_TEXT))]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'textStyle leaf p',
        stored: stringify([
            paragraph(
                { text: FIRST_PART, textStyle: BODY_TEXT_STYLE },
                { text: SECOND_PART, textStyle: BODY_TEXT_STYLE },
            ),
        ]),
        expected: {
            kind: 'normalised',
            normalisation: 'text-style-p-leaf-merge',
            legacy: [paragraph({ text: SAMPLE_TEXT })],
        },
    },
    {
        census: THEME_CENSUS,
        row: 'textStyle leaf heading1',
        stored: stringify([block(HEADING1_STYLE, { text: SAMPLE_TEXT, textStyle: HEADING1_STYLE })]),
        expected: {
            kind: 'normalised',
            normalisation: 'text-style-block-leaf-drop',
            legacy: [block(HEADING1_STYLE, { text: SAMPLE_TEXT })],
        },
    },
    {
        census: THEME_CENSUS,
        row: 'textStyle leaf heading2',
        stored: stringify([block(HEADING2_STYLE, { text: SAMPLE_TEXT, textStyle: HEADING2_STYLE })]),
        expected: {
            kind: 'normalised',
            normalisation: 'text-style-block-leaf-drop',
            legacy: [block(HEADING2_STYLE, { text: SAMPLE_TEXT })],
        },
    },
    {
        census: THEME_CENSUS,
        row: 'textStyle leaf heading3',
        stored: stringify([block(HEADING3_STYLE, { text: SAMPLE_TEXT, textStyle: HEADING3_STYLE })]),
        expected: {
            kind: 'normalised',
            normalisation: 'text-style-block-leaf-drop',
            legacy: [block(HEADING3_STYLE, { text: SAMPLE_TEXT })],
        },
    },
    {
        census: THEME_CENSUS,
        row: 'textStyle leaf heading4',
        stored: stringify([block(HEADING4_STYLE, { text: SAMPLE_TEXT, textStyle: HEADING4_STYLE })]),
        expected: {
            kind: 'normalised',
            normalisation: 'text-style-block-leaf-drop',
            legacy: [block(HEADING4_STYLE, { text: SAMPLE_TEXT })],
        },
    },
    {
        census: THEME_CENSUS,
        row: 'textStyle leaf custom1',
        stored: stringify([block(CUSTOM1_STYLE, { text: SAMPLE_TEXT, textStyle: CUSTOM1_STYLE })]),
        expected: {
            kind: 'normalised',
            normalisation: 'text-style-block-leaf-drop',
            legacy: [block(CUSTOM1_STYLE, { text: SAMPLE_TEXT })],
        },
    },
    {
        census: THEME_CENSUS,
        row: 'textStyle leaf custom2',
        stored: stringify([block(CUSTOM2_STYLE, { text: SAMPLE_TEXT, textStyle: CUSTOM2_STYLE })]),
        expected: {
            kind: 'normalised',
            normalisation: 'text-style-block-leaf-drop',
            legacy: [block(CUSTOM2_STYLE, { text: SAMPLE_TEXT })],
        },
    },
    {
        census: THEME_CENSUS,
        row: 'textStyle leaf custom3',
        stored: stringify([block(CUSTOM3_STYLE, { text: SAMPLE_TEXT, textStyle: CUSTOM3_STYLE })]),
        expected: {
            kind: 'normalised',
            normalisation: 'text-style-block-leaf-drop',
            legacy: [block(CUSTOM3_STYLE, { text: SAMPLE_TEXT })],
        },
    },
    {
        census: THEME_CENSUS,
        row: 'textStyle leaf quote',
        stored: stringify([block(QUOTE_STYLE, { text: SAMPLE_TEXT, textStyle: QUOTE_STYLE })]),
        expected: {
            kind: 'normalised',
            normalisation: 'text-style-block-leaf-drop',
            legacy: [block(QUOTE_STYLE, { text: SAMPLE_TEXT })],
        },
    },
    {
        census: THEME_CENSUS,
        row: 'textStyle leaf imageTitle',
        stored: stringify([block(IMAGE_TITLE_STYLE, { text: SAMPLE_TEXT, textStyle: IMAGE_TITLE_STYLE })]),
        expected: {
            kind: 'normalised',
            normalisation: 'text-style-block-leaf-drop',
            legacy: [block(IMAGE_TITLE_STYLE, { text: SAMPLE_TEXT })],
        },
    },
    {
        census: THEME_CENSUS,
        row: 'textStyle leaf imageCaption',
        stored: stringify([block(IMAGE_CAPTION_STYLE, { text: SAMPLE_TEXT, textStyle: IMAGE_CAPTION_STYLE })]),
        expected: {
            kind: 'normalised',
            normalisation: 'text-style-block-leaf-drop',
            legacy: [block(IMAGE_CAPTION_STYLE, { text: SAMPLE_TEXT })],
        },
    },
    {
        census: THEME_CENSUS,
        row: 'textStyle other value',
        stored: stringify([paragraph({ text: SAMPLE_TEXT, textStyle: SYNTHETIC_OTHER_TEXT_STYLE })]),
        expected: {
            kind: 'approved-fallback',
            outcome: 'requires-review',
            diagnostics: [{ code: 'unknown-property', path: FIRST_LEAF_PATH }],
            document: OTHER_TEXT_STYLE_DOCUMENT,
            reason: OTHER_TEXT_STYLE_REASON,
        },
    },
    {
        census: THEME_CENSUS,
        row: 'Element type outside the known set',
        stored: stringify([block(SYNTHETIC_UNKNOWN_ELEMENT_TYPE, { text: SAMPLE_TEXT })]),
        expected: {
            kind: 'approved-fallback',
            outcome: 'requires-review',
            diagnostics: [{ code: 'unknown-element', path: FIRST_BLOCK_PATH }],
            document: UNKNOWN_ELEMENT_DOCUMENT,
            reason: UNKNOWN_ELEMENT_REASON,
        },
    },
    {
        census: THEME_CENSUS,
        row: 'Bold',
        stored: stringify([paragraph({ text: FIRST_PART }, { text: SECOND_PART, bold: true })]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'Italic',
        stored: stringify([paragraph({ text: FIRST_PART }, { text: SECOND_PART, italic: true })]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'Underline',
        stored: stringify([paragraph({ text: FIRST_PART }, { text: SECOND_PART, underline: true })]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'Inline code',
        stored: stringify([paragraph({ text: FIRST_PART }, { text: CODE_TEXT, code: true })]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'Align left',
        stored: stringify([alignedParagraph(LEFT_ALIGN, { text: SAMPLE_TEXT })]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'Align center',
        stored: stringify([alignedParagraph(CENTER_ALIGN, { text: SAMPLE_TEXT })]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'Align right',
        stored: stringify([alignedParagraph(RIGHT_ALIGN, { text: SAMPLE_TEXT })]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'Align justify',
        stored: stringify([alignedParagraph(JUSTIFY_ALIGN, { text: SAMPLE_TEXT })]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'Align other value',
        stored: stringify([alignedParagraph(SYNTHETIC_OTHER_ALIGN, { text: SAMPLE_TEXT })]),
        expected: {
            kind: 'approved-fallback',
            outcome: 'requires-review',
            diagnostics: [{ code: 'unknown-property', path: FIRST_BLOCK_PATH }],
            document: OTHER_ALIGN_DOCUMENT,
            reason: OTHER_ALIGN_REASON,
        },
    },
    {
        census: THEME_CENSUS,
        row: 'Column break breakAfterColumn',
        stored: stringify([
            { type: LEGACY_PARAGRAPH_TYPE, breakAfterColumn: INACTIVE_COLUMN_BREAK, children: [{ text: SAMPLE_TEXT }] },
            paragraph({ text: OTHER_SAMPLE_TEXT }),
        ]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'Soft break',
        stored: stringify([paragraph({ text: SOFT_BREAK_TEXT })]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'Emoji character in text',
        stored: stringify([paragraph({ text: EMOJI_TEXT })]),
        expected: IDENTITY,
    },
    {
        census: THEME_CENSUS,
        row: 'u escape in JSON',
        stored: ESCAPED_TEXT_JSON,
        expected: IDENTITY,
    },
];

const convert = (stored: string | undefined): ConvertLegacyRichTextResult => {
    return convertLegacyRichText(stored, { resolveMention: resolveEveryMention });
};

const expectWrittenLegacy = (stored: string | undefined, legacy: unknown): void => {
    const converted = convert(stored);

    expect(converted.outcome).toBe('exact');
    if (converted.outcome !== 'exact') {
        return;
    }

    const written = toLegacyRichText(converted.document);
    expect(written.outcome).toBe('exact');
    if (written.outcome !== 'exact') {
        return;
    }

    expect(written.value).toStrictEqual(legacy);
};

const expectApprovedFallback = (stored: string | undefined, expected: ApprovedFallbackExpectation): void => {
    const converted = convert(stored);

    expect(converted.outcome).toBe(expected.outcome);
    expect(converted.diagnostics).toStrictEqual(expected.diagnostics);
    expect(converted.document).toStrictEqual(expected.document);
};

const listApprovedFallbacks = (rows: CensusRow[]): ApprovedFallbackSummary[] => {
    const summaries: ApprovedFallbackSummary[] = [];

    for (const { census, row, expected } of rows) {
        if (expected.kind === 'approved-fallback') {
            summaries.push({
                census,
                row,
                outcome: expected.outcome,
                diagnostics: expected.diagnostics,
                document: expected.document,
                reason: expected.reason,
            });
        }
    }

    return summaries;
};

const listNormalisedRows = (rows: CensusRow[]): NormalisedSummary[] => {
    const summaries: NormalisedSummary[] = [];

    for (const { census, row, expected } of rows) {
        if (expected.kind === 'normalised') {
            summaries.push({ census, row, normalisation: expected.normalisation });
        }
    }

    return summaries;
};

describe('legacy rich text round trips over the production census rows', () => {
    it.each(CENSUS_ROWS)('should round trip $row ($census)', ({ stored, expected }) => {
        switch (expected.kind) {
            case 'identity': {
                expect(stored).toBeDefined();
                if (stored === undefined) {
                    return;
                }

                const storedTree: unknown = JSON.parse(stored);
                expectWrittenLegacy(stored, storedTree);
                return;
            }
            case 'normalised':
                expectWrittenLegacy(stored, expected.legacy);
                return;
            case 'approved-fallback':
                expectApprovedFallback(stored, expected);
                return;
            default: {
                // Stops a new kind from passing with no assertion.
                const unhandled: never = expected;
                throw new Error(`Unhandled expectation: ${JSON.stringify(unhandled)}`);
            }
        }
    });

    it('should store the escaped text row with a JSON unicode escape', () => {
        expect(ESCAPED_TEXT_JSON).toContain(JSON_UNICODE_ESCAPE);
    });

    it('should list exactly the rows that are approved fallbacks', () => {
        expect(listApprovedFallbacks(CENSUS_ROWS)).toStrictEqual([
            {
                census: COMMENTS_CENSUS,
                row: 'textStyle other than p',
                outcome: 'requires-review',
                diagnostics: [{ code: 'unknown-property', path: FIRST_LEAF_PATH }],
                document: OTHER_TEXT_STYLE_DOCUMENT,
                reason: OTHER_TEXT_STYLE_REASON,
            },
            {
                census: COMMENTS_CENSUS,
                row: 'Element type outside the known set',
                outcome: 'requires-review',
                diagnostics: [{ code: 'unknown-element', path: FIRST_BLOCK_PATH }],
                document: UNKNOWN_ELEMENT_DOCUMENT,
                reason: UNKNOWN_ELEMENT_REASON,
            },
            {
                census: THEME_CENSUS,
                row: 'Plain text',
                outcome: 'unsupported',
                diagnostics: [{ code: 'html-value', path: DOCUMENT_PATH }],
                document: null,
                reason: PLAIN_TEXT_REASON,
            },
            {
                census: THEME_CENSUS,
                row: 'Blank',
                outcome: 'exact',
                diagnostics: [],
                document: EMPTY_DOCUMENT,
                reason: EMPTY_VALUE_REASON,
            },
            {
                census: THEME_CENSUS,
                row: 'Null',
                outcome: 'exact',
                diagnostics: [],
                document: EMPTY_DOCUMENT,
                reason: EMPTY_VALUE_REASON,
            },
            {
                census: THEME_CENSUS,
                row: 'Video key missing',
                outcome: 'exact',
                diagnostics: [],
                document: EMPTY_DOCUMENT,
                reason: MISSING_KEY_REASON,
            },
            {
                census: THEME_CENSUS,
                row: 'JSON scalar',
                outcome: 'invalid',
                diagnostics: [{ code: 'invalid-value', path: DOCUMENT_PATH }],
                document: null,
                reason: JSON_SCALAR_REASON,
            },
            {
                census: THEME_CENSUS,
                row: 'HTML',
                outcome: 'unsupported',
                diagnostics: [{ code: 'html-value', path: DOCUMENT_PATH }],
                document: null,
                reason: HTML_REASON,
            },
            {
                census: THEME_CENSUS,
                row: 'Footer column layout',
                outcome: 'invalid',
                diagnostics: [{ code: 'invalid-node', path: FIRST_BLOCK_PATH }],
                document: null,
                reason: COLUMN_LAYOUT_REASON,
            },
            {
                census: THEME_CENSUS,
                row: 'textStyle other value',
                outcome: 'requires-review',
                diagnostics: [{ code: 'unknown-property', path: FIRST_LEAF_PATH }],
                document: OTHER_TEXT_STYLE_DOCUMENT,
                reason: OTHER_TEXT_STYLE_REASON,
            },
            {
                census: THEME_CENSUS,
                row: 'Element type outside the known set',
                outcome: 'requires-review',
                diagnostics: [{ code: 'unknown-element', path: FIRST_BLOCK_PATH }],
                document: UNKNOWN_ELEMENT_DOCUMENT,
                reason: UNKNOWN_ELEMENT_REASON,
            },
            {
                census: THEME_CENSUS,
                row: 'Align other value',
                outcome: 'requires-review',
                diagnostics: [{ code: 'unknown-property', path: FIRST_BLOCK_PATH }],
                document: OTHER_ALIGN_DOCUMENT,
                reason: OTHER_ALIGN_REASON,
            },
        ]);
    });

    it('should list exactly the rows that are written in a normal form of their own', () => {
        expect(listNormalisedRows(CENSUS_ROWS)).toStrictEqual([
            { census: COMMENTS_CENSUS, row: 'textStyle p', normalisation: 'text-style-p-leaf-merge' },
            { census: COMMENTS_CENSUS, row: 'Mention', normalisation: 'inline-edge-padding' },
            { census: THEME_CENSUS, row: 'Button', normalisation: 'inline-edge-padding' },
            { census: THEME_CENSUS, row: 'textStyle leaf p', normalisation: 'text-style-p-leaf-merge' },
            { census: THEME_CENSUS, row: 'textStyle leaf heading1', normalisation: 'text-style-block-leaf-drop' },
            { census: THEME_CENSUS, row: 'textStyle leaf heading2', normalisation: 'text-style-block-leaf-drop' },
            { census: THEME_CENSUS, row: 'textStyle leaf heading3', normalisation: 'text-style-block-leaf-drop' },
            { census: THEME_CENSUS, row: 'textStyle leaf heading4', normalisation: 'text-style-block-leaf-drop' },
            { census: THEME_CENSUS, row: 'textStyle leaf custom1', normalisation: 'text-style-block-leaf-drop' },
            { census: THEME_CENSUS, row: 'textStyle leaf custom2', normalisation: 'text-style-block-leaf-drop' },
            { census: THEME_CENSUS, row: 'textStyle leaf custom3', normalisation: 'text-style-block-leaf-drop' },
            { census: THEME_CENSUS, row: 'textStyle leaf quote', normalisation: 'text-style-block-leaf-drop' },
            { census: THEME_CENSUS, row: 'textStyle leaf imageTitle', normalisation: 'text-style-block-leaf-drop' },
            { census: THEME_CENSUS, row: 'textStyle leaf imageCaption', normalisation: 'text-style-block-leaf-drop' },
        ]);
    });
});
