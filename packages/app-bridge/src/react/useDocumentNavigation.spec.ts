// @vitest-environment happy-dom

/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook, waitFor } from '@testing-library/react';
import { DocumentPage, EmitterEvents, type DocumentCategory } from 'src/types';
import { describe, expect, it, vi } from 'vitest';

import { getAppBridgeThemeStub, DocumentNavigationTreeDummy } from '../tests';

import { useDocumentNavigation } from './useDocumentNavigation';

describe('useDocumentNavigation', () => {
    it('should call the "getDocumentNavigation" api on mount', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'api').mockResolvedValueOnce(DocumentNavigationTreeDummy.default());

        const { result } = renderHook(() => useDocumentNavigation(appBridge));

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.navigationItems).toEqual(DocumentNavigationTreeDummy.default());
        });

        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith({ name: 'getDocumentNavigation' });
    });

    it('should refetch when relevant AppBridge events occur', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'api').mockResolvedValueOnce(DocumentNavigationTreeDummy.default());

        // const events = [
        //     () =>
        //         window.emitter.emit('AppBridge:GuidelineDocumentCategory:Action', {
        //             action: 'add',
        //             documentCategory: <DocumentCategory>{},
        //         }),
        //     () =>
        //         window.emitter.emit('AppBridge:GuidelineDocumentPage:Action', {
        //             action: 'add',
        //             documentPage: <DocumentPage>{},
        //         }),
        //     () =>
        //         window.emitter.emit('AppBridge:GuidelineDocumentPageTargets:Action', {
        //             action: 'update',
        //             payload: { targets: [], pageIds: [] },
        //         }),
        // ];

        const { result } = renderHook(() => useDocumentNavigation(appBridge));

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.navigationItems).toEqual(DocumentNavigationTreeDummy.default());
        });

        window.emitter.emit('AppBridge:GuidelineDocumentCategory:Action', {
            action: 'add',
            documentCategory: <DocumentCategory>{},
        });

        await waitFor(
            () =>
                new Promise<void>((resolve) => {
                    setTimeout(() => resolve(), 250);
                }),
        );

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.navigationItems).toEqual(DocumentNavigationTreeDummy.default());
        });

        expect(spy).toHaveBeenCalledTimes(2);
    });
});
