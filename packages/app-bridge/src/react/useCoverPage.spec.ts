// @vitest-environment happy-dom

/* (c) Copyright Frontify Ltd., all rights reserved. */

import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { CoverPage, CoverPageUpdate } from '../types';

import { useCoverPage } from './useCoverPage';
import { CoverPageDummy, getAppBridgeThemeStub } from '../tests';

describe('useCoverPage', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should return the cover page from appBridge', async () => {
        const appBridge = getAppBridgeThemeStub();

        const coverPage = CoverPageDummy.with(1);
        appBridge.getCoverPage.resolves(coverPage);

        const { result } = renderHook(() => useCoverPage(appBridge));

        expect(result.current.coverPage).toBe(null);

        await act(async () => {
            await appBridge.getCoverPage();
        });

        expect(result.current.coverPage).toEqual(coverPage);
    });

    it('should update the cover page when an event is emitted', () => {
        const appBridge = getAppBridgeThemeStub();

        const { result } = renderHook(() => useCoverPage(appBridge));

        const updatedCoverPage: CoverPageUpdate = { id: 1, title: 'Updated Cover Page' };

        act(() => {
            window.emitter.emit('AppBridge:GuidelineCoverPageAction', {
                action: 'update',
                coverPage: updatedCoverPage as CoverPage,
            });
        });

        expect(result.current.coverPage).toEqual(updatedCoverPage);
    });

    it('should set the cover page to null when an event to delete it is emitted', () => {
        const appBridge = getAppBridgeThemeStub();

        const { result } = renderHook(() => useCoverPage(appBridge));

        result.current.coverPage = null;

        act(() => {
            window.emitter.emit('AppBridge:GuidelineCoverPageAction', { action: 'delete' });
        });

        expect(result.current.coverPage).toBe(null);
    });

    it('should not update the cover page when an event with an invalid action is emitted', () => {
        const appBridge = getAppBridgeThemeStub();

        const { result } = renderHook(() => useCoverPage(appBridge));

        result.current.coverPage = CoverPageDummy.with(1);

        act(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            window.emitter.emit('AppBridge:GuidelineCoverPageAction', { action: 'invalid' as any });
        });

        expect(result.current.coverPage).toEqual(CoverPageDummy.with(1));
    });

    it('should start fetching only when it is enabled', () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getCoverPage');

        let enabled = false;

        const { rerender } = renderHook(() => useCoverPage(appBridge, { enabled }));

        expect(spy).not.toBeCalled();

        enabled = true;
        rerender();

        expect(spy).toBeCalled();
    });

    it('should unregister when unmounted', () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(window.emitter, 'off');

        const { unmount } = renderHook(() => useCoverPage(appBridge));

        unmount();

        expect(spy).toBeCalledWith('AppBridge:GuidelineCoverPageAction', expect.any(Function));
    });
});
