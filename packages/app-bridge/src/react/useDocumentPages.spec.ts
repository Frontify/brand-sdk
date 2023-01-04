/* (c) Copyright Frontify Ltd., all rights reserved. */

import mitt from 'mitt';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { AppBridgeTheme } from '../AppBridgeTheme';

import { useDocumentPages } from './useDocumentPages';
import { DocumentCategoryDummy, DocumentPageDummy } from '../tests';

describe('useDocumentPages', () => {
    const documentId = 123;
    let appBridgeMock: AppBridgeTheme;

    beforeEach(() => {
        appBridgeMock = {
            getDocumentCategoriesByDocumentId: vi.fn(() => Promise.resolve([])),
            getUncategorizedPagesByDocumentId: vi.fn(() => Promise.resolve([])),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
        window.emitter = mitt();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should fetch and set the document pages and categories on mount', async () => {
        const documentCategories = [DocumentCategoryDummy.with(1, [12])];
        const documentPages = [DocumentPageDummy.with(11)];

        vi.spyOn(appBridgeMock, 'getDocumentCategoriesByDocumentId').mockResolvedValue(documentCategories);
        vi.spyOn(appBridgeMock, 'getUncategorizedPagesByDocumentId').mockResolvedValue(documentPages);

        const { result } = renderHook(() => useDocumentPages(appBridgeMock, documentId));

        expect(result.current.documentPages).toBe(null);

        expect(appBridgeMock.getDocumentCategoriesByDocumentId).toHaveBeenCalledWith(documentId);
        expect(appBridgeMock.getUncategorizedPagesByDocumentId).toHaveBeenCalledWith(documentId);

        await waitFor(() => {
            expect(result.current.documentPages).toEqual([...documentCategories, ...documentPages]);
        });
    });

    it('should update the document pages and categories when an update event is emitted', () => {
        const { result } = renderHook(() => useDocumentPages(appBridgeMock, documentId));
        const updatedPage = DocumentPageDummy.withFields({ ...DocumentPageDummy.with(11), sort: 222 });

        act(() => {
            window.emitter.emit('AppBridge:GuidelineDocumentPageAction', {
                action: 'update',
                documentPage: updatedPage,
            });
        });

        expect(result.current.documentPages).toEqual([updatedPage]);
    });

    it('should add a document page or category when an add event is emitted', () => {
        const { result } = renderHook(() => useDocumentPages(appBridgeMock, documentId));
        const addedPage = DocumentPageDummy.with(13);

        act(() => {
            window.emitter.emit('AppBridge:GuidelineDocumentPageAction', {
                action: 'add',
                documentPage: addedPage,
            });
        });

        expect(result.current.documentPages).toEqual([addedPage]);
    });

    it('should delete a document page or category when a delete event is emitted', async () => {
        const { result } = renderHook(() => useDocumentPages(appBridgeMock, documentId));

        const pages = [DocumentPageDummy.with(1)];

        result.current.documentPages = pages;

        act(() => {
            window.emitter.emit('AppBridge:GuidelineDocumentPageAction', {
                action: 'delete',
                documentPage: { id: 1 },
            });
        });

        await waitFor(() => {
            expect(result.current.documentPages).toEqual([]);
        });
    });

    it('should not update the document pages and categories when an event with an invalid action is emitted', () => {
        const { result } = renderHook(() => useDocumentPages(appBridgeMock, documentId));
        const pages = [DocumentPageDummy.with(1)];

        result.current.documentPages = pages;

        act(() => {
            window.emitter.emit('AppBridge:GuidelineDocumentPageAction', {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                action: 'invalid' as any,
                documentPage: { id: 1, sort: 20 },
            });
        });

        expect(result.current.documentPages).toEqual(pages);
    });
});
