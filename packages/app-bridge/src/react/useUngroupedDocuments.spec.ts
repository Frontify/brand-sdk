// @vitest-environment happy-dom

/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

import { DocumentDummy, getAppBridgeThemeStub } from '../tests';

import { useUngroupedDocuments } from './useUngroupedDocuments';

const DOCUMENT_ID_1 = 6456;
const DOCUMENT_ID_2 = 34532;
const DOCUMENT_ID_3 = 3455345;
const DOCUMENT_ID_4 = 2342;
const DOCUMENT_ID_5 = 2343445;
const DOCUMENT_PAGE_ID = 68445;
const DOCUMENT_CATEGORY_ID = 123;

describe('useUngroupedDocuments', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should fetch ungrouped documents on mount', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getUngroupedDocuments');

        const { result } = renderHook(() => useUngroupedDocuments(appBridge));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);

            expect(result.current.documents).toEqual([
                DocumentDummy.with(DOCUMENT_ID_1),
                DocumentDummy.with(DOCUMENT_ID_2),
                DocumentDummy.with(DOCUMENT_ID_3),
                DocumentDummy.with(DOCUMENT_ID_4),
                DocumentDummy.with(DOCUMENT_ID_5),
            ]);
        });
    });

    it('should not fetch ungrouped documents on mount if not enabled', () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getUngroupedDocuments');

        const { result } = renderHook(() => useUngroupedDocuments(appBridge, { enabled: false }));

        expect(result.current.isLoading).toBe(true);
        expect(spy).not.toHaveBeenCalled();
        expect(result.current.documents).toEqual([]);
    });

    it('should fetch ungrouped documents if it gets enabled', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getUngroupedDocuments');

        let enabled = false;

        const { result, rerender } = renderHook(() => useUngroupedDocuments(appBridge, { enabled }));

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
                DocumentDummy.with(DOCUMENT_ID_1),
                DocumentDummy.with(DOCUMENT_ID_2),
                DocumentDummy.with(DOCUMENT_ID_3),
                DocumentDummy.with(DOCUMENT_ID_4),
                DocumentDummy.with(DOCUMENT_ID_5),
            ]);
        });
    });

    it('should update document if a page is added', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getUngroupedDocuments');

        const OLD_DOCUMENT = DocumentDummy.withFields({
            ...DocumentDummy.with(DOCUMENT_ID_4),
            numberOfUncategorizedDocumentPages: 0,
        });
        const NEW_DOCUMENT = DocumentDummy.withFields({
            ...OLD_DOCUMENT,
            numberOfUncategorizedDocumentPages: 1,
        });

        // Mock the response of the first call
        spy.mockImplementationOnce(() =>
            Promise.resolve([
                DocumentDummy.with(DOCUMENT_ID_1),
                DocumentDummy.with(DOCUMENT_ID_2),
                DocumentDummy.with(DOCUMENT_ID_3),
                OLD_DOCUMENT,
            ]),
        );

        const { result } = renderHook(() => useUngroupedDocuments(appBridge, { enabled: true }));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.documents).toEqual([
                DocumentDummy.with(DOCUMENT_ID_1),
                DocumentDummy.with(DOCUMENT_ID_2),
                DocumentDummy.with(DOCUMENT_ID_3),
                OLD_DOCUMENT,
            ]);
        });

        // Mock the response of the second call
        spy.mockImplementationOnce(() =>
            Promise.resolve([
                DocumentDummy.with(DOCUMENT_ID_1),
                DocumentDummy.with(DOCUMENT_ID_2),
                DocumentDummy.with(DOCUMENT_ID_3),
                NEW_DOCUMENT,
            ]),
        );

        // Trigger a "document page added" event in the specified document
        window.emitter.emit('AppBridge:GuidelineDocument:DocumentPageAction', {
            action: 'add',
            documentPage: { id: DOCUMENT_PAGE_ID, documentId: DOCUMENT_ID_4 },
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledOnce();
        });

        expect(result.current.documents).toEqual([
            DocumentDummy.with(DOCUMENT_ID_1),
            DocumentDummy.with(DOCUMENT_ID_2),
            DocumentDummy.with(DOCUMENT_ID_3),
            NEW_DOCUMENT,
        ]);
    });

    it('should update document if a page is deleted', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getUngroupedDocuments');

        const OLD_DOCUMENT = DocumentDummy.withFields({
            ...DocumentDummy.with(DOCUMENT_ID_4),
            numberOfUncategorizedDocumentPages: 1,
        });
        const NEW_DOCUMENT = DocumentDummy.withFields({
            ...OLD_DOCUMENT,
            numberOfUncategorizedDocumentPages: 0,
        });

        // Mock the response of the first call
        spy.mockImplementationOnce(() =>
            Promise.resolve([
                DocumentDummy.with(DOCUMENT_ID_1),
                DocumentDummy.with(DOCUMENT_ID_2),
                DocumentDummy.with(DOCUMENT_ID_3),
                OLD_DOCUMENT,
            ]),
        );

        const { result } = renderHook(() => useUngroupedDocuments(appBridge, { enabled: true }));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Mock the response of the second call
        spy.mockImplementationOnce(() =>
            Promise.resolve([
                DocumentDummy.with(DOCUMENT_ID_1),
                DocumentDummy.with(DOCUMENT_ID_2),
                DocumentDummy.with(DOCUMENT_ID_3),
                NEW_DOCUMENT,
            ]),
        );

        // Trigger a "document page added" event in the specified document
        window.emitter.emit('AppBridge:GuidelineDocument:DocumentPageAction', {
            action: 'delete',
            documentPage: { id: DOCUMENT_PAGE_ID, documentId: DOCUMENT_ID_4 },
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledOnce();
        });

        expect(result.current.documents).toEqual([
            DocumentDummy.with(DOCUMENT_ID_1),
            DocumentDummy.with(DOCUMENT_ID_2),
            DocumentDummy.with(DOCUMENT_ID_3),
            NEW_DOCUMENT,
        ]);
    });

    it('should update document if a category is added', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getUngroupedDocuments');

        const OLD_DOCUMENT = DocumentDummy.withFields({
            ...DocumentDummy.with(DOCUMENT_ID_4),
            numberOfDocumentPageCategories: 0,
        });
        const NEW_DOCUMENT = DocumentDummy.withFields({
            ...OLD_DOCUMENT,
            numberOfDocumentPageCategories: 1,
        });

        // Mock the response of the first call
        spy.mockImplementationOnce(() =>
            Promise.resolve([
                DocumentDummy.with(DOCUMENT_ID_1),
                DocumentDummy.with(DOCUMENT_ID_2),
                DocumentDummy.with(DOCUMENT_ID_3),
                OLD_DOCUMENT,
            ]),
        );

        const { result } = renderHook(() => useUngroupedDocuments(appBridge, { enabled: true }));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.documents).toEqual([
                DocumentDummy.with(DOCUMENT_ID_1),
                DocumentDummy.with(DOCUMENT_ID_2),
                DocumentDummy.with(DOCUMENT_ID_3),
                OLD_DOCUMENT,
            ]);
        });

        // Mock the response of the second call
        spy.mockImplementationOnce(() =>
            Promise.resolve([
                DocumentDummy.with(DOCUMENT_ID_1),
                DocumentDummy.with(DOCUMENT_ID_2),
                DocumentDummy.with(DOCUMENT_ID_3),
                NEW_DOCUMENT,
            ]),
        );

        // Trigger a "document category added" event in the specified document
        window.emitter.emit('AppBridge:GuidelineDocument:DocumentCategoryAction', {
            action: 'add',
            documentCategory: { id: DOCUMENT_CATEGORY_ID, documentId: DOCUMENT_ID_4 },
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledOnce();
        });

        expect(result.current.documents).toEqual([
            DocumentDummy.with(DOCUMENT_ID_1),
            DocumentDummy.with(DOCUMENT_ID_2),
            DocumentDummy.with(DOCUMENT_ID_3),
            NEW_DOCUMENT,
        ]);
    });

    it('should update document if a category is deleted', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getUngroupedDocuments');

        const OLD_DOCUMENT = DocumentDummy.withFields({
            ...DocumentDummy.with(DOCUMENT_ID_4),
            numberOfDocumentPageCategories: 1,
        });
        const NEW_DOCUMENT = DocumentDummy.withFields({
            ...OLD_DOCUMENT,
            numberOfDocumentPageCategories: 0,
        });

        // Mock the response of the first call
        spy.mockImplementationOnce(() =>
            Promise.resolve([
                DocumentDummy.with(DOCUMENT_ID_1),
                DocumentDummy.with(DOCUMENT_ID_2),
                DocumentDummy.with(DOCUMENT_ID_3),
                OLD_DOCUMENT,
            ]),
        );

        const { result } = renderHook(() => useUngroupedDocuments(appBridge, { enabled: true }));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Mock the response of the second call
        spy.mockImplementationOnce(() =>
            Promise.resolve([
                DocumentDummy.with(DOCUMENT_ID_1),
                DocumentDummy.with(DOCUMENT_ID_2),
                DocumentDummy.with(DOCUMENT_ID_3),
                NEW_DOCUMENT,
            ]),
        );

        // Trigger a "document category added" event in the specified document
        window.emitter.emit('AppBridge:GuidelineDocument:DocumentCategoryAction', {
            action: 'delete',
            documentCategory: { id: DOCUMENT_CATEGORY_ID, documentId: DOCUMENT_ID_4 },
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledOnce();
        });

        expect(result.current.documents).toEqual([
            DocumentDummy.with(DOCUMENT_ID_1),
            DocumentDummy.with(DOCUMENT_ID_2),
            DocumentDummy.with(DOCUMENT_ID_3),
            NEW_DOCUMENT,
        ]);
    });
});
