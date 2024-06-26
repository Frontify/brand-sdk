/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook } from '@testing-library/react';
import mitt from 'mitt';
import { beforeEach, describe, expect, it } from 'vitest';

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
});
