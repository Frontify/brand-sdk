/* (c) Copyright Frontify Ltd., all rights reserved. */

import mitt from 'mitt';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDocuments } from './useDocuments';
import { AppBridgeTheme } from '../AppBridgeTheme';
import { DocumentDummy, DocumentGroupDummy } from '../tests';

describe('useDocuments', () => {
    let appBridge: AppBridgeTheme;

    beforeEach(() => {
        appBridge = {
            getDocumentGroups: vi.fn(() => Promise.resolve([DocumentGroupDummy.with(11, [2])])),
            getDocumentsWithoutDocumentGroups: vi.fn(() => Promise.resolve([DocumentDummy.with(1)])),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
        window.emitter = mitt();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should fetch documents and document groups on mount', async () => {
        const { result } = renderHook(() => useDocuments(appBridge));

        expect(appBridge.getDocumentGroups).toHaveBeenCalledTimes(1);
        expect(appBridge.getDocumentsWithoutDocumentGroups).toHaveBeenCalledTimes(1);

        await waitFor(() =>
            expect(result.current.documents).toEqual([DocumentGroupDummy.with(11, [2]), DocumentDummy.with(1)]),
        );
    });

    it('should update document groups on update event', async () => {
        const { result } = renderHook(() => useDocuments(appBridge));

        expect(appBridge.getDocumentGroups).toHaveBeenCalledTimes(1);
        expect(appBridge.getDocumentsWithoutDocumentGroups).toHaveBeenCalledTimes(1);

        waitFor(() => {
            expect(result.current.documents).toEqual([DocumentGroupDummy.with(11, [2]), DocumentDummy.with(1)]);

            act(() =>
                window.emitter.emit('AppBridge:GuidelineDocumentGroupAction', {
                    action: 'update',
                    documentGroup: DocumentGroupDummy.with(11, [2, 3]),
                }),
            );

            expect(result.current.documents).toEqual([DocumentGroupDummy.with(11, [2, 3]), DocumentDummy.with(1)]);
        });
    });

    it('should add document groups on add event', () => {
        const { result } = renderHook(() => useDocuments(appBridge));

        act(() =>
            window.emitter.emit('AppBridge:GuidelineDocumentGroupAction', {
                action: 'add',
                documentGroup: DocumentGroupDummy.with(12, [5]),
            }),
        );

        expect(result.current.documents).toEqual([DocumentGroupDummy.with(12, [5])]);
    });

    it('should delete document group on delete event', async () => {
        const { result } = renderHook(() => useDocuments(appBridge));

        expect(appBridge.getDocumentGroups).toHaveBeenCalledTimes(1);
        expect(appBridge.getDocumentsWithoutDocumentGroups).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            act(() =>
                window.emitter.emit('AppBridge:GuidelineDocumentGroupAction', {
                    action: 'delete',
                    documentGroup: { id: 11 },
                }),
            );

            expect(result.current.documents).toEqual([DocumentDummy.with(1)]);
        });
    });

    it('should not update the document group when an event with an invalid action is emitted', async () => {
        const { result } = renderHook(() => useDocuments(appBridge));

        await waitFor(() => {
            act(() =>
                window.emitter.emit('AppBridge:GuidelineDocumentGroupAction', {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    action: 'invalid' as any,
                    documentGroup: DocumentGroupDummy.with(11, [2, 3]),
                }),
            );

            expect(result.current.documents).toEqual([DocumentGroupDummy.with(11, [2]), DocumentDummy.with(1)]);
        });
    });

    it('should update document on update event', async () => {
        const { result } = renderHook(() => useDocuments(appBridge));

        expect(appBridge.getDocumentGroups).toHaveBeenCalledTimes(1);
        expect(appBridge.getDocumentsWithoutDocumentGroups).toHaveBeenCalledTimes(1);

        waitFor(() => {
            expect(result.current.documents).toEqual([DocumentGroupDummy.with(11, [2]), DocumentDummy.with(1)]);

            act(() =>
                window.emitter.emit('AppBridge:GuidelineStandardDocumentAction', {
                    action: 'update',
                    standardDocument: DocumentDummy.withFields({ ...DocumentDummy.with(1), title: 'updateTitle' }),
                }),
            );

            expect(result.current.documents).toEqual([
                DocumentGroupDummy.with(11, [2]),
                DocumentDummy.withFields({ ...DocumentDummy.with(1), title: 'updateTitle' }),
            ]);
        });
    });

    it('should add document on add event', () => {
        const { result } = renderHook(() => useDocuments(appBridge));

        act(() =>
            window.emitter.emit('AppBridge:GuidelineStandardDocumentAction', {
                action: 'add',
                standardDocument: DocumentDummy.with(6),
            }),
        );

        expect(result.current.documents).toEqual([DocumentDummy.with(6)]);
    });

    it('should delete document on delete event', async () => {
        const { result } = renderHook(() => useDocuments(appBridge));

        expect(appBridge.getDocumentGroups).toHaveBeenCalledTimes(1);
        expect(appBridge.getDocumentsWithoutDocumentGroups).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            act(() =>
                window.emitter.emit('AppBridge:GuidelineStandardDocumentAction', {
                    action: 'delete',
                    standardDocument: { id: 1 },
                }),
            );

            expect(result.current.documents).toEqual([DocumentGroupDummy.with(11, [2])]);
        });
    });

    it('should not update the document when an event with an invalid action is emitted', async () => {
        const { result } = renderHook(() => useDocuments(appBridge));

        await waitFor(() => {
            act(() =>
                window.emitter.emit('AppBridge:GuidelineStandardDocumentAction', {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    action: 'invalid' as any,
                    standardDocument: DocumentDummy.withFields({ ...DocumentDummy.with(1), title: 'updateTitle' }),
                }),
            );

            expect(result.current.documents).toEqual([DocumentGroupDummy.with(11, [2]), DocumentDummy.with(1)]);
        });
    });
});
