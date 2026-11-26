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

const readStoredValue = (value: string | undefined, plugins: readonly RtePlugin[]): StoredRichText => {
    const converted = convertLegacyRichText(value);

    switch (converted.outcome) {
        case 'exact':
            if (isCoveredBy(converted.document, plugins)) {
                return { access: 'editable', document: converted.document };
            }

            return { access: 'readonly', document: converted.document };
        case 'requires-review':
            return { access: 'readonly', document: converted.document };
        case 'unsupported': {
            const first: LegacyRichTextDiagnostic<LegacyRichTextUnsupportedCode> | undefined = converted.diagnostics[0];

            return readUnsupportedValue(value, first?.code, plugins);
        }
        case 'invalid':
            return { access: 'unreadable' };
    }
};

const isInlineShape = (node: StructuralNode): node is RtePlugin.InlineNode =>
    isTextRun(node) || typeof node.type === 'string';

const isBlockShape = (node: StructuralNode): node is RtePlugin.BlockNode => typeof node.type === 'string';

// Recursion is bounded by the converter's nesting limit.
const withoutUndeclaredInlines = (
    children: readonly StructuralNode[],
    declared: DeclaredContent,
): RtePlugin.InlineNode[] => {
    const inlines: RtePlugin.InlineNode[] = [];

    for (const child of children) {
        if (!isInlineShape(child)) {
            continue;
        }

        if (isTextRun(child) || (child.type !== undefined && declared.inlines.has(child.type))) {
            inlines.push(child);
            continue;
        }

        inlines.push(...withoutUndeclaredInlines(childrenOf(child) ?? [], declared));
    }

    return inlines;
};

function toDisplayBlocks(block: RtePlugin.BlockNode, declared: DeclaredContent): RtePlugin.BlockNode[] {
    const children = childrenOf(block);
    if (children === null) {
        return [];
    }

    const definition = declared.blocks.get(block.type);
    if (definition === undefined) {
        return toUndeclaredDisplayBlocks(children, declared);
    }

    if (definition.holdsText) {
        return [{ ...block, children: withoutUndeclaredInlines(children, declared) }];
    }

    return [{ ...block, children: toDisplayBlockList(children, declared) }];
}

function toDisplayBlockList(nodes: readonly StructuralNode[], declared: DeclaredContent): RtePlugin.BlockNode[] {
    const blocks: RtePlugin.BlockNode[] = [];

    for (const node of nodes) {
        if (isBlockShape(node)) {
            blocks.push(...toDisplayBlocks(node, declared));
        }
    }

    return blocks;
}

// The renderer skips an undeclared block and runs its content together, so a paragraph or its blocks stand in for it.
// Slate keeps a text leaf beside every inline, so an undeclared block without one holds blocks.
function toUndeclaredDisplayBlocks(
    children: readonly StructuralNode[],
    declared: DeclaredContent,
): RtePlugin.BlockNode[] {
    if (children.some(isTextRun)) {
        return [{ type: PARAGRAPH_TYPE, children: withoutUndeclaredInlines(children, declared) }];
    }

    return toDisplayBlockList(children, declared);
}

/**
 * The renderer drops an inline whose plugin is missing, with its text. A display copy keeps that text; never write it back.
 */
const toDisplayDocument = (document: OpenRichTextDocument, plugins: readonly RtePlugin[]): OpenRichTextDocument => {
    const declared = collectDeclaredContent(plugins);

    return { ...document, blocks: toDisplayBlockList(document.blocks, declared) };
};

/**
 * Reads a stored legacy value for the editor: whether it can be edited without losing anything, only shown, or not read at all.
 */
export const readRichTextValue = (value: string | undefined, plugins: readonly RtePlugin[]): StoredRichText => {
    const stored = readStoredValue(value, plugins);
    if (stored.access === 'readonly') {
        return { access: 'readonly', document: toDisplayDocument(stored.document, plugins) };
    }

    return stored;
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
