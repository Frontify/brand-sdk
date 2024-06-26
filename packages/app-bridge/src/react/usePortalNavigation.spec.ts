// @vitest-environment happy-dom

/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PortalNavigationTreeDummy, getAppBridgeThemeStub } from '../tests';

import { usePortalNavigation } from './usePortalNavigation';

const DEFAULT_NAVIGATION_TREE = PortalNavigationTreeDummy.default();

describe('usePortalNavigation', () => {
    it('should return the preview and refetch when the cover page is deleted', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'api');

        spy.mockResolvedValueOnce(DEFAULT_NAVIGATION_TREE);

        const { result } = renderHook(() => usePortalNavigation(appBridge));

        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith({ name: 'getPortalNavigation' });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.navigationItems).toEqual(DEFAULT_NAVIGATION_TREE);
        });

        const coverPageIndex = DEFAULT_NAVIGATION_TREE.findIndex((item) => item.type === 'cover-page');
        const updatedNavigationTree = [...DEFAULT_NAVIGATION_TREE];
        updatedNavigationTree.splice(coverPageIndex, 1);

        spy.mockResolvedValueOnce(updatedNavigationTree);

        // Trigger a "cover page deleted" event
        window.emitter.emit('AppBridge:GuidelineCoverPage:Action', { action: 'delete' });

        await waitFor(() => {
            expect(spy).toHaveBeenCalledTimes(2);
            expect(spy).toHaveBeenCalledWith({ name: 'getPortalNavigation' });
            expect(result.current.navigationItems).toEqual(updatedNavigationTree);
        });
    });

    it('should return the preview and refetch when a document group is deleted', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'api');

        spy.mockResolvedValueOnce(DEFAULT_NAVIGATION_TREE);

        const { result } = renderHook(() => usePortalNavigation(appBridge));

        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith({ name: 'getPortalNavigation' });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.navigationItems).toEqual(DEFAULT_NAVIGATION_TREE);
        });

        const groupIndex = DEFAULT_NAVIGATION_TREE.findIndex((item) => item.id() === 200);
        const updatedNavigationTree = [...DEFAULT_NAVIGATION_TREE];
        updatedNavigationTree.splice(groupIndex, 1);

        spy.mockResolvedValueOnce(updatedNavigationTree);

        // Trigger a "document group deleted" event
        window.emitter.emit('AppBridge:GuidelineDocumentGroup:Action', {
            documentGroup: { id: 200 },
            action: 'delete',
        });

        await waitFor(() => {
            expect(spy).toHaveBeenCalledTimes(2);
            expect(spy).toHaveBeenCalledWith({ name: 'getPortalNavigation' });
            expect(result.current.navigationItems).toEqual(updatedNavigationTree);
        });
    });

    it('should return the previous tree and refetch when an incorrect document group id is deleted', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'api');

        spy.mockResolvedValue(DEFAULT_NAVIGATION_TREE);

        const { result } = renderHook(() => usePortalNavigation(appBridge));

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.navigationItems).toEqual(DEFAULT_NAVIGATION_TREE);
        });

        // Trigger a "document group deleted" event
        window.emitter.emit('AppBridge:GuidelineDocumentGroup:Action', {
            documentGroup: { id: 2000 },
            action: 'delete',
        });

        await waitFor(() => {
            expect(spy).toHaveBeenCalledTimes(2);
            expect(result.current.navigationItems).toEqual(DEFAULT_NAVIGATION_TREE);
            expect(spy).toHaveBeenCalledWith({ name: 'getPortalNavigation' });
        });
    });

    it('should return the preview and refetch when a document at root level is deleted', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'api');

        spy.mockResolvedValueOnce(DEFAULT_NAVIGATION_TREE);

        const { result } = renderHook(() => usePortalNavigation(appBridge));

        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith({ name: 'getPortalNavigation' });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.navigationItems).toEqual(DEFAULT_NAVIGATION_TREE);
        });

        const documentIndex = DEFAULT_NAVIGATION_TREE.findIndex((item) => item.id() === 101);
        const updatedNavigationTree = [...DEFAULT_NAVIGATION_TREE];
        updatedNavigationTree.splice(documentIndex, 1);

        spy.mockResolvedValueOnce(updatedNavigationTree);

        // Trigger a "document deleted" event
        window.emitter.emit('AppBridge:GuidelineDocument:Action', {
            document: { id: 101 },
            action: 'delete',
        });

        await waitFor(() => {
            expect(spy).toHaveBeenCalledTimes(2);
            expect(spy).toHaveBeenCalledWith({ name: 'getPortalNavigation' });
            expect(result.current.navigationItems).toEqual(updatedNavigationTree);
        });
    });

    it('should return the same tree and refetch when a document within a group is deleted', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'api');

        spy.mockResolvedValue(DEFAULT_NAVIGATION_TREE);

        const { result } = renderHook(() => usePortalNavigation(appBridge));

        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith({ name: 'getPortalNavigation' });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.navigationItems).toEqual(DEFAULT_NAVIGATION_TREE);
        });

        // Trigger a "document deleted" event
        window.emitter.emit('AppBridge:GuidelineDocument:Action', {
            document: { id: 201, documentGroupId: 200 },
            action: 'delete',
        });

        await waitFor(() => {
            expect(spy).toHaveBeenCalledTimes(2);
            expect(spy).toHaveBeenCalledWith({ name: 'getPortalNavigation' });
            expect(result.current.navigationItems).toEqual(DEFAULT_NAVIGATION_TREE);
        });
    });

    it('should fetch the navigation tree on mount', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'api');

        spy.mockResolvedValueOnce(DEFAULT_NAVIGATION_TREE);

        const { result } = renderHook(() => usePortalNavigation(appBridge));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith({ name: 'getPortalNavigation' });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.navigationItems).toEqual(DEFAULT_NAVIGATION_TREE);
        });
    });

    it('should refetch if targets in documents change', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'api');

        spy.mockResolvedValue(DEFAULT_NAVIGATION_TREE);

        const { result } = renderHook(() => usePortalNavigation(appBridge));

        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith({ name: 'getPortalNavigation' });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        // Trigger a "document targets changed" event
        window.emitter.emit('AppBridge:GuidelineDocumentTargets:Action', {
            payload: { targets: [], documentIds: [] },
            action: 'update',
        });

        await waitFor(() => {
            expect(spy).toHaveBeenCalledTimes(2);
            expect(result.current.isLoading).toBe(false);
        });
    });

    it('should show document group in new position and refetch when a document group is moved', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'api');

        spy.mockResolvedValueOnce(DEFAULT_NAVIGATION_TREE);

        const { result } = renderHook(() => usePortalNavigation(appBridge));

        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith({ name: 'getPortalNavigation' });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        const NEW_POSITION = 1;
        const groupIndex = DEFAULT_NAVIGATION_TREE.findIndex((item) => item.id() === 200);
        const updatedNavigationTree = [...DEFAULT_NAVIGATION_TREE];
        const movedGroup = updatedNavigationTree.splice(groupIndex, 1);
        updatedNavigationTree.splice(NEW_POSITION, 0, ...movedGroup);

        spy.mockResolvedValueOnce(updatedNavigationTree);

        // Trigger a "document group is moved" event
        window.emitter.emit('AppBridge:GuidelineDocumentGroup:MoveEvent', {
            action: 'movePreview',
            position: NEW_POSITION,
            documentGroup: { id: 200, sort: 3 },
        });

        await waitFor(() => {
            expect(result.current.navigationItems).toEqual(updatedNavigationTree);
        });
    });

    it('should show document in new position when a document is moved at root level', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'api');

        spy.mockResolvedValueOnce(DEFAULT_NAVIGATION_TREE);

        const { result } = renderHook(() => usePortalNavigation(appBridge));

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        const NEW_POSITION = 2;
        const documentIndex = DEFAULT_NAVIGATION_TREE.findIndex((item) => item.id() === 121);
        const updatedNavigationTree = [...DEFAULT_NAVIGATION_TREE];
        const movedDocument = updatedNavigationTree.splice(documentIndex, 1);
        updatedNavigationTree.splice(NEW_POSITION, 0, ...movedDocument);

        // Trigger a "document is moved" event
        window.emitter.emit('AppBridge:GuidelineDocument:MoveEvent', {
            action: 'movePreview',
            position: NEW_POSITION,
            document: { id: 121, sort: 5 },
        });

        await waitFor(() => {
            expect(result.current.navigationItems).toEqual(updatedNavigationTree);
        });

        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith({ name: 'getPortalNavigation' });
    });

    it('should return the same tree when a document is moved within/in/out a group', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'api');

        spy.mockResolvedValueOnce(DEFAULT_NAVIGATION_TREE);

        const { result } = renderHook(() => usePortalNavigation(appBridge));

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        const NEW_POSITION = 2;

        // Trigger a "document is moved" event
        window.emitter.emit('AppBridge:GuidelineDocument:MoveEvent', {
            action: 'movePreview',
            position: NEW_POSITION,
            document: { id: 201, sort: 2, documentGroupId: 200 },
            newGroupId: undefined,
        });

        await waitFor(() => {
            expect(result.current.navigationItems).toEqual(DEFAULT_NAVIGATION_TREE);
        });

        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith({ name: 'getPortalNavigation' });
    });
});
