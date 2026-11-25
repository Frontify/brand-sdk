/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type RtePlugin, type RteDocument, parseHtml } from '@frontify/fondue/rich-text-editor';

import {
    type LegacyRichTextDiagnostic,
    type LegacyRichTextNotReversibleCode,
    type OpenRichTextDocument,
    convertLegacyRichText,
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
    | { outcome: 'not-reversible'; diagnostics: LegacyRichTextDiagnostic<LegacyRichTextNotReversibleCode>[] };

const HTML_VALUE_CODE = 'html-value';
const TEXT_KEY = 'text';
const PARAGRAPH_TYPE = 'paragraph';
const TYPE_KEY = 'type';
const CHILDREN_KEY = 'children';

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

/**
 * Reads a stored legacy value for the editor: whether it can be edited without losing anything, only shown, or not read at all.
 */
export const readRichTextValue = (value: string | undefined, plugins: readonly RtePlugin[]): StoredRichText => {
    const converted = convertLegacyRichText(value);

    switch (converted.outcome) {
        case 'exact':
            if (isCoveredBy(converted.document, plugins)) {
                return { access: 'editable', document: converted.document };
            }

            return { access: 'readonly', document: converted.document };
        case 'requires-review':
            return { access: 'readonly', document: converted.document };
        case 'unsupported':
            if (value !== undefined && converted.diagnostics.some(({ code }) => code === HTML_VALUE_CODE)) {
                return { access: 'readonly', document: parseHtml(value, { plugins }) };
            }

            return { access: 'unreadable' };
        case 'invalid':
            return { access: 'unreadable' };
    }
};

export const writeRichTextValue = (document: RteDocument, columns: number | undefined): WrittenRichText => {
    const converted = toLegacyRichText(document, { columns });

    switch (converted.outcome) {
        case 'exact':
            return { outcome: 'written', value: JSON.stringify(converted.value) };
        case 'not-reversible':
            return { outcome: 'not-reversible', diagnostics: converted.diagnostics };
    }
};
