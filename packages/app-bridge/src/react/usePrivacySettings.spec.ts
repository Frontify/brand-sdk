/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook, waitFor } from '@testing-library/react';
import mitt from 'mitt';
import sinon from 'sinon';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { usePrivacySettings } from './usePrivacySettings';
import { getAppBridgeBlockStub } from '../tests';

describe('usePrivacySettings', () => {
    beforeEach(() => {
        window.emitter = mitt();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should set imageAndVideoDownloadEnabled to true if enabled', async () => {
        const appBridgeStub = getAppBridgeBlockStub({
            privacySettings: {
                assetDownloadEnabled: true,
                assetViewerEnabled: false,
            },
        });
        const { result } = renderHook(() => usePrivacySettings(appBridgeStub));
        await waitFor(() => {
            return result.current.assetDownloadEnabled === true;
        });
        expect(result.current.assetDownloadEnabled).toBe(true);
    });

    it('should set imageAndVideoDownloadEnabled to false if disabled', async () => {
        const appBridgeStub = getAppBridgeBlockStub({
            privacySettings: {
                assetDownloadEnabled: false,
                assetViewerEnabled: false,
            },
        });
        const { result } = renderHook(() => usePrivacySettings(appBridgeStub));
        await waitFor(() => {
            return result.current.assetDownloadEnabled === false;
        });
        expect(result.current.assetDownloadEnabled).toBe(false);
    });

    it('should set assetViewerEnabled to true if enabled', async () => {
        const appBridgeStub = getAppBridgeBlockStub({
            privacySettings: {
                assetViewerEnabled: true,
                assetDownloadEnabled: false,
            },
        });
        const { result } = renderHook(() => usePrivacySettings(appBridgeStub));
        await waitFor(() => {
            return result.current.assetViewerEnabled === true;
        });
        expect(result.current.assetViewerEnabled).toBe(true);
    });

    it('should set assetViewerEnabled to false if disabled', async () => {
        const appBridgeStub = getAppBridgeBlockStub({
            privacySettings: {
                assetViewerEnabled: false,
                assetDownloadEnabled: false,
            },
        });
        const { result } = renderHook(() => usePrivacySettings(appBridgeStub));
        await waitFor(() => {
            return result.current.assetViewerEnabled === false;
        });
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
