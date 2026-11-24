/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    type LegacyElement,
    type LegacyNode,
    type LegacyRichTextPath,
    type LegacyRichTextTree,
    type LegacyText,
} from './types';

const MAX_DOCUMENT_BYTES = 5 * 1024 * 1024;
const MAX_NODES = 50_000;
const MAX_DEPTH = 64;
const MAX_TEXT_LENGTH = 1_000_000;

const ONE_BYTE_LIMIT = 0x80;
const TWO_BYTE_LIMIT = 0x800;
const HIGH_SURROGATE_START = 0xd800;
const HIGH_SURROGATE_END = 0xdbff;
const LOW_SURROGATE_START = 0xdc00;
const LOW_SURROGATE_END = 0xdfff;

type TreeInspection =
    | { status: 'valid'; tree: LegacyRichTextTree }
    | { status: 'limit-exceeded' }
    | { status: 'invalid-node'; path: LegacyRichTextPath };

type PendingNode = { value: unknown; path: LegacyRichTextPath };

export const isLegacyText = (value: unknown): value is LegacyText => {
    return typeof value === 'object' && value !== null && 'text' in value && typeof value.text === 'string';
};

export const isLegacyElement = (value: unknown): value is LegacyElement => {
    return (
        typeof value === 'object' &&
        value !== null &&
        'type' in value &&
        typeof value.type === 'string' &&
        'children' in value &&
        Array.isArray(value.children)
    );
};

const isLegacyNode = (value: unknown): value is LegacyNode => {
    return isLegacyText(value) || isLegacyElement(value);
};

const isLowSurrogate = (code: number): boolean => {
    return code >= LOW_SURROGATE_START && code <= LOW_SURROGATE_END;
};

/** Counts UTF-8 bytes in one pass and stops at the first byte over the document limit. */
export const exceedsDocumentBytes = (value: string): boolean => {
    let bytes = 0;

    for (let index = 0; index < value.length; index++) {
        const code = value.charCodeAt(index);

        if (code < ONE_BYTE_LIMIT) {
            bytes += 1;
        } else if (code < TWO_BYTE_LIMIT) {
            bytes += 2;
        } else if (
            code >= HIGH_SURROGATE_START &&
            code <= HIGH_SURROGATE_END &&
            isLowSurrogate(value.charCodeAt(index + 1))
        ) {
            bytes += 4;
            index += 1;
        } else {
            bytes += 3;
        }

        if (bytes > MAX_DOCUMENT_BYTES) {
            return true;
        }
    }

    return false;
};

/**
 * Walks the raw tree without recursion, in document order. It stops at the first limit exceeded
 * or the first node that is not a text leaf or an element.
 */
export const inspectLegacyTree = (tree: unknown[]): TreeInspection => {
    if (tree.length > MAX_NODES) {
        return { status: 'limit-exceeded' };
    }

    const roots: LegacyRichTextTree = [];
    const pending: PendingNode[] = [];
    let discovered = tree.length;

    for (let index = tree.length - 1; index >= 0; index--) {
        pending.push({ value: tree[index], path: [index] });
    }

    while (pending.length > 0) {
        const next = pending.pop();
        if (next === undefined) {
            break;
        }

        const { value, path } = next;
        if (path.length > MAX_DEPTH) {
            return { status: 'limit-exceeded' };
        }

        if (!isLegacyNode(value)) {
            return { status: 'invalid-node', path };
        }

        if (isLegacyText(value)) {
            if (value.text.length > MAX_TEXT_LENGTH) {
                return { status: 'limit-exceeded' };
            }
        } else {
            discovered += value.children.length;
            if (discovered > MAX_NODES) {
                return { status: 'limit-exceeded' };
            }

            for (let index = value.children.length - 1; index >= 0; index--) {
                pending.push({ value: value.children[index], path: [...path, index] });
            }
        }

        if (path.length === 1) {
            roots.push(value);
        }
    }

    return { status: 'valid', tree: roots };
};
