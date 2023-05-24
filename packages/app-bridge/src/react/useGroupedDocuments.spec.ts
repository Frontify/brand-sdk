// @vitest-environment happy-dom

/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

import { DocumentDummy, getAppBridgeThemeStub } from '../tests';

import { useGroupedDocuments } from './useGroupedDocuments';

const DOCUMENT_GROUP_ID_1 = 5332;
const GROUPED_DOCUMENT_ID_1 = 2434;
const GROUPED_DOCUMENT_ID_2 = 552;
const GROUPED_DOCUMENT_ID_3 = 1145;
const GROUPED_DOCUMENT_ID_4 = 32345;

describe('useGroupedDocument', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should fetch grouped documents on mount', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getDocumentsByDocumentGroupId');

        const { result } = renderHook(() => useGroupedDocuments(appBridge, DOCUMENT_GROUP_ID_1));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);

            expect(result.current.documents).toEqual([
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_1, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_2, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_3, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_4, DOCUMENT_GROUP_ID_1),
            ]);
        });
    });

    it('should not fetch grouped documents on mount if not enabled', () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getDocumentsByDocumentGroupId');

        const { result } = renderHook(() => useGroupedDocuments(appBridge, DOCUMENT_GROUP_ID_1, { enabled: false }));

        expect(result.current.isLoading).toBe(true);
        expect(spy).not.toHaveBeenCalled();
        expect(result.current.documents).toEqual([]);
    });

    it('should fetch grouped documents if it gets enabled', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getDocumentsByDocumentGroupId');

        let enabled = false;

        const { result, rerender } = renderHook(() => useGroupedDocuments(appBridge, DOCUMENT_GROUP_ID_1, { enabled }));

        expect(result.current.isLoading).toBe(true);
        expect(spy).not.toHaveBeenCalled();
        expect(result.current.documents).toEqual([]);

        enabled = true;

        rerender();

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);

            expect(result.current.documents).toEqual([
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_1, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_2, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_3, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_4, DOCUMENT_GROUP_ID_1),
            ]);
        });
    });
});
