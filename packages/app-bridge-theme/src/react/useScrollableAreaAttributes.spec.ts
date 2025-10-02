/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { type AppBridgeTheme } from '../AppBridgeTheme';

import { useScrollableAreaAttributes } from './useScrollableAreaAttributes';

const UPDATED_SCROLL_POSITION = {
    scrollTop: 200,
};

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

describe('scrollableAreaAttributes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call the context with useScrollableAreaAttributes', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        renderHook(() => useScrollableAreaAttributes(appBridgeTheme));

        expect(stubs.contextStub).toHaveBeenCalledWith('scrollableAreaAttributes');
    });

    it('should subscribe to context updates', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        renderHook(() => useScrollableAreaAttributes(appBridgeTheme));

        expect(stubs.subscribeStub).toHaveBeenCalledOnce();
    });

    it('should return the correct initial ScrollableAreaAttributes', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { result } = renderHook(() => useScrollableAreaAttributes(appBridgeTheme));

        expect(result.current).toBeNull();
    });

    it('should update the scrollableAreaAttributes on change', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { result } = renderHook(() => useScrollableAreaAttributes(appBridgeTheme));

        act(() => {
            if (vi.isMockFunction(stubs.subscribeStub)) {
                stubs.contextGetStub.mockReturnValue(UPDATED_SCROLL_POSITION);
                stubs.subscribeStub.mock.calls[0][0](UPDATED_SCROLL_POSITION);
            }
        });

        expect(result.current).toEqual(UPDATED_SCROLL_POSITION);
    });

    it('should unsubscribe on unmount', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { unmount } = renderHook(() => useScrollableAreaAttributes(appBridgeTheme));

        unmount();

        expect(stubs.unsubscribeObserverStub).toHaveBeenCalledOnce();
    });
});
