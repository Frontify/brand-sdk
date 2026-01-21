// @vitest-environment happy-dom

/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DocumentDummy, getAppBridgeBlockStub } from '../tests';

import { useGroupedDocuments } from './useGroupedDocuments';

const DOCUMENT_GROUP_ID_1 = 5332;
const GROUPED_DOCUMENT_ID_1 = 2434;
const GROUPED_DOCUMENT_ID_2 = 552;
const GROUPED_DOCUMENT_ID_3 = 1145;
const GROUPED_DOCUMENT_ID_4 = 32345;
const DOCUMENT_PAGE_ID = 68445;
const DOCUMENT_CATEGORY_ID = 123;

describe('useGroupedDocument', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should fetch grouped documents on mount', async () => {
        const appBridge = getAppBridgeBlockStub();
        const spy = vi.spyOn(appBridge, 'getDocumentsByDocumentGroupId');

        const { result } = renderHook(() => useGroupedDocuments(appBridge, DOCUMENT_GROUP_ID_1));

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledOnce();
        });

        expect(result.current.documents).toEqual([
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_1, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_2, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_3, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_4, DOCUMENT_GROUP_ID_1),
        ]);
    });

    it('should not fetch grouped documents on mount if not enabled', () => {
        const appBridge = getAppBridgeBlockStub();
        const spy = vi.spyOn(appBridge, 'getDocumentsByDocumentGroupId');

        const { result } = renderHook(() => useGroupedDocuments(appBridge, DOCUMENT_GROUP_ID_1, { enabled: false }));

        expect(result.current.isLoading).toBe(true);
        expect(spy).not.toHaveBeenCalled();
        expect(result.current.documents).toEqual([]);
    });

    it('should fetch grouped documents if it gets enabled', async () => {
        const appBridge = getAppBridgeBlockStub();
        const spy = vi.spyOn(appBridge, 'getDocumentsByDocumentGroupId');

        let enabled = false;

        const { result, rerender } = renderHook(() => useGroupedDocuments(appBridge, DOCUMENT_GROUP_ID_1, { enabled }));

        expect(result.current.isLoading).toBe(true);
        expect(spy).not.toHaveBeenCalled();
        expect(result.current.documents).toEqual([]);

        enabled = true;

        rerender();

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledOnce();
        });

        expect(result.current.documents).toEqual([
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_1, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_2, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_3, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_4, DOCUMENT_GROUP_ID_1),
        ]);
    });

    it('should update document if a page is added', async () => {
        const appBridge = getAppBridgeBlockStub();
        const spy = vi.spyOn(appBridge, 'getDocumentsByDocumentGroupId');

        const OLD_DOCUMENT = DocumentDummy.withFields({
            ...DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_4, DOCUMENT_GROUP_ID_1),
            numberOfUncategorizedDocumentPages: 0,
        });
        const NEW_DOCUMENT = DocumentDummy.withFields({
            ...OLD_DOCUMENT,
            numberOfUncategorizedDocumentPages: 1,
        });

        const { result } = renderHook(() => useGroupedDocuments(appBridge, DOCUMENT_GROUP_ID_1, { enabled: true }));

        expect(result.current.isLoading).toBe(true);
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledOnce();
        });

        expect(result.current.documents).toEqual([
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_1, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_2, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_3, DOCUMENT_GROUP_ID_1),
            OLD_DOCUMENT,
        ]);

        // Trigger a "document page added" event in the specified document
        window.emitter.emit('AppBridge:GuidelineDocument:DocumentPageAction', {
            action: 'add',
            documentPage: { id: DOCUMENT_PAGE_ID, documentId: GROUPED_DOCUMENT_ID_4 },
        });

        await waitFor(() => {
            expect(result.current.documents).toEqual([
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_1, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_2, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_3, DOCUMENT_GROUP_ID_1),
                NEW_DOCUMENT,
            ]);
        });
    });

    it('should update document if a page is deleted', async () => {
        const appBridge = getAppBridgeBlockStub();
        const spy = vi.spyOn(appBridge, 'getDocumentsByDocumentGroupId');

        const OLD_DOCUMENT = DocumentDummy.withFields({
            ...DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_4, DOCUMENT_GROUP_ID_1),
            numberOfUncategorizedDocumentPages: 1,
        });
        const NEW_DOCUMENT = DocumentDummy.withFields({
            ...OLD_DOCUMENT,
            numberOfUncategorizedDocumentPages: 0,
        });

        // Mock the response of the first call
        spy.mockImplementationOnce(() =>
            Promise.resolve([
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_1, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_2, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_3, DOCUMENT_GROUP_ID_1),
                OLD_DOCUMENT,
            ]),
        );

        const { result } = renderHook(() => useGroupedDocuments(appBridge, DOCUMENT_GROUP_ID_1, { enabled: true }));

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledOnce();
        });

        // Trigger a "document page added" event in the specified document
        window.emitter.emit('AppBridge:GuidelineDocument:DocumentPageAction', {
            action: 'delete',
            documentPage: { id: DOCUMENT_PAGE_ID, documentId: GROUPED_DOCUMENT_ID_4 },
        });

        await waitFor(() => {
            expect(result.current.documents).toEqual([
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_1, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_2, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_3, DOCUMENT_GROUP_ID_1),
                NEW_DOCUMENT,
            ]);
        });
    });

    it('should update document if a category is added', async () => {
        const appBridge = getAppBridgeBlockStub();
        const spy = vi.spyOn(appBridge, 'getDocumentsByDocumentGroupId');

        const OLD_DOCUMENT = DocumentDummy.withFields({
            ...DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_4, DOCUMENT_GROUP_ID_1),
            numberOfDocumentPageCategories: 0,
        });
        const NEW_DOCUMENT = DocumentDummy.withFields({
            ...OLD_DOCUMENT,
            numberOfDocumentPageCategories: 1,
        });

        const { result } = renderHook(() => useGroupedDocuments(appBridge, DOCUMENT_GROUP_ID_1, { enabled: true }));

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledOnce();
        });

        expect(result.current.documents).toEqual([
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_1, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_2, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_3, DOCUMENT_GROUP_ID_1),
            OLD_DOCUMENT,
        ]);

        // Trigger a "document category added" event in the specified document
        window.emitter.emit('AppBridge:GuidelineDocument:DocumentCategoryAction', {
            action: 'add',
            documentCategory: { id: DOCUMENT_CATEGORY_ID, documentId: GROUPED_DOCUMENT_ID_4 },
        });

        await waitFor(() => {
            expect(result.current.documents).toEqual([
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_1, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_2, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_3, DOCUMENT_GROUP_ID_1),
                NEW_DOCUMENT,
            ]);
        });
    });

    it('should update document if a category is deleted', async () => {
        const appBridge = getAppBridgeBlockStub();
        const spy = vi.spyOn(appBridge, 'getDocumentsByDocumentGroupId');

        const OLD_DOCUMENT = DocumentDummy.withFields({
            ...DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_4, DOCUMENT_GROUP_ID_1),
            numberOfDocumentPageCategories: 1,
        });
        const NEW_DOCUMENT = DocumentDummy.withFields({
            ...OLD_DOCUMENT,
            numberOfDocumentPageCategories: 0,
        });

        // Mock the response of the first call
        spy.mockImplementationOnce(() =>
            Promise.resolve([
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_1, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_2, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_3, DOCUMENT_GROUP_ID_1),
                OLD_DOCUMENT,
            ]),
        );

        const { result } = renderHook(() => useGroupedDocuments(appBridge, DOCUMENT_GROUP_ID_1, { enabled: true }));

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledOnce();
        });

        // Trigger a "document category added" event in the specified document
        window.emitter.emit('AppBridge:GuidelineDocument:DocumentCategoryAction', {
            action: 'delete',
            documentCategory: { id: DOCUMENT_CATEGORY_ID, documentId: GROUPED_DOCUMENT_ID_4 },
        });

        await waitFor(() => {
            expect(result.current.documents).toEqual([
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_1, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_2, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_3, DOCUMENT_GROUP_ID_1),
                NEW_DOCUMENT,
            ]);
        });
    });
});
