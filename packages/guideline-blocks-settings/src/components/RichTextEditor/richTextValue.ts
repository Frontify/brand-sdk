/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type RtePlugin, type RteDocument, parseHtml } from '@frontify/fondue/rich-text-editor';

import {
    type LegacyRichTextDiagnostic,
    type LegacyRichTextNotReversibleCode,
    type LegacyRichTextUnsupportedCode,
    type MentionText,
    type OpenRichTextDocument,
    convertLegacyRichText,
    toLegacyPlainText,
    toLegacyRichText,
} from '../../helpers/legacyRichText';

type StructuralNode = RtePlugin.BlockNode | RtePlugin.InlineNode;

type DeclaredBlock = {
    holdsText: boolean;
    attributes: readonly string[];
};

type DeclaredContent = {
    blocks: Map<string, DeclaredBlock>;
    marks: Set<string>;
    inlines: Set<string>;
    blockAttributes: Set<string>;
};

export type StoredRichText =
    | { access: 'editable'; document: RteDocument }
    | { access: 'readonly'; document: OpenRichTextDocument }
    | { access: 'unreadable' };

export type WrittenRichText =
    | { outcome: 'written'; value: string }
    | { outcome: 'unchanged' }
    | { outcome: 'not-reversible'; diagnostics: LegacyRichTextDiagnostic<LegacyRichTextNotReversibleCode>[] };

const PLAIN_TEXT_LINE_BREAK = '\n';
const NO_LEGACY_FORM_CODE: LegacyRichTextNotReversibleCode = 'no-legacy-form';
const TEXT_KEY = 'text';
const PARAGRAPH_TYPE = 'paragraph';
const TYPE_KEY = 'type';
const CHILDREN_KEY = 'children';

// Block presets never offered mentions, and the legacy display showed no text for them.
const NO_MENTION_TEXT: MentionText = () => '';

const collectDeclaredContent = (plugins: readonly RtePlugin[]): DeclaredContent => {
    const declared: DeclaredContent = {
        // No plugin declares the paragraph: the editor has it built in.
        blocks: new Map([[PARAGRAPH_TYPE, { holdsText: true, attributes: [] }]]),
        marks: new Set(),
        inlines: new Set(),
        blockAttributes: new Set(),
    };

    for (const plugin of plugins) {
        const { content } = plugin;
        if (content === undefined) {
            continue;
        }

        for (const [type, definition] of Object.entries(content.blocks ?? {})) {
            declared.blocks.set(type, {
                holdsText: definition.content === 'text',
                attributes: Object.keys(definition.defaults ?? {}),
            });
        }

        for (const mark of Object.keys(content.marks ?? {})) {
            declared.marks.add(mark);
        }

        for (const inline of Object.keys(content.inlines ?? {})) {
            declared.inlines.add(inline);
        }

        for (const attribute of Object.keys(content.blockAttributes ?? {})) {
            declared.blockAttributes.add(attribute);
        }
    }

    return declared;
};

const isTextRun = (node: StructuralNode): boolean => 'text' in node && typeof node.text === 'string';

const isStructuralNode = (value: unknown): value is StructuralNode => typeof value === 'object' && value !== null;

const childrenOf = (node: StructuralNode): readonly StructuralNode[] | null => {
    const { children } = node;
    if (children === undefined) {
        return [];
    }

    if (!Array.isArray(children)) {
        return null;
    }

    const nodes: unknown[] = children;
    if (nodes.every(isStructuralNode)) {
        return nodes;
    }

    return null;
};

const isTextRunCovered = (run: StructuralNode, declared: DeclaredContent): boolean => {
    for (const key of Object.keys(run)) {
        if (key !== TEXT_KEY && !declared.marks.has(key)) {
            return false;
        }
    }

    return true;
};

const isInlineCovered = (child: StructuralNode, declared: DeclaredContent): boolean => {
    if (isTextRun(child)) {
        return isTextRunCovered(child, declared);
    }

    return typeof child.type === 'string' && declared.inlines.has(child.type);
};

const areAttributesCovered = (block: StructuralNode, definition: DeclaredBlock, declared: DeclaredContent) => {
    for (const key of Object.keys(block)) {
        if (key === TYPE_KEY || key === CHILDREN_KEY) {
            continue;
        }

        if (!definition.attributes.includes(key) && !declared.blockAttributes.has(key)) {
            return false;
        }
    }

    return true;
};

const isBlockCovered = (block: StructuralNode, declared: DeclaredContent): boolean => {
    if (typeof block.type !== 'string') {
        return false;
    }

    const definition = declared.blocks.get(block.type);
    if (definition === undefined || !areAttributesCovered(block, definition, declared)) {
        return false;
    }

    const children = childrenOf(block);
    if (children === null) {
        return false;
    }

    for (const child of children) {
        if (definition.holdsText) {
            if (!isInlineCovered(child, declared)) {
                return false;
            }
        } else if (isTextRun(child) || !isBlockCovered(child, declared)) {
            return false;
        }
    }

    return true;
};

