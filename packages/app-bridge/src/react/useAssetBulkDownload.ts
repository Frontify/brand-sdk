/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useRef, useState } from 'react';
import type { AppBridgeBlock } from '../AppBridgeBlock';

export enum BulkDownloadState {
    Init = 'init',
    Started = 'started',
    Pending = 'pending',
    Ready = 'ready',
    Error = 'error',
}

export const useAssetBulkDownload = (appBridge: AppBridgeBlock) => {
    const intervalId = useRef<number | null>(null);
    const [status, setStatus] = useState<BulkDownloadState>(BulkDownloadState.Init);
    const [downloadUrl, setDownloadUrl] = useState<Nullable<string>>(null);

    const generateBulkDownload = async (settingIds?: string[]) => {
        try {
            setStatus(BulkDownloadState.Started);

            const token = await appBridge.getAssetBulkDownloadToken(settingIds);

            setDownloadUrl(null);
            startDownload(token);
        } catch (error) {
            setStatus(BulkDownloadState.Error);
            console.error(error);
        }
    };

    const startDownload = async (token: string) => {
        try {
            const download = await appBridge.getBulkDownloadByToken(token);

            if (download.downloadUrl) {
                setDownloadUrl(download.downloadUrl);
                setStatus(BulkDownloadState.Ready);
            } else {
                setStatus(BulkDownloadState.Pending);
                intervalId.current = listenForBulkDownloadReady(download.signature);
            }
        } catch (error) {
            setStatus(BulkDownloadState.Error);
            console.error(error);
        }
    };

    const listenForBulkDownloadReady = (signature: string) => {
        return window.setInterval(async () => {
            try {
                const download = await appBridge.getBulkDownloadBySignature(signature);

                if (download.downloadUrl) {
                    setStatus(BulkDownloadState.Ready);
                    setDownloadUrl(download.downloadUrl);
                    intervalId.current && clearInterval(intervalId.current);
                }
            } catch (error) {
                setStatus(BulkDownloadState.Error);
                console.error(error);
                intervalId.current && clearInterval(intervalId.current);
            }
        }, 2500);
    };

    return { generateBulkDownload, status, downloadUrl };
};
