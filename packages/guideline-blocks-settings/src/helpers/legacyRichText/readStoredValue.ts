/* (c) Copyright Frontify Ltd., all rights reserved. */

import { exceedsDocumentBytes } from './inspectLegacyTree';

const EMPTY_STORED_VALUES = ['', 'null', '<br />'];

export type StoredValue =
    | { kind: 'empty' }
    | { kind: 'oversized' }
    | { kind: 'legacyTree'; tree: unknown[] }
    | { kind: 'html' }
    | { kind: 'invalid' };

const readParsedValue = (parsed: unknown): StoredValue => {
    if (parsed === null) {
        return { kind: 'empty' };
    }

    if (Array.isArray(parsed)) {
        return { kind: 'legacyTree', tree: parsed };
    }

    return { kind: 'invalid' };
};

/** Parses the stored string once, so the rest of the converter only switches on the kind. */
export const readStoredValue = (value: string | null | undefined): StoredValue => {
    if (value === null || value === undefined || EMPTY_STORED_VALUES.includes(value)) {
        return { kind: 'empty' };
    }

    if (exceedsDocumentBytes(value)) {
        return { kind: 'oversized' };
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
