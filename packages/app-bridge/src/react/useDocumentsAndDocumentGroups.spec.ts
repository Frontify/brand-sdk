/* (c) Copyright Frontify Ltd., all rights reserved. */

import mitt from 'mitt';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AppBridgeTheme } from '../AppBridgeTheme';
import { DocumentDummy, DocumentGroupDummy } from '../tests';

import { useDocumentsAndDocumentGroups } from './useDocumentsAndDocumentGroups';

describe('useDocumentsAndDocumentGroups', () => {
    let appBridge: AppBridgeTheme;

    beforeEach(() => {
        appBridge = {
            getDocumentGroups: vi.fn(() => Promise.resolve([DocumentGroupDummy.with(11, [DocumentDummy.with(2)])])),
            getDocumentsWithoutDocumentGroups: vi.fn(() => Promise.resolve([DocumentDummy.with(1)])),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
        window.emitter = mitt();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should fetch documents and document groups on mount', async () => {
        const { result, unmount } = renderHook(() => useDocumentsAndDocumentGroups(appBridge));

        expect(appBridge.getDocumentGroups).toHaveBeenCalledTimes(1);
        expect(appBridge.getUngroupedDocuments).toHaveBeenCalledTimes(1);

        await waitFor(() =>
            expect(result.current.documents).toEqual([
                DocumentGroupDummy.with(11, [DocumentDummy.with(2)]),
                DocumentDummy.with(1),
            ]),
        );

        unmount();
    });

    it('should update document groups on update event', async () => {
        const { result, unmount } = renderHook(() => useDocumentsAndDocumentGroups(appBridge));

        expect(appBridge.getDocumentGroups).toHaveBeenCalledTimes(1);
        expect(appBridge.getUngroupedDocuments).toHaveBeenCalledTimes(1);

        waitFor(() => {
            expect(result.current.documents).toEqual([
                DocumentGroupDummy.with(11, [DocumentDummy.with(2)]),
                DocumentDummy.with(1),
            ]);

            act(() =>
                window.emitter.emit('AppBridge:GuidelineDocumentGroupAction', {
                    action: 'update',
                    documentGroup: DocumentGroupDummy.with(11, [DocumentDummy.with(2), DocumentDummy.with(3)]),
                }),
            );

            expect(result.current.documents).toEqual([
                DocumentGroupDummy.with(11, [DocumentDummy.with(2), DocumentDummy.with(3)]),
                DocumentDummy.with(1),
            ]);
        });

        unmount();
    });

    it('should add document groups on add event', () => {
        const { result, unmount } = renderHook(() => useDocumentsAndDocumentGroups(appBridge));

        act(() =>
            window.emitter.emit('AppBridge:GuidelineDocumentGroupAction', {
                action: 'add',
                documentGroup: DocumentGroupDummy.with(12, [DocumentDummy.with(5)]),
            }),
        );

        expect(result.current.documents).toEqual([DocumentGroupDummy.with(12, [DocumentDummy.with(5)])]);

        unmount();
    });

    it('should delete document group on delete event', async () => {
        const { result, unmount } = renderHook(() => useDocumentsAndDocumentGroups(appBridge));

        expect(appBridge.getDocumentGroups).toHaveBeenCalledTimes(1);
        expect(appBridge.getUngroupedDocuments).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            act(() =>
                window.emitter.emit('AppBridge:GuidelineDocumentGroupAction', {
                    action: 'delete',
                    documentGroup: { id: 11 },
                }),
            );

            expect(result.current.documents).toEqual([DocumentDummy.with(1)]);
        });

        unmount();
    });

    it('should not update the document group when an event with an invalid action is emitted', async () => {
        const { result } = renderHook(() => useDocumentsAndDocumentGroups(appBridge));

        await waitFor(() => {
            act(() =>
                window.emitter.emit('AppBridge:GuidelineDocumentGroupAction', {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    action: 'invalid' as any,
                    documentGroup: DocumentGroupDummy.with(11, [DocumentDummy.with(2), DocumentDummy.with(3)]),
                }),
            );

            expect(result.current.documents).toEqual([
                DocumentGroupDummy.with(11, [DocumentDummy.with(2)]),
                DocumentDummy.with(1),
            ]);
        });
    });

    it('should update document on update event', async () => {
        const { result, unmount } = renderHook(() => useDocumentsAndDocumentGroups(appBridge));

        expect(appBridge.getDocumentGroups).toHaveBeenCalledTimes(1);
        expect(appBridge.getUngroupedDocuments).toHaveBeenCalledTimes(1);

        waitFor(() => {
            expect(result.current.documents).toEqual([
                DocumentGroupDummy.with(11, [DocumentDummy.with(2)]),
                DocumentDummy.with(1),
            ]);

            act(() =>
                window.emitter.emit('AppBridge:GuidelineStandardDocumentAction', {
                    action: 'update',
                    standardDocument: DocumentDummy.withFields({ ...DocumentDummy.with(1), title: 'updateTitle' }),
                }),
            );

            expect(result.current.documents).toEqual([
                DocumentGroupDummy.with(11, [DocumentDummy.with(2)]),
                DocumentDummy.withFields({ ...DocumentDummy.with(1), title: 'updateTitle' }),
            ]);
        });

        unmount();
    });

    it('should add document on add event', () => {
        const { result, unmount } = renderHook(() => useDocumentsAndDocumentGroups(appBridge));

        act(() =>
            window.emitter.emit('AppBridge:GuidelineStandardDocumentAction', {
                action: 'add',
                standardDocument: DocumentDummy.with(6),
            }),
        );

        expect(result.current.documents).toEqual([DocumentDummy.with(6)]);

        unmount();
    });

    it('should delete document on delete event', async () => {
        const { result, unmount } = renderHook(() => useDocumentsAndDocumentGroups(appBridge));

        expect(appBridge.getDocumentGroups).toHaveBeenCalledTimes(1);
        expect(appBridge.getUngroupedDocuments).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            act(() =>
                window.emitter.emit('AppBridge:GuidelineStandardDocumentAction', {
                    action: 'delete',
                    standardDocument: { id: 1 },
                }),
            );

            expect(result.current.documents).toEqual([DocumentGroupDummy.with(11, [DocumentDummy.with(2)])]);
        });

        unmount();
    });

    it('should not update the document when an event with an invalid action is emitted', async () => {
        const { result, unmount } = renderHook(() => useDocumentsAndDocumentGroups(appBridge));

        await waitFor(() => {
            act(() =>
                window.emitter.emit('AppBridge:GuidelineStandardDocumentAction', {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    action: 'invalid' as any,
                    standardDocument: DocumentDummy.withFields({ ...DocumentDummy.with(1), title: 'updateTitle' }),
                }),
            );

            expect(result.current.documents).toEqual([
                DocumentGroupDummy.with(11, [DocumentDummy.with(2)]),
                DocumentDummy.with(1),
            ]);
        });

        unmount();
    });
});
