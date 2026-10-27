/* (c) Copyright Frontify Ltd., all rights reserved. */

import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getAppBridgeBlockStub } from '../tests';
import { type PrivacySettings } from '../types/PrivacySettings';

import { usePrivacySettings } from './usePrivacySettings';

const createHostPrivacySettings = (initialPrivacySettings: PrivacySettings) => {
    let privacySettings = initialPrivacySettings;
    const subscribers = new Set<(nextPrivacySettings: PrivacySettings) => void>();

    return {
        context: {
            get: () => privacySettings,
            subscribe: (callback: (nextPrivacySettings: PrivacySettings) => void) => {
                subscribers.add(callback);
                return () => subscribers.delete(callback);
            },
        },
        set: (nextPrivacySettings: PrivacySettings) => {
            privacySettings = nextPrivacySettings;
            for (const subscriber of subscribers) {
                subscriber(nextPrivacySettings);
            }
        },
        subscriberCount: () => subscribers.size,
    };
};

describe('usePrivacySettings', () => {
    afterEach(() => {
        cleanup();
    });

    it('should read the privacy settings from the host context', () => {
        const appBridge = getAppBridgeBlockStub();
        const host = createHostPrivacySettings({ assetViewerEnabled: true, assetDownloadEnabled: true });
        appBridge.context.withArgs('privacySettings').returns(host.context);

        const { result } = renderHook(() => usePrivacySettings(appBridge));

        expect(result.current).toEqual({ assetViewerEnabled: true, assetDownloadEnabled: true });
    });

    it('should update when the host publishes new privacy settings', () => {
        const appBridge = getAppBridgeBlockStub();
        const host = createHostPrivacySettings({ assetViewerEnabled: false, assetDownloadEnabled: false });
        appBridge.context.withArgs('privacySettings').returns(host.context);

        const { result } = renderHook(() => usePrivacySettings(appBridge));
        act(() => host.set({ assetViewerEnabled: true, assetDownloadEnabled: false }));

        expect(result.current).toEqual({ assetViewerEnabled: true, assetDownloadEnabled: false });
    });

    it('should unsubscribe from the host context on unmount', () => {
        const appBridge = getAppBridgeBlockStub();
        const host = createHostPrivacySettings({ assetViewerEnabled: false, assetDownloadEnabled: false });
        appBridge.context.withArgs('privacySettings').returns(host.context);

        const { unmount } = renderHook(() => usePrivacySettings(appBridge));
        expect(host.subscriberCount()).toBe(1);
        unmount();

        expect(host.subscriberCount()).toBe(0);
    });

    it('should subscribe to the host context only once across re-renders', () => {
        const appBridge = getAppBridgeBlockStub();
        const host = createHostPrivacySettings({ assetViewerEnabled: false, assetDownloadEnabled: false });
        const subscribeSpy = vi.spyOn(host.context, 'subscribe');
        appBridge.context.withArgs('privacySettings').returns(host.context);

        const { rerender } = renderHook(() => usePrivacySettings(appBridge));
        rerender();
        act(() => host.set({ assetViewerEnabled: true, assetDownloadEnabled: true }));
        rerender();

        expect(subscribeSpy).toHaveBeenCalledTimes(1);
    });

    it('should read the privacy settings of the block stub', () => {
        const appBridge = getAppBridgeBlockStub({
            privacySettings: { assetViewerEnabled: true, assetDownloadEnabled: false },
        });

        const { result } = renderHook(() => usePrivacySettings(appBridge));

        expect(result.current).toEqual({ assetViewerEnabled: true, assetDownloadEnabled: false });
    });
});
