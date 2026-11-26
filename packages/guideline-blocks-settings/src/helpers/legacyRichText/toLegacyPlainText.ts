/* (c) Copyright Frontify Ltd., all rights reserved. */

import { isLegacyElement, isLegacyText } from './legacyNode';
import { parseStoredValue } from './readStoredValue';
import {
    type LegacyElement,
    type MentionText,
    type ToLegacyPlainTextOptions,
    type ToLegacyPlainTextResult,
} from './types';
import {
    LEGACY_CATEGORY_KEY,
    LEGACY_EMOJI_TYPE,
    LEGACY_ID_KEY,
    LEGACY_INLINE_TYPES,
    LEGACY_LINK_ELEMENT_TYPE,
    LEGACY_MENTION_TYPE,
    LINE_BREAK,
    readMentionKind,
} from './vocabulary';

// The comment editor keeps no text around a link element or an emoji, but their text still belongs to its line.
const SAME_LINE_ELEMENT_TYPES = [...LEGACY_INLINE_TYPES, LEGACY_LINK_ELEMENT_TYPE, LEGACY_EMOJI_TYPE];

type ElementReading = { kind: 'block' } | { kind: 'inline' } | { kind: 'mention'; text: string };

type WalkStep = { kind: 'node'; node: unknown } | { kind: 'end-block' };

type LineWriter = { lines: string[]; openLine: string | undefined };

const appendToLine = (writer: LineWriter, text: string): void => {
    writer.openLine = (writer.openLine ?? '') + text;
};

const endLine = (writer: LineWriter): void => {
    if (writer.openLine === undefined) {
        return;
    }

    writer.lines.push(writer.openLine);
    writer.openLine = undefined;
};

/** Reads an element as a block, an inline or a mention; a mention without a readable id or known category reads as an inline. */
const readElement = (element: LegacyElement, mentionText: MentionText): ElementReading => {
    if (!SAME_LINE_ELEMENT_TYPES.includes(element.type)) {
        return { kind: 'block' };
    }

    if (element.type === LEGACY_MENTION_TYPE) {
        const id = element[LEGACY_ID_KEY];
        const mentionKind = readMentionKind(element[LEGACY_CATEGORY_KEY]);

        if ((typeof id === 'string' || typeof id === 'number') && mentionKind.status === 'known') {
            return { kind: 'mention', text: mentionText(mentionKind.kind, String(id)) };
        }
    }

    return { kind: 'inline' };
};

const pushChildren = (steps: WalkStep[], children: unknown[]): void => {
    for (let index = children.length - 1; index >= 0; index--) {
        steps.push({ kind: 'node', node: children[index] });
    }
};

const readLines = (tree: unknown[], mentionText: MentionText): string[] => {
    const writer: LineWriter = { lines: [], openLine: undefined };
    const steps: WalkStep[] = [];
    pushChildren(steps, tree);

    for (let step = steps.pop(); step !== undefined; step = steps.pop()) {
        if (step.kind === 'end-block') {
            endLine(writer);
            continue;
        }

        if (isLegacyText(step.node)) {
            appendToLine(writer, step.node.text);
            continue;
        }

        if (!isLegacyElement(step.node)) {
            continue;
        }

        const reading = readElement(step.node, mentionText);

        switch (reading.kind) {
            case 'block': {
                endLine(writer);
                steps.push({ kind: 'end-block' });
                pushChildren(steps, step.node.children);
                break;
            }
            case 'inline': {
                // An inline element opens a line even when it holds no text.
                appendToLine(writer, '');
                pushChildren(steps, step.node.children);
                break;
            }
            case 'mention': {
                appendToLine(writer, reading.text);
                break;
            }
        }
    }

    endLine(writer);

    return writer.lines;
};

/**
 * Reads a stored legacy value as plain text, one line per block, at any size.
 *
 * @example
 * const result = toLegacyPlainText(storedValue, { mentionText: (kind, id) => `@${id}` });
 * if (result.status === 'text') {
 *     console.log(result.text);
 * }
 */
export const toLegacyPlainText = (
    value: string | null | undefined,
    { mentionText }: ToLegacyPlainTextOptions,
): ToLegacyPlainTextResult => {
    const stored = parseStoredValue(value);

    switch (stored.kind) {
        case 'empty': {
            return { status: 'text', text: '' };
        }
        case 'legacyTree': {
            return { status: 'text', text: readLines(stored.tree, mentionText).join(LINE_BREAK) };
        }
        case 'html':
        case 'invalid': {
            return { status: 'no-legacy-tree' };
        }
    }
};
