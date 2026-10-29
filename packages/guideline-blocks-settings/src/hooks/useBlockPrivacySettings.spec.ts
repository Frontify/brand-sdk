/* (c) Copyright Frontify Ltd., all rights reserved. */

import { getAppBridgeBlockStub } from '@frontify/app-bridge/testing';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Security } from '../settings/types';

import { useBlockPrivacySettings } from './useBlockPrivacySettings';

const ALL_OVERRIDES = { assetViewerId: 'assetViewerEnabled', downloadableId: 'downloadable' };

describe('useBlockPrivacySettings', () => {
    it('should return the global privacy settings when the block security is global', () => {
        const appBridge = getAppBridgeBlockStub({
            blockSettings: { security: Security.Global, assetViewerEnabled: true, downloadable: true },
            privacySettings: { assetViewerEnabled: false, assetDownloadEnabled: false },
        });

        const { result } = renderHook(() => useBlockPrivacySettings(appBridge, ALL_OVERRIDES));

        expect(result.current).toEqual({ assetViewerEnabled: false, assetDownloadEnabled: false });
    });

    it('should return the global privacy settings when the block never set its security', () => {
        const appBridge = getAppBridgeBlockStub({
            blockSettings: { assetViewerEnabled: true, downloadable: true },
            privacySettings: { assetViewerEnabled: false, assetDownloadEnabled: false },
        });

        const { result } = renderHook(() => useBlockPrivacySettings(appBridge, ALL_OVERRIDES));

        expect(result.current).toEqual({ assetViewerEnabled: false, assetDownloadEnabled: false });
    });

    it('should return the block overrides when the block security is custom', () => {
        const appBridge = getAppBridgeBlockStub({
            blockSettings: { security: Security.Custom, assetViewerEnabled: true, downloadable: false },
            privacySettings: { assetViewerEnabled: false, assetDownloadEnabled: true },
        });

        const { result } = renderHook(() => useBlockPrivacySettings(appBridge, ALL_OVERRIDES));

        expect(result.current).toEqual({ assetViewerEnabled: true, assetDownloadEnabled: false });
    });

    it('should keep the global value of a privacy setting the block has no override for', () => {
        const appBridge = getAppBridgeBlockStub({
            blockSettings: { security: Security.Custom, assetViewerEnabled: true, downloadable: true },
            privacySettings: { assetViewerEnabled: false, assetDownloadEnabled: false },
        });

        const { result } = renderHook(() => useBlockPrivacySettings(appBridge, { downloadableId: 'downloadable' }));

        expect(result.current).toEqual({ assetViewerEnabled: false, assetDownloadEnabled: true });
    });

    it('should fall back to the setting defaults when the block never stored its overrides', () => {
        const appBridge = getAppBridgeBlockStub({
            blockSettings: { security: Security.Custom },
            privacySettings: { assetViewerEnabled: false, assetDownloadEnabled: true },
        });

        const { result } = renderHook(() => useBlockPrivacySettings(appBridge, ALL_OVERRIDES));

        expect(result.current).toEqual({ assetViewerEnabled: true, assetDownloadEnabled: false });
    });

    it('should read the overrides from custom setting ids', () => {
        const appBridge = getAppBridgeBlockStub({
            blockSettings: { customSecurity: Security.Custom, customViewer: false, customDownload: true },
            privacySettings: { assetViewerEnabled: true, assetDownloadEnabled: false },
        });

        const { result } = renderHook(() =>
            useBlockPrivacySettings(appBridge, {
                globalControlId: 'customSecurity',
                assetViewerId: 'customViewer',
                downloadableId: 'customDownload',
            }),
        );

        expect(result.current).toEqual({ assetViewerEnabled: false, assetDownloadEnabled: true });
    });

    it('should update when the block switches its security to custom', async () => {
        const appBridge = getAppBridgeBlockStub({
            blockSettings: { security: Security.Global, assetViewerEnabled: true, downloadable: true },
            privacySettings: { assetViewerEnabled: false, assetDownloadEnabled: false },
        });

        const { result } = renderHook(() => useBlockPrivacySettings(appBridge, ALL_OVERRIDES));
        await act(() => appBridge.updateBlockSettings({ security: Security.Custom }));

        expect(result.current).toEqual({ assetViewerEnabled: true, assetDownloadEnabled: true });
    });
});
