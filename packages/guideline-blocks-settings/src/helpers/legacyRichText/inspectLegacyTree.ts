/* (c) Copyright Frontify Ltd., all rights reserved. */

import { isLegacyElement, isLegacyText } from './legacyNode';
import { MAX_DEPTH, MAX_NODES, MAX_TEXT_LENGTH } from './limits';
import { type LegacyNode, type LegacyRichTextPath, type LegacyRichTextTree } from './types';

type TreeInspection =
    | { status: 'valid'; tree: LegacyRichTextTree }
    | { status: 'limit-exceeded' }
    | { status: 'invalid-node'; path: LegacyRichTextPath };

type PendingNode = { value: unknown; path: LegacyRichTextPath };

const isLegacyNode = (value: unknown): value is LegacyNode => {
    return isLegacyText(value) || isLegacyElement(value);
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
