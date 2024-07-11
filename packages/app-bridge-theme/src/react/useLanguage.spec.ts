/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { type AppBridgeTheme } from '../AppBridgeTheme';

import { useLanguage } from './useLanguage';

const INITIAL_LANGUAGE = 'de';
const UPDATED_LANGUAGE = 'es';

const stubs = vi.hoisted(() => ({
    contextStub: vi.fn(),
    subscribeStub: vi.fn(),
    unsubscribeObserverStub: vi.fn(),
}));

const stubbedAppBridgeTheme = () =>
    ({
        context: stubs.contextStub.mockReturnValue({
            get: () => INITIAL_LANGUAGE,
            subscribe: stubs.subscribeStub.mockReturnValue(stubs.unsubscribeObserverStub),
        }),
    }) as unknown as AppBridgeTheme;

describe('useLanguage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call the context with currentLanguage and defaultLanguage', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        renderHook(() => useLanguage(appBridgeTheme));

        expect(stubs.contextStub).toHaveBeenCalledWith('currentLanguage');
        expect(stubs.contextStub).toHaveBeenCalledWith('defaultLanguage');
    });

    it('should subscribe to context updates', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        renderHook(() => useLanguage(appBridgeTheme));

        expect(stubs.subscribeStub).toHaveBeenCalledTimes(2);
    });

    it('should return the correct initial language', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { result } = renderHook(() => useLanguage(appBridgeTheme));

        expect(result.current.currentLanguage).toEqual(INITIAL_LANGUAGE);
        expect(result.current.defaultLanguage).toEqual(INITIAL_LANGUAGE);
    });

    it('should update the language on change', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { result } = renderHook(() => useLanguage(appBridgeTheme));

        act(() => {
            if (vi.isMockFunction(stubs.subscribeStub)) {
                stubs.subscribeStub.mock.calls[0][0](UPDATED_LANGUAGE);
                stubs.subscribeStub.mock.calls[1][0](UPDATED_LANGUAGE);
            }
        });

        expect(result.current.currentLanguage).toEqual(UPDATED_LANGUAGE);
        expect(result.current.defaultLanguage).toEqual(UPDATED_LANGUAGE);
    });

    it('should unsubscribe on unmount', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { unmount } = renderHook(() => useLanguage(appBridgeTheme));

        unmount();

        expect(stubs.unsubscribeObserverStub).toHaveBeenCalledTimes(2);
    });
});
