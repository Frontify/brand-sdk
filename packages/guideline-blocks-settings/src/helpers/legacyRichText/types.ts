/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type RteBlock, type RteDocument, type parseHtml } from '@frontify/fondue/rich-text-editor';

export type ParagraphBlock = Extract<RteBlock, { type: 'paragraph' }>;
export type TextStyleBlock = Extract<RteBlock, { type: 'textStyle' }>;
export type QuoteBlock = Extract<RteBlock, { type: 'quote' }>;
export type OfficialInline = ParagraphBlock['children'][number];
export type RteText = Extract<OfficialInline, { text: string }>;
export type MentionInline = Extract<OfficialInline, { type: 'mention' }>;
export type MentionKind = NonNullable<MentionInline['kind']>;
export type LinkValue = NonNullable<RteText['link']>;
export type LinkAppearance = Extract<LinkValue, { appearance: unknown }>['appearance'];
export type Alignment = NonNullable<ParagraphBlock['align']>;
export type TextStyleName = TextStyleBlock['style'];
type ListBlock = Extract<RteBlock, { type: 'bulletList' }>;
type CheckListBlock = Extract<RteBlock, { type: 'checkList' }>;
type TableBlock = Extract<RteBlock, { type: 'table' }>;
type TableRowBlock = TableBlock['children'][number];

/** Every block type of the new format: the top-level ones and the ones nested in lists and tables. */
/** Every inline type of the new format that is not a text run. */
export type NewFormatInlineType = Extract<OfficialInline, { type: string }>['type'];

export type NewFormatBlockType =
    | RteBlock['type']
    | ListBlock['children'][number]['type']
    | CheckListBlock['children'][number]['type']
    | TableRowBlock['type']
    | TableRowBlock['children'][number]['type'];

export type OpenRichTextDocument = ReturnType<typeof parseHtml>;
export type OpenBlock = OpenRichTextDocument['blocks'][number];
export type OpenInline = NonNullable<OpenBlock['children']>[number];

export type LegacyText = { text: string; [property: string]: unknown };
export type LegacyElement = { type: string; children: LegacyNode[]; [property: string]: unknown };
export type LegacyNode = LegacyElement | LegacyText;
export type LegacyRichTextTree = LegacyNode[];

/** Child indexes from the root array, the same shape as a Slate path. */
export type LegacyRichTextPath = readonly number[];

export type LegacyRichTextReviewCode =
    | 'indent-jump'
    | 'link-unsafe'
    | 'link-conflict'
    | 'button-style-unknown'
    | 'mention-unresolved'
    | 'excluded-marks'
    | 'color-unparsed'
    | 'unknown-element'
    | 'unknown-property';
export type LegacyRichTextUnsupportedCode = 'limit-exceeded' | 'html-value' | 'reserved-type';
export type LegacyRichTextInvalidCode = 'invalid-value' | 'invalid-node';
export type LegacyRichTextNotReversibleCode = 'no-legacy-form';

/** A finding about the input. It holds a code and a path only, never content from the source. */
export type LegacyRichTextDiagnostic<TCode> = { code: TCode; path: LegacyRichTextPath };
export type LegacyRichTextReviewDiagnostic = LegacyRichTextDiagnostic<LegacyRichTextReviewCode>;

export type MentionLookup = ({ status: 'resolved' } & Pick<MentionInline, 'username' | 'name'>) | { status: 'unknown' };
export type ResolveMention = (kind: MentionInline['kind'], id: string) => MentionLookup;

export type ConvertLegacyRichTextOptions = {
    /** Looks up a mention's display names. Unknown or absent: empty names and a mention-unresolved review. */
    resolveMention?: ResolveMention;
};

export type ConvertLegacyRichTextResult =
    | { outcome: 'exact'; document: RteDocument; diagnostics: [] }
    | {
          outcome: 'requires-review';
          document: OpenRichTextDocument;
          diagnostics: [LegacyRichTextReviewDiagnostic, ...LegacyRichTextReviewDiagnostic[]];
      }
    | {
          outcome: 'unsupported';
          document: null;
          diagnostics: LegacyRichTextDiagnostic<LegacyRichTextUnsupportedCode>[];
      }
    | { outcome: 'invalid'; document: null; diagnostics: LegacyRichTextDiagnostic<LegacyRichTextInvalidCode>[] };

export type ToLegacyRichTextOptions = {
    /**
     * Column count of the legacy editor; the first `columns - 1` column breaks are active.
     * @default 1
     */
    columns?: number;
};

export type ToLegacyRichTextResult =
    | { outcome: 'exact'; value: LegacyRichTextTree; diagnostics: [] }
    | {
          outcome: 'not-reversible';
          value: null;
          diagnostics: LegacyRichTextDiagnostic<LegacyRichTextNotReversibleCode>[];
      };
