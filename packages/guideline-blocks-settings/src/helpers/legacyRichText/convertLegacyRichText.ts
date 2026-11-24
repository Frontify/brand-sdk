/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type RteDocument } from '@frontify/fondue/rich-text-editor';

import { fromLegacyTree } from './fromLegacyTree';
import { inspectLegacyTree } from './inspectLegacyTree';
import { readStoredValue } from './readStoredValue';
import { type ConvertLegacyRichTextOptions, type ConvertLegacyRichTextResult, type LegacyRichTextPath } from './types';

const DOCUMENT_PATH: LegacyRichTextPath = [];

/**
 * Converts a stored legacy rich text value to a document of the new format, or says why it cannot.
 * It never throws and gives the same result for the same input.
 *
 * @example
 * const result = convertLegacyRichText(storedValue);
 * if (result.outcome === 'exact') {
 *     save(result.document);
 * }
 */
export const convertLegacyRichText = (
    value: string | null | undefined,
    options: ConvertLegacyRichTextOptions = {},
): ConvertLegacyRichTextResult => {
    const stored = readStoredValue(value);

    switch (stored.kind) {
        case 'empty':
            return { outcome: 'exact', document: { version: 1, blocks: [] }, diagnostics: [] };
        case 'oversized':
            return {
                outcome: 'unsupported',
                document: null,
                diagnostics: [{ code: 'limit-exceeded', path: DOCUMENT_PATH }],
            };
        case 'html':
            return {
                outcome: 'unsupported',
                document: null,
                diagnostics: [{ code: 'html-value', path: DOCUMENT_PATH }],
            };
        case 'invalid':
            return {
                outcome: 'invalid',
                document: null,
                diagnostics: [{ code: 'invalid-value', path: DOCUMENT_PATH }],
            };
        case 'legacyTree':
            break;
    }

    const inspection = inspectLegacyTree(stored.tree);
    switch (inspection.status) {
        case 'limit-exceeded':
            return {
                outcome: 'unsupported',
                document: null,
                diagnostics: [{ code: 'limit-exceeded', path: DOCUMENT_PATH }],
            };
        case 'invalid-node':
            return {
                outcome: 'invalid',
                document: null,
                diagnostics: [{ code: 'invalid-node', path: inspection.path }],
            };
        case 'valid':
            break;
    }

    const { blocks, diagnostics } = fromLegacyTree(inspection.tree, { resolveMention: options.resolveMention });
    const [firstDiagnostic, ...otherDiagnostics] = diagnostics;
    if (firstDiagnostic === undefined) {
        // No diagnostic means every block and mark written is one the closed document declares.
        return { outcome: 'exact', document: { version: 1, blocks } as RteDocument, diagnostics: [] };
    }

    return {
        outcome: 'requires-review',
        document: { version: 1, blocks },
        diagnostics: [firstDiagnostic, ...otherDiagnostics],
    };
};
