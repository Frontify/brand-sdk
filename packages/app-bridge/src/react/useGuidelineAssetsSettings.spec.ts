/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook } from '@testing-library/react';
import mitt from 'mitt';
import { beforeEach, describe, expect, it } from 'vitest';
import { useGuidelineAssetsSettings } from './useGuidelineAssetsSettings';

const setDownloadSettingOnWindow = (download: 'enable' | 'disable') => {
    window.application = Object.assign(window.application ?? {}, {
        sandbox: {
            config: {
                context: {
                    appearance: {
                        privacy: {
                            image: {
                                download,
                            },
                        },
                    },
                },
            },
        },
    });
};

const setAssetViewerSettingOnWindow = (enabled: boolean) => {
    window.application = Object.assign(window.application ?? {}, {
        sandbox: {
            config: {
                context: {
                    appearance: {
                        asset_viewer_enabled: enabled,
                    },
                },
            },
        },
    });
};

describe('useGuidelineAssetsSettings', () => {
    beforeEach(() => {
        window.emitter = mitt();
    });

    it('should set imageAndVideoDownloadEnabled to true if enabled', () => {
        setDownloadSettingOnWindow('enable');
        const { result } = renderHook(() => useGuidelineAssetsSettings());
        expect(result.current.imageAndVideoDownloadEnabled).toBe(true);
    });

    it('should set imageAndVideoDownloadEnabled to false if disabled', () => {
        setDownloadSettingOnWindow('disable');
        const { result } = renderHook(() => useGuidelineAssetsSettings());
        expect(result.current.imageAndVideoDownloadEnabled).toBe(false);
    });

    it('should set assetViewerEnabled to true if enabled', () => {
        setAssetViewerSettingOnWindow(true);
        const { result } = renderHook(() => useGuidelineAssetsSettings());
        expect(result.current.assetViewerEnabled).toBe(true);
    });

    it('should set assetViewerEnabled to false if disabled', () => {
        setAssetViewerSettingOnWindow(false);
        const { result } = renderHook(() => useGuidelineAssetsSettings());
        expect(result.current.assetViewerEnabled).toBe(false);
    });

    it('should set imageAndVideoDownloadEnabled to true on AppBridge:GuidelineAssetsSettingsChanged', () => {
        setDownloadSettingOnWindow('disable');
        const { result, rerender } = renderHook(() => useGuidelineAssetsSettings());
        window.emitter.emit('AppBridge:GuidelineAssetsSettingsChanged', { imageAndVideoDownloadEnabled: true });
        rerender();
        expect(result.current.imageAndVideoDownloadEnabled).toBe(true);
    });

    it('should set imageAndVideoDownloadEnabled to false on AppBridge:GuidelineAssetsSettingsChanged', () => {
        setDownloadSettingOnWindow('enable');
        const { result, rerender } = renderHook(() => useGuidelineAssetsSettings());
        window.emitter.emit('AppBridge:GuidelineAssetsSettingsChanged', { imageAndVideoDownloadEnabled: false });
        rerender();
        expect(result.current.imageAndVideoDownloadEnabled).toBe(false);
    });

    it('should set assetViewerEnabled to true on AppBridge:GuidelineAssetsSettingsChanged', () => {
        setAssetViewerSettingOnWindow(false);
        const { result, rerender } = renderHook(() => useGuidelineAssetsSettings());
        window.emitter.emit('AppBridge:GuidelineAssetsSettingsChanged', { assetViewerEnabled: true });
        rerender();
        expect(result.current.assetViewerEnabled).toBe(true);
    });

    it('should set assetViewerEnabled to false on AppBridge:GuidelineAssetsSettingsChanged', () => {
        setAssetViewerSettingOnWindow(true);
        const { result, rerender } = renderHook(() => useGuidelineAssetsSettings());
        window.emitter.emit('AppBridge:GuidelineAssetsSettingsChanged', { assetViewerEnabled: false });
        rerender();
        expect(result.current.assetViewerEnabled).toBe(false);
    });
});
