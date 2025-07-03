// @vitest-environment happy-dom

/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DocumentPageDummy, getAppBridgeBlockStub } from '../tests';
import { type DocumentPage } from '../types';

import { useCategorizedDocumentPages } from './useCategorizedDocumentPages';

const DOCUMENT_CATEGORY_ID = 23455;
const ANOTHER_DOCUMENT_CATEGORY_ID = 4534656;
const DOCUMENT_PAGE_ID_1 = 23442;
const DOCUMENT_PAGE_ID_2 = 235345;
const DOCUMENT_PAGE_ID_3 = 12352;
const DOCUMENT_PAGE_ID_4 = 55221;
const DOCUMENT_PAGE_ID_5 = 34556;

describe('useCategorizedDocumentPages', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should fetch document pages on mount', async () => {
        const appBridge = getAppBridgeBlockStub();
        const spy = vi.spyOn(appBridge, 'getDocumentPagesByDocumentCategoryId');

        const { result } = renderHook(() => useCategorizedDocumentPages(appBridge, DOCUMENT_CATEGORY_ID));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(DOCUMENT_CATEGORY_ID);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.documentPages).toEqual([
                DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_1, categoryId: DOCUMENT_CATEGORY_ID, sort: 1 }),
                DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_2, categoryId: DOCUMENT_CATEGORY_ID, sort: 2 }),
                DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_3, categoryId: DOCUMENT_CATEGORY_ID, sort: 3 }),
                DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_4, categoryId: DOCUMENT_CATEGORY_ID, sort: 4 }),
            ]);
        });
    });

    it('should not fetch document pages on mount if not enabled', () => {
        const appBridge = getAppBridgeBlockStub();
        const spy = vi.spyOn(appBridge, 'getDocumentPagesByDocumentCategoryId');

        const { result } = renderHook(() =>
            useCategorizedDocumentPages(appBridge, DOCUMENT_CATEGORY_ID, { enabled: false }),
        );

        expect(result.current.isLoading).toBe(true);
        expect(spy).not.toHaveBeenCalled();
        expect(result.current.documentPages).toEqual([]);
    });

    it('should fetch document pages if it gets enabled', async () => {
        const appBridge = getAppBridgeBlockStub();
        const spy = vi.spyOn(appBridge, 'getDocumentPagesByDocumentCategoryId');

        let enabled = false;

        const { result, rerender } = renderHook(() =>
            useCategorizedDocumentPages(appBridge, DOCUMENT_CATEGORY_ID, { enabled }),
        );

        expect(result.current.isLoading).toBe(true);
        expect(spy).not.toHaveBeenCalled();
        expect(result.current.documentPages).toEqual([]);

        enabled = true;

        rerender();

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalled();

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.documentPages).toEqual([
                DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_1, categoryId: DOCUMENT_CATEGORY_ID, sort: 1 }),
                DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_2, categoryId: DOCUMENT_CATEGORY_ID, sort: 2 }),
                DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_3, categoryId: DOCUMENT_CATEGORY_ID, sort: 3 }),
                DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_4, categoryId: DOCUMENT_CATEGORY_ID, sort: 4 }),
            ]);
        });
    });

    it('should update document pages if a page is added in the category', async () => {
        const appBridge = getAppBridgeBlockStub();
        const spy = vi.spyOn(appBridge, 'getDocumentPagesByDocumentCategoryId');

        const DOCUMENT_PAGE = DocumentPageDummy.withFields({
            id: DOCUMENT_PAGE_ID_5,
            categoryId: DOCUMENT_CATEGORY_ID,
        });

        const { result } = renderHook(() => useCategorizedDocumentPages(appBridge, DOCUMENT_CATEGORY_ID));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Mock the response of the second call
        spy.mockImplementationOnce(() =>
            Promise.resolve([
                DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_1, categoryId: DOCUMENT_CATEGORY_ID }),
                DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_2, categoryId: DOCUMENT_CATEGORY_ID }),
                DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_3, categoryId: DOCUMENT_CATEGORY_ID }),
                DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_4, categoryId: DOCUMENT_CATEGORY_ID }),
                DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_5, categoryId: DOCUMENT_CATEGORY_ID }),
            ]),
        );

        // Trigger a "document page added" event in the specified category
        window.emitter.emit('AppBridge:GuidelineDocumentPage:Action', {
            action: 'add',
            documentPage: DOCUMENT_PAGE,
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledTimes(2);
        });

        expect(result.current.documentPages).toEqual([
            DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_1, categoryId: DOCUMENT_CATEGORY_ID }),
            DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_2, categoryId: DOCUMENT_CATEGORY_ID }),
            DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_3, categoryId: DOCUMENT_CATEGORY_ID }),
            DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_4, categoryId: DOCUMENT_CATEGORY_ID }),
            DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_5, categoryId: DOCUMENT_CATEGORY_ID }),
        ]);
    });

    it('should not update the document pages if a page is added in another category', async () => {
        const appBridge = getAppBridgeBlockStub();
        const spy = vi.spyOn(appBridge, 'getDocumentPagesByDocumentCategoryId');

        const DOCUMENT_PAGE = DocumentPageDummy.withFields({
            id: DOCUMENT_PAGE_ID_1,
            documentId: ANOTHER_DOCUMENT_CATEGORY_ID,
        });

        const { result } = renderHook(() => useCategorizedDocumentPages(appBridge, DOCUMENT_CATEGORY_ID));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Trigger a "document page added" event from another category
        window.emitter.emit('AppBridge:GuidelineDocumentPage:Action', {
            action: 'add',
            documentPage: DOCUMENT_PAGE,
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledOnce();
        });
    });

    it('should update document pages if a page is removed from the category', async () => {
        const appBridge = getAppBridgeBlockStub();
        const spy = vi.spyOn(appBridge, 'getDocumentPagesByDocumentCategoryId');

        const DOCUMENT_PAGE = DocumentPageDummy.withFields({
            id: DOCUMENT_PAGE_ID_1,
            categoryId: DOCUMENT_CATEGORY_ID,
        });

        const { result } = renderHook(() => useCategorizedDocumentPages(appBridge, DOCUMENT_CATEGORY_ID));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Trigger a "document page deleted" event in the specified category
        window.emitter.emit('AppBridge:GuidelineDocumentPage:Action', {
            action: 'delete',
            documentPage: {
                id: DOCUMENT_PAGE.id,
                documentId: DOCUMENT_PAGE.documentId,
                categoryId: DOCUMENT_PAGE.categoryId,
            },
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledOnce();
        });

        expect(result.current.documentPages).toEqual([
            DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_2, categoryId: DOCUMENT_CATEGORY_ID, sort: 2 }),
            DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_3, categoryId: DOCUMENT_CATEGORY_ID, sort: 3 }),
            DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_4, categoryId: DOCUMENT_CATEGORY_ID, sort: 4 }),
        ]);
    });

    it('should not update the document pages if a page is removed from another category', async () => {
        const appBridge = getAppBridgeBlockStub();
        const spy = vi.spyOn(appBridge, 'getDocumentPagesByDocumentCategoryId');

        const DOCUMENT_PAGE = DocumentPageDummy.withFields({
            id: DOCUMENT_PAGE_ID_5,
            documentId: ANOTHER_DOCUMENT_CATEGORY_ID,
        });

        const { result } = renderHook(() => useCategorizedDocumentPages(appBridge, DOCUMENT_CATEGORY_ID));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Trigger a "document page deleted" event from another category
        window.emitter.emit('AppBridge:GuidelineDocumentPage:Action', {
            action: 'delete',
            documentPage: {
                id: DOCUMENT_PAGE.id,
                documentId: DOCUMENT_PAGE.documentId,
                categoryId: DOCUMENT_PAGE.categoryId,
            },
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledOnce();
        });

        expect(result.current.documentPages.map((documentPage) => documentPage.id)).toEqual([
            DOCUMENT_PAGE_ID_1,
            DOCUMENT_PAGE_ID_2,
            DOCUMENT_PAGE_ID_3,
            DOCUMENT_PAGE_ID_4,
        ]);
    });

    it('should update document pages if a page is updated in the category', async () => {
        const appBridge = getAppBridgeBlockStub();
        const spy = vi.spyOn(appBridge, 'getDocumentPagesByDocumentCategoryId');

        const UPDATED_DOCUMENT_PAGE: DocumentPage = {
            ...DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_2, categoryId: DOCUMENT_CATEGORY_ID }),
            title: 'Updated title',
        };

        const { result } = renderHook(() => useCategorizedDocumentPages(appBridge, DOCUMENT_CATEGORY_ID));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Mock the response of the second call
        spy.mockImplementationOnce(() =>
            Promise.resolve([
                DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_1, categoryId: DOCUMENT_CATEGORY_ID }),
                UPDATED_DOCUMENT_PAGE,
                DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_3, categoryId: DOCUMENT_CATEGORY_ID }),
                DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_4, categoryId: DOCUMENT_CATEGORY_ID }),
            ]),
        );

        // Trigger a "document page updated" event in the specified category
        window.emitter.emit('AppBridge:GuidelineDocumentPage:Action', {
            action: 'update',
            documentPage: UPDATED_DOCUMENT_PAGE,
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledTimes(2);
        });

        expect(result.current.documentPages).toEqual([
            DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_1, categoryId: DOCUMENT_CATEGORY_ID }),
            UPDATED_DOCUMENT_PAGE,
            DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_3, categoryId: DOCUMENT_CATEGORY_ID }),
            DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_4, categoryId: DOCUMENT_CATEGORY_ID }),
        ]);
    });

    it('should not update the document pages if a page is updated in another category', async () => {
        const appBridge = getAppBridgeBlockStub();
        const spy = vi.spyOn(appBridge, 'getDocumentPagesByDocumentCategoryId');

        const UPDATED_DOCUMENT_PAGE = DocumentPageDummy.withFields({
            id: DOCUMENT_PAGE_ID_5,
            documentId: ANOTHER_DOCUMENT_CATEGORY_ID,
        });

        const { result } = renderHook(() => useCategorizedDocumentPages(appBridge, DOCUMENT_CATEGORY_ID));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Trigger a "document page updated" event from another category
        window.emitter.emit('AppBridge:GuidelineDocumentPage:Action', {
            action: 'update',
            documentPage: UPDATED_DOCUMENT_PAGE,
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledOnce();
        });

        expect(result.current.documentPages.map((documentPage) => documentPage.id)).toEqual([
            DOCUMENT_PAGE_ID_1,
            DOCUMENT_PAGE_ID_2,
            DOCUMENT_PAGE_ID_3,
            DOCUMENT_PAGE_ID_4,
        ]);
    });

    it('should update document pages if a page is moved in the category', async () => {
        const appBridge = getAppBridgeBlockStub();
        const spy = vi.spyOn(appBridge, 'getDocumentPagesByDocumentCategoryId');

        const UPDATED_DOCUMENT_PAGE: DocumentPage = {
            ...DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_2, categoryId: DOCUMENT_CATEGORY_ID }),
            sort: 4,
        };

        const { result } = renderHook(() => useCategorizedDocumentPages(appBridge, DOCUMENT_CATEGORY_ID));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Mock the response of the second call
        spy.mockImplementationOnce(() =>
            Promise.resolve([
                DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_1, categoryId: DOCUMENT_CATEGORY_ID, sort: 1 }),
                DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_2, categoryId: DOCUMENT_CATEGORY_ID, sort: 2 }),
                DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_3, categoryId: DOCUMENT_CATEGORY_ID, sort: 3 }),
                DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_4, categoryId: DOCUMENT_CATEGORY_ID, sort: 4 }),
            ]),
        );

        // Trigger a "document page updated" event in the specified category
        window.emitter.emit('AppBridge:GuidelineDocumentPage:Action', {
            action: 'move',
            documentPage: UPDATED_DOCUMENT_PAGE,
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledOnce();
        });

        expect(result.current.documentPages).toEqual([
            DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_1, categoryId: DOCUMENT_CATEGORY_ID, sort: 1 }),
            DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_3, categoryId: DOCUMENT_CATEGORY_ID, sort: 3 }),
            DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_4, categoryId: DOCUMENT_CATEGORY_ID, sort: 4 }),
            UPDATED_DOCUMENT_PAGE,
        ]);
    });
});
