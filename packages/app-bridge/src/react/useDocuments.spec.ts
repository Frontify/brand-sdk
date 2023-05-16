// @vitest-environment happy-dom

/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

import { DocumentDummy, getAppBridgeThemeStub } from '../tests';

import { useDocuments } from './useDocuments';

const DOCUMENT_GROUP_ID_1 = 5332;
const ADDED_DOCUMENT_ID = 1623;
const ADDED_GROUPED_DOCUMENT_ID = 23523;
const DOCUMENT_ID_1 = 6456;
const DOCUMENT_ID_2 = 34532;
const DOCUMENT_ID_3 = 3455345;
const DOCUMENT_ID_4 = 2342;
const DOCUMENT_ID_5 = 2343445;
const GROUPED_DOCUMENT_ID_1 = 2434;
const GROUPED_DOCUMENT_ID_2 = 552;
const GROUPED_DOCUMENT_ID_3 = 1145;
const GROUPED_DOCUMENT_ID_4 = 32345;
const DOCUMENT_PAGE_ID = 234;

describe('useDocument', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should fetch documents on mount', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getAllDocuments');

        const { result } = renderHook(() => useDocuments(appBridge));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.getUngroupedDocuments()).toEqual([
                DocumentDummy.with(DOCUMENT_ID_1),
                DocumentDummy.with(DOCUMENT_ID_2),
                DocumentDummy.with(DOCUMENT_ID_3),
                DocumentDummy.with(DOCUMENT_ID_4),
                DocumentDummy.with(DOCUMENT_ID_5),
            ]);
            expect(result.current.getGroupedDocuments()).toEqual([
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_1, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_2, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_3, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_4, DOCUMENT_GROUP_ID_1),
            ]);
        });
    });

    it('should not fetch documents on mount if not enabled', () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getAllDocuments');

        const { result } = renderHook(() => useDocuments(appBridge, { enabled: false }));

        expect(result.current.isLoading).toBe(true);
        expect(spy).not.toHaveBeenCalled();
        expect(result.current.getUngroupedDocuments()).toEqual([]);
        expect(result.current.getGroupedDocuments()).toEqual([]);
    });

    it('should fetch documents if it gets enabled', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getAllDocuments');

        let enabled = false;

        const { result, rerender } = renderHook(() => useDocuments(appBridge, { enabled }));

        expect(result.current.isLoading).toBe(true);
        expect(spy).not.toHaveBeenCalled();
        expect(result.current.getUngroupedDocuments()).toEqual([]);
        expect(result.current.getGroupedDocuments()).toEqual([]);

        enabled = true;

        rerender();

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalled();

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.getUngroupedDocuments()).toEqual([
                DocumentDummy.with(DOCUMENT_ID_1),
                DocumentDummy.with(DOCUMENT_ID_2),
                DocumentDummy.with(DOCUMENT_ID_3),
                DocumentDummy.with(DOCUMENT_ID_4),
                DocumentDummy.with(DOCUMENT_ID_5),
            ]);
            expect(result.current.getGroupedDocuments()).toEqual([
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_1, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_2, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_3, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_4, DOCUMENT_GROUP_ID_1),
            ]);
        });
    });

    it('should update ungrouped documents if a ungrouped document is added', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getAllDocuments');

        const DOCUMENT_TO_ADD = DocumentDummy.with(ADDED_DOCUMENT_ID);

        const { result } = renderHook(() => useDocuments(appBridge));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Mock the response of the second call
        spy.mockImplementationOnce(() =>
            Promise.resolve([
                DocumentDummy.with(DOCUMENT_ID_1),
                DocumentDummy.with(DOCUMENT_ID_2),
                DocumentDummy.with(DOCUMENT_ID_3),
                DOCUMENT_TO_ADD,
            ]),
        );

        window.emitter.emit('AppBridge:GuidelineDocument:Action', {
            action: 'add',
            document: DOCUMENT_TO_ADD,
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledTimes(2);
        });

        expect(result.current.getUngroupedDocuments()).toEqual([
            DocumentDummy.with(DOCUMENT_ID_1),
            DocumentDummy.with(DOCUMENT_ID_2),
            DocumentDummy.with(DOCUMENT_ID_3),
            DOCUMENT_TO_ADD,
        ]);

        expect(result.current.getGroupedDocuments()).toEqual([]);
    });

    it('should update ungrouped documents if a ungrouped document is removed', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getAllDocuments');

        const DOCUMENT_TO_DELETE = DocumentDummy.with(DOCUMENT_ID_3);

        const { result } = renderHook(() => useDocuments(appBridge));
        expect(spy).toHaveBeenCalledOnce();

        expect(result.current.isLoading).toBe(true);

        // Mock the response of the second call
        spy.mockImplementationOnce(() =>
            Promise.resolve([
                DocumentDummy.with(DOCUMENT_ID_1),
                DocumentDummy.with(DOCUMENT_ID_2),
                DocumentDummy.with(DOCUMENT_ID_4),
                DocumentDummy.with(DOCUMENT_ID_5),
            ]),
        );

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        window.emitter.emit('AppBridge:GuidelineDocument:Action', {
            action: 'delete',
            document: {
                id: DOCUMENT_TO_DELETE.id,
            },
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledTimes(2);
        });

        expect(result.current.getUngroupedDocuments()).toEqual([
            DocumentDummy.with(DOCUMENT_ID_1),
            DocumentDummy.with(DOCUMENT_ID_2),
            DocumentDummy.with(DOCUMENT_ID_4),
            DocumentDummy.with(DOCUMENT_ID_5),
        ]);

        expect(result.current.getGroupedDocuments()).toEqual([]);
    });

    it('should update ungrouped documents if a ungrouped document is updated', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getAllDocuments');

        const DOCUMENT_TO_UPDATE = DocumentDummy.withFields({ ...DocumentDummy.with(DOCUMENT_ID_3), title: 'UPDATED' });

        const { result } = renderHook(() => useDocuments(appBridge));
        expect(spy).toHaveBeenCalledOnce();

        expect(result.current.isLoading).toBe(true);

        // Mock the response of the second call
        spy.mockImplementationOnce(() =>
            Promise.resolve([
                DocumentDummy.with(DOCUMENT_ID_1),
                DocumentDummy.with(DOCUMENT_ID_2),
                DOCUMENT_TO_UPDATE,
                DocumentDummy.with(DOCUMENT_ID_4),
                DocumentDummy.with(DOCUMENT_ID_5),
            ]),
        );

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        window.emitter.emit('AppBridge:GuidelineDocument:Action', {
            action: 'update',
            document: DOCUMENT_TO_UPDATE,
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledTimes(2);
        });

        expect(result.current.getUngroupedDocuments()).toEqual([
            DocumentDummy.with(DOCUMENT_ID_1),
            DocumentDummy.with(DOCUMENT_ID_2),
            DOCUMENT_TO_UPDATE,
            DocumentDummy.with(DOCUMENT_ID_4),
            DocumentDummy.with(DOCUMENT_ID_5),
        ]);

        expect(result.current.getGroupedDocuments()).toEqual([]);
    });

    it('should update grouped documents if a grouped document is added', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getAllDocuments');

        const DOCUMENT_TO_ADD = DocumentDummy.withDocumentGroupId(ADDED_GROUPED_DOCUMENT_ID, DOCUMENT_GROUP_ID_1);

        const { result } = renderHook(() => useDocuments(appBridge));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Mock the response of the second call
        spy.mockImplementationOnce(() =>
            Promise.resolve([
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_1, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_2, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_3, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_4, DOCUMENT_GROUP_ID_1),
                DOCUMENT_TO_ADD,
            ]),
        );

        window.emitter.emit('AppBridge:GuidelineDocument:Action', {
            action: 'add',
            document: DOCUMENT_TO_ADD,
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledTimes(2);
        });

        expect(result.current.getGroupedDocuments()).toEqual([
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_1, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_2, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_3, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_4, DOCUMENT_GROUP_ID_1),
            DOCUMENT_TO_ADD,
        ]);

        expect(result.current.getUngroupedDocuments()).toEqual([]);
    });

    it('should update grouped documents if a grouped document is removed', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getAllDocuments');

        const DOCUMENT_TO_DELETE = DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_3, DOCUMENT_GROUP_ID_1);

        const { result } = renderHook(() => useDocuments(appBridge));
        expect(spy).toHaveBeenCalledOnce();

        expect(result.current.isLoading).toBe(true);

        // Mock the response of the second call
        spy.mockImplementationOnce(() =>
            Promise.resolve([
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_1, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_2, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_4, DOCUMENT_GROUP_ID_1),
            ]),
        );

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        window.emitter.emit('AppBridge:GuidelineDocument:Action', {
            action: 'delete',
            document: {
                id: DOCUMENT_TO_DELETE.id,
            },
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledTimes(2);
        });

        expect(result.current.getGroupedDocuments()).toEqual([
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_1, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_2, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_4, DOCUMENT_GROUP_ID_1),
        ]);

        expect(result.current.getUngroupedDocuments()).toEqual([]);
    });

    it('should update grouped documents if a grouped document is updated', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getAllDocuments');

        const DOCUMENT_TO_UPDATE = DocumentDummy.withFields({
            ...DocumentDummy.withDocumentGroupId(ADDED_GROUPED_DOCUMENT_ID, DOCUMENT_GROUP_ID_1),
            title: 'UPDATED',
        });

        const { result } = renderHook(() => useDocuments(appBridge));
        expect(spy).toHaveBeenCalledOnce();

        expect(result.current.isLoading).toBe(true);

        // Mock the response of the second call
        spy.mockImplementationOnce(() =>
            Promise.resolve([
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_1, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_2, DOCUMENT_GROUP_ID_1),
                DOCUMENT_TO_UPDATE,
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_3, DOCUMENT_GROUP_ID_1),
                DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_4, DOCUMENT_GROUP_ID_1),
            ]),
        );

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        window.emitter.emit('AppBridge:GuidelineDocument:Action', {
            action: 'update',
            document: DOCUMENT_TO_UPDATE,
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledTimes(2);
        });

        expect(result.current.getGroupedDocuments()).toEqual([
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_1, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_2, DOCUMENT_GROUP_ID_1),
            DOCUMENT_TO_UPDATE,
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_3, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_4, DOCUMENT_GROUP_ID_1),
        ]);

        expect(result.current.getUngroupedDocuments()).toEqual([]);
    });

    it('should update number of uncategorized pages if an uncategorized document page is added to ungrouped document', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getAllDocuments');

        const { result } = renderHook(() => useDocuments(appBridge));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.getUngroupedDocuments()).toEqual([
            DocumentDummy.with(DOCUMENT_ID_1),
            DocumentDummy.with(DOCUMENT_ID_2),
            DocumentDummy.with(DOCUMENT_ID_3),
            DocumentDummy.with(DOCUMENT_ID_4),
            DocumentDummy.with(DOCUMENT_ID_5),
        ]);

        // Trigger a "document page update" event in the specified document
        window.emitter.emit('AppBridge:GuidelineDocument:DocumentPageAction', {
            action: 'add',
            documentPage: { id: DOCUMENT_PAGE_ID, documentId: DOCUMENT_ID_1 },
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledOnce();
        });

        expect(result.current.getUngroupedDocuments()).toEqual([
            DocumentDummy.withFields({ ...DocumentDummy.with(DOCUMENT_ID_1), numberOfUncategorizedDocumentPages: 1 }),
            DocumentDummy.with(DOCUMENT_ID_2),
            DocumentDummy.with(DOCUMENT_ID_3),
            DocumentDummy.with(DOCUMENT_ID_4),
            DocumentDummy.with(DOCUMENT_ID_5),
        ]);
    });

    it('should update number of uncategorized pages if an uncategorized document page is added to grouped document', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getAllDocuments');

        const { result } = renderHook(() => useDocuments(appBridge));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.getGroupedDocuments()).toEqual([
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_1, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_2, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_3, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_4, DOCUMENT_GROUP_ID_1),
        ]);

        // Trigger a "document page update" event in the specified document
        window.emitter.emit('AppBridge:GuidelineDocument:DocumentPageAction', {
            action: 'add',
            documentPage: { id: DOCUMENT_PAGE_ID, documentId: GROUPED_DOCUMENT_ID_1 },
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledOnce();
        });

        expect(result.current.getGroupedDocuments()).toEqual([
            DocumentDummy.withFields({
                ...DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_1, DOCUMENT_GROUP_ID_1),
                numberOfUncategorizedDocumentPages: 1,
            }),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_2, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_3, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_4, DOCUMENT_GROUP_ID_1),
        ]);
    });

    it('should not update number of categorized page if a categorized document page is added', async () => {
        // TODO: Implement
    });

    it('should update number of categorized page if an uncategorized document page is removed', async () => {
        // TODO: Implement
    });

    it('should not update number of categorized page if a categorized document page is removed', async () => {
        // TODO: Implement
    });

    it('should update number of document page categories if a categorized document page is added to ungrouped document', async () => {
        // TODO: Implement
    });

    it('should update number of document page categories if a categorized document page is added to grouped document', async () => {
        // TODO: Implement
    });

    it('should update number of document category if remove', async () => {
        // TODO: Implement
    });
});
