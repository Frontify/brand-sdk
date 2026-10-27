/* (c) Copyright Frontify Ltd., all rights reserved. */

import { act, renderHook } from '@testing-library/react';
import mitt from 'mitt';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getAppBridgeBlockStub } from '../tests';

import { usePrivacySettings } from './usePrivacySettings';

describe('usePrivacySettings', () => {
    beforeEach(() => {
        window.emitter = mitt();
    });

    it('should set imageAndVideoDownloadEnabled to true if enabled', () => {
        const appBridgeStub = getAppBridgeBlockStub({
            privacySettings: {
                assetDownloadEnabled: true,
                assetViewerEnabled: false,
            },
        });
        const { result } = renderHook(() => usePrivacySettings(appBridgeStub));
        expect(result.current.assetDownloadEnabled).toBe(true);
    });

    it('should set imageAndVideoDownloadEnabled to false if disabled', () => {
        const appBridgeStub = getAppBridgeBlockStub({
            privacySettings: {
                assetDownloadEnabled: false,
                assetViewerEnabled: false,
            },
        });
        const { result } = renderHook(() => usePrivacySettings(appBridgeStub));
        expect(result.current.assetDownloadEnabled).toBe(false);
    });

    it('should set assetViewerEnabled to true if enabled', () => {
        const appBridgeStub = getAppBridgeBlockStub({
            privacySettings: {
                assetViewerEnabled: true,
                assetDownloadEnabled: false,
            },
        });
        const { result } = renderHook(() => usePrivacySettings(appBridgeStub));
        expect(result.current.assetViewerEnabled).toBe(true);
    });

    it('should set assetViewerEnabled to false if disabled', () => {
        const appBridgeStub = getAppBridgeBlockStub({
            privacySettings: {
                assetViewerEnabled: false,
                assetDownloadEnabled: false,
            },
        });
        const { result } = renderHook(() => usePrivacySettings(appBridgeStub));
        expect(result.current.assetViewerEnabled).toBe(false);
    });

    it('should set imageAndVideoDownloadEnabled to true on AppBridge:PrivacySettingsChanged', () => {
        const appBridgeStub = getAppBridgeBlockStub({
            privacySettings: {
                assetDownloadEnabled: false,
                assetViewerEnabled: false,
            },
        });
        const { result, rerender } = renderHook(() => usePrivacySettings(appBridgeStub));
        window.emitter.emit('AppBridge:PrivacySettingsChanged', {
            assetDownloadEnabled: true,
            assetViewerEnabled: false,
        });
        rerender();
        expect(result.current.assetDownloadEnabled).toBe(true);
    });

    it('should set imageAndVideoDownloadEnabled to false on AppBridge:PrivacySettingsChanged', () => {
        const appBridgeStub = getAppBridgeBlockStub({
            privacySettings: {
                assetDownloadEnabled: true,
                assetViewerEnabled: false,
            },
        });
        const { result, rerender } = renderHook(() => usePrivacySettings(appBridgeStub));
        window.emitter.emit('AppBridge:PrivacySettingsChanged', {
            assetDownloadEnabled: false,
            assetViewerEnabled: false,
        });
        rerender();
        expect(result.current.assetDownloadEnabled).toBe(false);
    });

    it('should set assetViewerEnabled to true on AppBridge:PrivacySettingsChanged', () => {
        const appBridgeStub = getAppBridgeBlockStub({
            privacySettings: {
                assetViewerEnabled: false,
                assetDownloadEnabled: false,
            },
        });
        const { result, rerender } = renderHook(() => usePrivacySettings(appBridgeStub));
        window.emitter.emit('AppBridge:PrivacySettingsChanged', {
            assetViewerEnabled: true,
            assetDownloadEnabled: false,
        });
        rerender();
        expect(result.current.assetViewerEnabled).toBe(true);
    });

    it('should set assetViewerEnabled to false on AppBridge:PrivacySettingsChanged', () => {
        const appBridgeStub = getAppBridgeBlockStub({
            privacySettings: {
                assetViewerEnabled: true,
                assetDownloadEnabled: false,
            },
        });
        const { result, rerender } = renderHook(() => usePrivacySettings(appBridgeStub));
        window.emitter.emit('AppBridge:PrivacySettingsChanged', {
            assetViewerEnabled: false,
            assetDownloadEnabled: false,
        });
        rerender();
        expect(result.current.assetViewerEnabled).toBe(false);
    });

    it('should read the privacy settings from the host only once', () => {
        const appBridgeStub = getAppBridgeBlockStub({
            privacySettings: {
                assetViewerEnabled: true,
                assetDownloadEnabled: true,
            },
        });
        const { rerender } = renderHook(() => usePrivacySettings(appBridgeStub));
        rerender();
        rerender();

        expect(appBridgeStub.getPrivacySettings.callCount).toBe(1);
    });

    it('should subscribe to privacy settings changes once and merge every change', () => {
        const appBridgeStub = getAppBridgeBlockStub({
            privacySettings: {
                assetViewerEnabled: false,
                assetDownloadEnabled: false,
            },
        });
        const onSpy = vi.spyOn(window.emitter, 'on');
        const { result } = renderHook(() => usePrivacySettings(appBridgeStub));

        act(() => {
            window.emitter.emit('AppBridge:PrivacySettingsChanged', {
                assetViewerEnabled: true,
                assetDownloadEnabled: false,
            });
        });
        act(() => {
            window.emitter.emit('AppBridge:PrivacySettingsChanged', {
                assetViewerEnabled: true,
                assetDownloadEnabled: true,
            });
        });

        expect(result.current).toEqual({ assetViewerEnabled: true, assetDownloadEnabled: true });
        const subscriptions = onSpy.mock.calls.filter(
            (args: unknown[]) => args[0] === 'AppBridge:PrivacySettingsChanged',
        );
        expect(subscriptions).toHaveLength(1);
    });
});
