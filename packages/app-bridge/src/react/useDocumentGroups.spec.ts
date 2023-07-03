// @vitest-environment happy-dom

/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

import { DocumentGroupDummy, getAppBridgeThemeStub } from '../tests';

import { useDocumentGroups } from './useDocumentGroups';

const DOCUMENT_GROUP_ID_1 = 5332;
const DOCUMENT_GROUP_ID_2 = 95694;
const DOCUMENT_GROUP_ID_3 = 345882;
const DOCUMENT_ID_1 = 6456;

describe('usedDocumentGroups', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should fetch document groups on mount', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getDocumentGroups');

        const { result } = renderHook(() => useDocumentGroups(appBridge));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);

            expect(result.current.documentGroups).toEqual([
                DocumentGroupDummy.with(DOCUMENT_GROUP_ID_1, 3),
                DocumentGroupDummy.with(DOCUMENT_GROUP_ID_2, 0),
                DocumentGroupDummy.with(DOCUMENT_GROUP_ID_3, 2),
            ]);
        });
    });

    it('should not fetch document groups on mount if not enabled', () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getDocumentGroups');

        const { result } = renderHook(() => useDocumentGroups(appBridge, { enabled: false }));

        expect(result.current.isLoading).toBe(true);
        expect(spy).not.toHaveBeenCalled();
        expect(result.current.documentGroups).toEqual([]);
    });

    it('should fetch document gropups if it gets enabled', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getDocumentGroups');

        let enabled = false;

        const { result, rerender } = renderHook(() => useDocumentGroups(appBridge, { enabled }));

        expect(result.current.isLoading).toBe(true);
        expect(spy).not.toHaveBeenCalled();
        expect(result.current.documentGroups).toEqual([]);

        enabled = true;

        rerender();

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.documentGroups).toEqual([
                DocumentGroupDummy.with(DOCUMENT_GROUP_ID_1, 3),
                DocumentGroupDummy.with(DOCUMENT_GROUP_ID_2, 0),
                DocumentGroupDummy.with(DOCUMENT_GROUP_ID_3, 2),
            ]);
        });
    });

    it('should update document group if a document is added', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getDocumentGroups');

        const { result } = renderHook(() => useDocumentGroups(appBridge, { enabled: true }));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.documentGroups).toEqual([
                DocumentGroupDummy.with(DOCUMENT_GROUP_ID_1, 3),
                DocumentGroupDummy.with(DOCUMENT_GROUP_ID_2, 0),
                DocumentGroupDummy.with(DOCUMENT_GROUP_ID_3, 2),
            ]);
        });

        // Mock the response of the second call
        spy.mockImplementationOnce(() =>
            Promise.resolve([
                DocumentGroupDummy.with(DOCUMENT_GROUP_ID_1, 3),
                DocumentGroupDummy.with(DOCUMENT_GROUP_ID_2, 0),
                DocumentGroupDummy.with(DOCUMENT_GROUP_ID_3, 3),
            ]),
        );

        // Trigger a "document added" event in the specified document group
        window.emitter.emit('AppBridge:GuidelineDocumentGroup:DocumentAction', {
            action: 'add',
            document: { id: DOCUMENT_ID_1, documentGroupId: DOCUMENT_GROUP_ID_3 },
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledOnce();
        });

        expect(result.current.documentGroups).toEqual([
            DocumentGroupDummy.with(DOCUMENT_GROUP_ID_1, 3),
            DocumentGroupDummy.with(DOCUMENT_GROUP_ID_2, 0),
            DocumentGroupDummy.with(DOCUMENT_GROUP_ID_3, 3),
        ]);
    });

    it('should update document group if a document is deleted', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getDocumentGroups');

        const { result } = renderHook(() => useDocumentGroups(appBridge, { enabled: true }));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Mock the response of the second call
        spy.mockImplementationOnce(() =>
            Promise.resolve([
                DocumentGroupDummy.with(DOCUMENT_GROUP_ID_1, 2),
                DocumentGroupDummy.with(DOCUMENT_GROUP_ID_2, 0),
                DocumentGroupDummy.with(DOCUMENT_GROUP_ID_3, 2),
            ]),
        );

        // Trigger a "document deleted" event in the specified document group
        window.emitter.emit('AppBridge:GuidelineDocumentGroup:DocumentAction', {
            action: 'delete',
            document: { id: DOCUMENT_ID_1, documentGroupId: DOCUMENT_GROUP_ID_1 },
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledOnce();
        });

        expect(result.current.documentGroups).toEqual([
            DocumentGroupDummy.with(DOCUMENT_GROUP_ID_1, 2),
            DocumentGroupDummy.with(DOCUMENT_GROUP_ID_2, 0),
            DocumentGroupDummy.with(DOCUMENT_GROUP_ID_3, 2),
        ]);
    });

    it('should update document group if a document group is moved', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getDocumentGroups');

        const GROUP_1 = DocumentGroupDummy.withFields({ ...DocumentGroupDummy.with(DOCUMENT_GROUP_ID_1, 2), sort: 1 });
        const GROUP_2 = DocumentGroupDummy.withFields({ ...DocumentGroupDummy.with(DOCUMENT_GROUP_ID_2, 2), sort: 2 });
        const NEW_GROUP_2 = DocumentGroupDummy.withFields({ ...GROUP_2, sort: 3 });
        const GROUP_3 = DocumentGroupDummy.withFields({ ...DocumentGroupDummy.with(DOCUMENT_GROUP_ID_3, 2), sort: 3 });
        const NEW_GROUP_3 = DocumentGroupDummy.withFields({ ...GROUP_3, sort: 2 });

        spy.mockImplementationOnce(() => Promise.resolve([GROUP_1, GROUP_3, GROUP_2]));
        const { result } = renderHook(() => useDocumentGroups(appBridge, { enabled: true }));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        window.emitter.emit('AppBridge:GuidelineDocumentGroup:MoveEvent', {
            action: 'movePreview',
            documentGroup: { id: DOCUMENT_GROUP_ID_3, sort: 3 },
            position: 2,
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.documentGroups).toEqual([GROUP_1, NEW_GROUP_3, NEW_GROUP_2]);
    });

    it('should update document group if a document is moved', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getDocumentGroups');

        const GROUP_1 = DocumentGroupDummy.withFields({ ...DocumentGroupDummy.with(DOCUMENT_GROUP_ID_1, 2), sort: 1 });
        const GROUP_2 = DocumentGroupDummy.withFields({ ...DocumentGroupDummy.with(DOCUMENT_GROUP_ID_2, 2), sort: 2 });
        const GROUP_3 = DocumentGroupDummy.withFields({ ...DocumentGroupDummy.with(DOCUMENT_GROUP_ID_3, 2), sort: 3 });
        const NEW_GROUP_3 = DocumentGroupDummy.withFields({ ...GROUP_3, sort: 4 });

        spy.mockImplementationOnce(() => Promise.resolve([GROUP_1, GROUP_2, GROUP_3]));
        const { result } = renderHook(() => useDocumentGroups(appBridge, { enabled: true }));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        window.emitter.emit('AppBridge:GuidelineDocument:MoveEvent', {
            action: 'movePreview',
            document: { id: DOCUMENT_ID_1, sort: 4 },
            newGroupId: null,
            position: 2,
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.documentGroups).toEqual([GROUP_1, GROUP_2, NEW_GROUP_3]);
    });
});