const isCoveredBy = (document: OpenRichTextDocument, plugins: readonly RtePlugin[]): boolean => {
    const declared = collectDeclaredContent(plugins);

    for (const block of document.blocks) {
        if (!isBlockCovered(block, declared)) {
            return false;
        }
    }

    return true;
};

const hasUndeclaredInline = (child: StructuralNode, declared: DeclaredContent): boolean => {
    if (isTextRun(child)) {
        return false;
    }

    return typeof child.type !== 'string' || !declared.inlines.has(child.type);
};

const hasUndeclaredBlock = (block: StructuralNode, declared: DeclaredContent): boolean => {
    if (typeof block.type !== 'string') {
        return true;
    }

    const definition = declared.blocks.get(block.type);
    const children = childrenOf(block);
    if (children === null) {
        return true;
    }

    // The renderer skips an unregistered block; one without content (a column break) loses no text.
    if (definition === undefined) {
        return children.length > 0;
    }

    for (const child of children) {
        if (definition.holdsText) {
            if (hasUndeclaredInline(child, declared)) {
                return true;
            }
        } else if (isTextRun(child) || hasUndeclaredBlock(child, declared)) {
            return true;
        }
    }

    return false;
};

// The renderer draws a node no plugin declares as nothing, so its text would vanish from the view.
const hasUndeclaredNode = (document: OpenRichTextDocument, declared: DeclaredContent): boolean => {
    for (const block of document.blocks) {
        if (hasUndeclaredBlock(block, declared)) {
            return true;
        }
    }

    return false;
};

const readHtmlValue = (value: string, plugins: readonly RtePlugin[]): StoredRichText => {
    return { access: 'readonly', document: parseHtml(value, { plugins }) };
};

const readLegacyPlainText = (value: string, plugins: readonly RtePlugin[]): StoredRichText => {
    const plain = toLegacyPlainText(value, { mentionText: NO_MENTION_TEXT });
    if (plain.status === 'no-legacy-tree') {
        return readHtmlValue(value, plugins);
    }

    const blocks: OpenRichTextDocument['blocks'] = [];
    for (const line of plain.text.split(PLAIN_TEXT_LINE_BREAK)) {
        blocks.push({ type: PARAGRAPH_TYPE, children: [{ text: line }] });
    }

    return { access: 'readonly', document: { version: 1, blocks } };
};

const readUnsupportedValue = (
    value: string | undefined,
    code: LegacyRichTextUnsupportedCode | undefined,
    plugins: readonly RtePlugin[],
): StoredRichText => {
    if (value === undefined || code === undefined) {
        return { access: 'unreadable' };
    }

    switch (code) {
        case 'html-value':
            return readHtmlValue(value, plugins);
        case 'reserved-type':
        case 'limit-exceeded':
            return readLegacyPlainText(value, plugins);
    }
};

const readConvertedDocument = (
    value: string | undefined,
    document: OpenRichTextDocument,
    plugins: readonly RtePlugin[],
): StoredRichText => {
    if (value !== undefined && hasUndeclaredNode(document, collectDeclaredContent(plugins))) {
        return readLegacyPlainText(value, plugins);
    }

    return { access: 'readonly', document };
};

const readStoredValue = (value: string | undefined, plugins: readonly RtePlugin[]): StoredRichText => {
    const converted = convertLegacyRichText(value);

    switch (converted.outcome) {
        case 'exact':
            if (isCoveredBy(converted.document, plugins)) {
                return { access: 'editable', document: converted.document };
            }

            return readConvertedDocument(value, converted.document, plugins);
        case 'requires-review':
            return readConvertedDocument(value, converted.document, plugins);
        case 'unsupported': {
            const first: LegacyRichTextDiagnostic<LegacyRichTextUnsupportedCode> | undefined = converted.diagnostics[0];

            return readUnsupportedValue(value, first?.code, plugins);
        }
        case 'invalid':
            return { access: 'unreadable' };
    }
};

/**
 * Reads a stored legacy value for the editor: whether it can be edited without losing anything, only shown, or not read at all.
 */
export const readRichTextValue = (value: string | undefined, plugins: readonly RtePlugin[]): StoredRichText => {
    try {
        return readStoredValue(value, plugins);
    } catch (error) {
        // HTML nested deeper than the call stack allows; the legacy reader failed on it too and showed nothing.
        if (error instanceof RangeError) {
            return { access: 'unreadable' };
        }

        throw error;
    }
};

export const writeRichTextValue = (
    document: RteDocument,
    columns: number | undefined,
    previous: string | undefined,
    plugins: readonly RtePlugin[],
): WrittenRichText => {
    const converted = toLegacyRichText(document, { columns });

    switch (converted.outcome) {
        case 'exact': {
            const value = JSON.stringify(converted.value);
            // A value this editor cannot open for editing again must never be written.
            if (readRichTextValue(value, plugins).access !== 'editable') {
                return { outcome: 'not-reversible', diagnostics: [{ code: NO_LEGACY_FORM_CODE, path: [] }] };
            }

            if (value === previous) {
                return { outcome: 'unchanged' };
            }

            return { outcome: 'written', value };
        }
        case 'not-reversible':
            return { outcome: 'not-reversible', diagnostics: converted.diagnostics };
    }
};
