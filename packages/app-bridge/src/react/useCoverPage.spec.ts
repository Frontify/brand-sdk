/* (c) Copyright Frontify Ltd., all rights reserved. */

import mitt from 'mitt';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import type { CoverPage, CoverPageUpdate, Emitter } from '../types';
import type { AppBridgeTheme } from '../AppBridgeTheme';

import { useCoverPage } from './useCoverPage';
import { CoverPageDummy } from '../tests';

describe('useCoverPage', () => {
    const appBridge: AppBridgeTheme = {} as AppBridgeTheme;
    let emitter: Emitter;

    beforeAll(() => {
        window.emitter = mitt();
    });

    beforeEach(() => {
        emitter = mitt();
        vi.spyOn(window, 'emitter', 'get').mockReturnValue(emitter);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should return the cover page from appBridge', async () => {
        const coverPage = CoverPageDummy.with(1);

        appBridge.getCoverPage = vi.fn().mockResolvedValue(coverPage);

        const { result } = renderHook(() => useCoverPage(appBridge));

        expect(result.current.coverPage).toBe(null);

        await act(async () => {
            await appBridge.getCoverPage();
        });

        expect(result.current.coverPage).toEqual(coverPage);
    });

    it('should update the cover page when an event is emitted', () => {
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
        const { result } = renderHook(() => useCoverPage(appBridge));

        result.current.coverPage = null;

        act(() => {
            window.emitter.emit('AppBridge:GuidelineCoverPageAction', { action: 'delete' });
        });

        expect(result.current.coverPage).toBe(null);
    });

    it('should not update the cover page when an event with an invalid action is emitted', () => {
        const { result } = renderHook(() => useCoverPage(appBridge));

        result.current.coverPage = CoverPageDummy.with(1);

        act(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            window.emitter.emit('AppBridge:GuidelineCoverPageAction', { action: 'invalid' as any });
        });

        expect(result.current.coverPage).toEqual(CoverPageDummy.with(1));
    });
});
