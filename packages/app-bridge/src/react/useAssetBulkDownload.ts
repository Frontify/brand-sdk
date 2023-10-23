/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useRef, useState } from 'react';
import type { AppBridgeBlock } from '../AppBridgeBlock';

export enum AssetBulkDownloadState {
    Init = 'init',
    Started = 'started',
    Pending = 'pending',
    Ready = 'ready',
    Error = 'error',
}

export const useAssetBulkDownload = (appBridge: AppBridgeBlock) => {
    const intervalId = useRef<number | null>(null);
    const [status, setStatus] = useState<AssetBulkDownloadState>(AssetBulkDownloadState.Init);
    const [downloadUrl, setDownloadUrl] = useState<Nullable<string>>(null);

    const generateBulkDownload = async (settingIds?: string[]) => {
        try {
            setStatus(AssetBulkDownloadState.Started);

            const { assetBulkDownloadToken } = await appBridge.api({
                name: 'getAssetBulkDownloadToken',
                payload: {
                    settingIds,
                    documentBlockId: appBridge.getBlockId(),
                    language: appBridge.getTranslationLanguage(),
                },
            });

            setDownloadUrl(null);
            startDownload(assetBulkDownloadToken);
        } catch (error) {
            setStatus(AssetBulkDownloadState.Error);
            console.error(error);
        }
    };

    const startDownload = async (token: string) => {
        try {
            const download = await appBridge.getBulkDownloadByToken(token);

            if (download.downloadUrl) {
                setDownloadUrl(download.downloadUrl);
                setStatus(AssetBulkDownloadState.Ready);
            } else {
                setStatus(AssetBulkDownloadState.Pending);
                intervalId.current = listenForBulkDownloadReady(download.signature);
            }
        } catch (error) {
            setStatus(AssetBulkDownloadState.Error);
            console.error(error);
        }
    };

    const listenForBulkDownloadReady = (signature: string) => {
        return window.setInterval(() => {
            (async () => {
                try {
                    const download = await appBridge.getBulkDownloadBySignature(signature);

                    if (download.downloadUrl) {
                        setStatus(AssetBulkDownloadState.Ready);
                        setDownloadUrl(download.downloadUrl);
                        intervalId.current && clearInterval(intervalId.current);
                    }
                } catch (error) {
                    setStatus(AssetBulkDownloadState.Error);
                    console.error(error);
                    intervalId.current && clearInterval(intervalId.current);
                }
            })();
        }, 2500);
    };

    return { generateBulkDownload, status, downloadUrl };
};
