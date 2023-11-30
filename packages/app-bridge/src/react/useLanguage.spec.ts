/* (c) Copyright Frontify Ltd., all rights reserved. */

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useLanguage } from './useLanguage';
import { getAppBridgeThemeStub } from '../tests/AppBridgeThemeStub';

describe('useLanguage', () => {
    it('should return default language initially', () => {
        const appBridge = getAppBridgeThemeStub();
        appBridge.context.withArgs('currentLanguage').returns({ get: () => 'fr', subscribe: () => vi.fn() });
        appBridge.context.withArgs('defaultLanguage').returns({ get: () => 'en', subscribe: () => vi.fn() });

        const { result } = renderHook(() => useLanguage(appBridge));

        expect(result.current.currentLanguage).toEqual('fr');
        expect(result.current.defaultLanguage).toEqual('en');
    });

    it('should update language on context change', () => {
        const appBridge = getAppBridgeThemeStub();
        appBridge.context.withArgs('currentLanguage').returns({
            get: () => 'fr',
            subscribe: vi.fn(),
        });
        appBridge.context.withArgs('defaultLanguage').returns({
            get: () => 'en',
            subscribe: vi.fn(),
        });

        const { result } = renderHook(() => useLanguage(appBridge));

        expect(result.current.currentLanguage).toEqual('fr');
        expect(result.current.defaultLanguage).toEqual('en');

        act(() => {
            const subscribeFn = appBridge.context('currentLanguage').subscribe;
            if (vi.isMockFunction(subscribeFn)) {
                subscribeFn.mock.calls[0][0]('de');
            }
        });

        expect(result.current.currentLanguage).toEqual('de');
        expect(result.current.defaultLanguage).toEqual('en');
    });

    it('should unsubscribe on unmount', () => {
        const appBridge = getAppBridgeThemeStub();
        const mockUnsubscribeCurrentLanguage = vi.fn();
        const mockUnsubscribeDefaultLanguage = vi.fn();

        appBridge.context
            .withArgs('currentLanguage')
            .returns({ get: () => 'fr', subscribe: () => mockUnsubscribeCurrentLanguage });
        appBridge.context
            .withArgs('defaultLanguage')
            .returns({ get: () => 'en', subscribe: () => mockUnsubscribeDefaultLanguage });

        const { unmount } = renderHook(() => useLanguage(appBridge));

        unmount();

        expect(mockUnsubscribeCurrentLanguage).toHaveBeenCalledTimes(1);
        expect(mockUnsubscribeDefaultLanguage).toHaveBeenCalledTimes(1);
    });
});
