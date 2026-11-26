/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    type MentionInline,
    type NewFormatBlockType,
    type NewFormatInlineType,
    type RteText,
    type TextStyleName,
} from './types';

export const LEGACY_PARAGRAPH_TYPE = 'p';
export const LEGACY_QUOTE_TYPE = 'quote';
export const LEGACY_LIST_ITEM_PARAGRAPH_TYPE = 'lic';
export const LEGACY_LIST_ITEM_TYPE = 'li';
export const LEGACY_BULLET_LIST_TYPE = 'ul';
export const LEGACY_NUMBERED_LIST_TYPE = 'ol';
export const LEGACY_LINK_TYPE = 'a';
export const LEGACY_BUTTON_TYPE = 'button';
export const LEGACY_MENTION_TYPE = 'mention';
export const LEGACY_CHECKBOX_ITEM_TYPE = 'checkbox-item';

export const LEGACY_ALIGN_KEY = 'align';
export const LEGACY_URL_KEY = 'url';
export const LEGACY_TARGET_KEY = 'target';
export const LEGACY_CHOSEN_LINK_KEY = 'chosenLink';
export const LEGACY_BUTTON_STYLE_KEY = 'buttonStyle';
export const LEGACY_VALUE_KEY = 'value';
export const LEGACY_CATEGORY_KEY = 'category';
export const LEGACY_ID_KEY = 'id';
export const LEGACY_INDENT_KEY = 'indent';
export const LEGACY_CHECKED_KEY = 'checked';
export const LEGACY_BREAK_AFTER_COLUMN_KEY = 'breakAfterColumn';
export const LEGACY_COLOR_KEY = 'color';
export const LEGACY_TEXT_STYLE_KEY = 'textStyle';

export const LINE_BREAK = '\n';
export const MIN_CHECK_LEVEL = 1;

export const TEXT_MARK_KEYS = [
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'code',
    'subscript',
    'superscript',
] satisfies readonly (keyof RteText)[];

// Every text style the new format has; a release that adds one fails typecheck here.
const TEXT_STYLE_NAMES: Record<TextStyleName, true> = {
    heading1: true,
    heading2: true,
    heading3: true,
    heading4: true,
    custom1: true,
    custom2: true,
    custom3: true,
    imageTitle: true,
    imageCaption: true,
};

// Every block type the new format has; a release that adds or renames one fails typecheck here.
const NEW_FORMAT_BLOCK_TYPES: Record<NewFormatBlockType, true> = {
    paragraph: true,
    textStyle: true,
    quote: true,
    columnBreak: true,
    bulletList: true,
    numberedList: true,
    listItem: true,
    checkList: true,
    checkItem: true,
    table: true,
    tableRow: true,
    tableCell: true,
    tableHeader: true,
};

// Every inline type the new format has; a release that adds or renames one fails typecheck here.
const NEW_FORMAT_INLINE_TYPES: Record<NewFormatInlineType, true> = {
    break: true,
    mention: true,
};

type LegacyMentionCategory = 'user' | 'group' | 'all';
type MentionKindReading = { status: 'known'; kind: MentionInline['kind'] } | { status: 'unknown' };

// A person has no kind in the new format, as in documents written before kinds existed.
const KIND_BY_LEGACY_CATEGORY: Record<LegacyMentionCategory, MentionInline['kind']> = {
    user: undefined,
    group: 'group',
    all: 'all',
};

export type ColumnBreakValue = 'active' | 'inactive';

export const ACTIVE_COLUMN_BREAK: ColumnBreakValue = 'active';
export const INACTIVE_COLUMN_BREAK: ColumnBreakValue = 'inactive';

const COLUMN_BREAK_VALUES: readonly ColumnBreakValue[] = [ACTIVE_COLUMN_BREAK, INACTIVE_COLUMN_BREAK];

export const isColumnBreakValue = (value: unknown): value is ColumnBreakValue => {
    return COLUMN_BREAK_VALUES.some((candidate) => candidate === value);
};

export const isTextStyleName = (type: string): type is TextStyleName => {
    return Object.keys(TEXT_STYLE_NAMES).includes(type);
};

/** A type the new format declares, so a node of it kept whole would be read as a real node of that type. */
export const isReservedType = (type: string): boolean => {
    return isNewFormatBlockType(type) || Object.keys(NEW_FORMAT_INLINE_TYPES).includes(type);
};

export const isNewFormatBlockType = (type: string): boolean => {
    return Object.keys(NEW_FORMAT_BLOCK_TYPES).includes(type);
};

const isLegacyMentionCategory = (value: string): value is LegacyMentionCategory => {
    return Object.keys(KIND_BY_LEGACY_CATEGORY).includes(value);
};

/** Reads a legacy mention `category` as the new format's kind; a person has no kind. */
export const readMentionKind = (category: unknown): MentionKindReading => {
    if (typeof category !== 'string' || !isLegacyMentionCategory(category)) {
        return { status: 'unknown' };
    }

    return { status: 'known', kind: KIND_BY_LEGACY_CATEGORY[category] };
};

/** Writes the legacy mention `category` of a new-format kind, or undefined when the table has none for it. */
export const writeMentionCategory = (kind: unknown): LegacyMentionCategory | undefined => {
    for (const category of Object.keys(KIND_BY_LEGACY_CATEGORY)) {
        if (isLegacyMentionCategory(category) && KIND_BY_LEGACY_CATEGORY[category] === kind) {
            return category;
        }
    }

    // The new format also allows the kind to name a person explicitly, which is the category of the same name.
    if (typeof kind === 'string' && isLegacyMentionCategory(kind)) {
        return kind;
    }

    return undefined;
};
