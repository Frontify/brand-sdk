/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook, waitFor } from '@testing-library/react';
import type { DocumentPage, DocumentSection, GuidelineDocument, DocumentCategory } from 'src/types';
import { describe, expect, it, vi } from 'vitest';

import { getAppBridgeThemeStub, DocumentNavigationTreeDummy } from '../tests';

import { useDocumentNavigation } from './useDocumentNavigation';

vi.mock('lodash-es/debounce', () => {
    return {
        default: (callback: () => void) => callback(),
    };
});

describe('useDocumentNavigation', () => {
    const testInitialRender = async ({
        expectRefetch,
        options,
    }: {
        expectRefetch: boolean;
        options?: { enabled: boolean };
    }) => {
        const document = <GuidelineDocument>{ id: () => 1138 };
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'api').mockResolvedValueOnce(DocumentNavigationTreeDummy.default());

        const { result } = renderHook(() => useDocumentNavigation(appBridge, document, options));

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(expectRefetch ? false : true);
            expect(result.current.navigationItems).toEqual(expectRefetch ? DocumentNavigationTreeDummy.default() : []);
        });

        if (expectRefetch) {
            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith({ name: 'getDocumentNavigation', payload: { document } });
        }
    };

    const testEventHandler = async (emitEvent: () => void) => {
        const document = <GuidelineDocument>{ id: () => 1138 };
        const initialTree = DocumentNavigationTreeDummy.default();
        const updatedTree = DocumentNavigationTreeDummy.alternative();

        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'api').mockResolvedValue(initialTree);

        const { result } = renderHook(() => useDocumentNavigation(appBridge, document));

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.navigationItems).toEqual(initialTree);
        });

        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith({ name: 'getDocumentNavigation', payload: { document } });

        spy.mockResolvedValueOnce(updatedTree);

        emitEvent();

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledTimes(2);
            expect(result.current.navigationItems).toEqual(updatedTree);
        });
    };

    it('should not refetch on render when enabled is set to false', () =>
        testInitialRender({ expectRefetch: false, options: { enabled: false } }));

    it('should refetch on render when enabled is set to true', () =>
        testInitialRender({ expectRefetch: true, options: { enabled: true } }));

    it('should refetch on render when no options are given', () =>
        testInitialRender({ expectRefetch: true, options: undefined }));

    it('should refetch when the "AppBridge:GuidelineDocumentCategory:Action" event occurs', () =>
        testEventHandler(() => {
            window.emitter.emit('AppBridge:GuidelineDocumentCategory:Action', {
                action: 'add',
                documentCategory: <DocumentCategory>{},
            });
        }));

    it('should refetch when the "AppBridge:GuidelineDocumentPage:Action" event occurs', () =>
        testEventHandler(() => {
            window.emitter.emit('AppBridge:GuidelineDocumentPage:Action', {
                action: 'add',
                documentPage: <DocumentPage>{},
            });
        }));

    it('should refetch when the "AppBridge:GuidelineDocumentPageTargets:Action" event occurs', () =>
        testEventHandler(() => {
            window.emitter.emit('AppBridge:GuidelineDocumentPageTargets:Action', {
                action: 'update',
                payload: { targets: [], pageIds: [] },
            });
        }));

    it('should refetch when the "AppBridge:GuidelineDocumentSection:Action" event occurs', () =>
        testEventHandler(() => {
            window.emitter.emit('AppBridge:GuidelineDocumentSection:Action', {
                action: 'add',
                payload: { documentPageId: 0, documentSection: <DocumentSection>{}, previousDocumentSectionId: 0 },
            });
        }));
});
