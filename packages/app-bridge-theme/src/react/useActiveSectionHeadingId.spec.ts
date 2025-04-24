/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { type AppBridgeTheme } from '../AppBridgeTheme';

import { useActiveSectionHeadingId } from './useActiveSectionHeadingId';

const UPDATED_HEADING_ID = 321;

const stubs = vi.hoisted(() => ({
    contextStub: vi.fn(),
    contextGetStub: vi.fn(),
    subscribeStub: vi.fn(),
    unsubscribeObserverStub: vi.fn(),
}));

const stubbedAppBridgeTheme = () =>
    ({
        context: stubs.contextStub.mockReturnValue({
            get: stubs.contextGetStub.mockReturnValue(null),
            subscribe: stubs.subscribeStub.mockReturnValue(stubs.unsubscribeObserverStub),
        }),
    }) as unknown as AppBridgeTheme;

describe('useActiveSectionHeadingId', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call the context with ActiveSectionHeadingId', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        renderHook(() => useActiveSectionHeadingId(appBridgeTheme));

        expect(stubs.contextStub).toHaveBeenCalledWith('activeSectionHeadingId');
    });

    it('should subscribe to context updates', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        renderHook(() => useActiveSectionHeadingId(appBridgeTheme));

        expect(stubs.subscribeStub).toHaveBeenCalledOnce();
    });

    it('should return the correct initial ActiveSectionHeadingId', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { result } = renderHook(() => useActiveSectionHeadingId(appBridgeTheme));

        expect(result.current).toBeNull();
    });

    it('should update the ActiveSectionHeadingId on change', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { result } = renderHook(() => useActiveSectionHeadingId(appBridgeTheme));

        act(() => {
            if (vi.isMockFunction(stubs.subscribeStub)) {
                stubs.contextGetStub.mockReturnValue(UPDATED_HEADING_ID);
                stubs.subscribeStub.mock.calls[0][0](UPDATED_HEADING_ID);
            }
        });

        expect(result.current).toEqual(UPDATED_HEADING_ID);
    });

    it('should unsubscribe on unmount', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { unmount } = renderHook(() => useActiveSectionHeadingId(appBridgeTheme));

        unmount();

        expect(stubs.unsubscribeObserverStub).toHaveBeenCalledOnce();
    });
});
