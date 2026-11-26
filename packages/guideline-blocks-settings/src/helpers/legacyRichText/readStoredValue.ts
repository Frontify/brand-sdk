/* (c) Copyright Frontify Ltd., all rights reserved. */

import { exceedsDocumentBytes } from './limits';

const EMPTY_STORED_VALUES = ['', 'null', '<br />'];

export type StoredValue =
    | { kind: 'empty' }
    | { kind: 'oversized' }
    | { kind: 'legacyTree'; tree: unknown[] }
    | { kind: 'html' }
    | { kind: 'invalid' };

export type ParsedStoredValue = Exclude<StoredValue, { kind: 'oversized' }>;

const readParsedValue = (parsed: unknown): ParsedStoredValue => {
    if (parsed === null) {
        return { kind: 'empty' };
    }

    if (Array.isArray(parsed)) {
        return { kind: 'legacyTree', tree: parsed };
    }

    return { kind: 'invalid' };
};

/** Parses the stored string at any size. */
export const parseStoredValue = (value: string | null | undefined): ParsedStoredValue => {
    if (value === null || value === undefined || EMPTY_STORED_VALUES.includes(value)) {
        return { kind: 'empty' };
    }

    let parsed: unknown;
    try {
        parsed = JSON.parse(value);
    } catch (error) {
        if (error instanceof SyntaxError) {
            return { kind: 'html' };
        }

        throw error;
    }

    return readParsedValue(parsed);
};

/** Parses the stored string once, so the rest of the converter only switches on the kind. */
export const readStoredValue = (value: string | null | undefined): StoredValue => {
    if (typeof value === 'string' && exceedsDocumentBytes(value)) {
        return { kind: 'oversized' };
    }

    return parseStoredValue(value);
};
