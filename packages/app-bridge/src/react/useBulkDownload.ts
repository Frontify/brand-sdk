/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';
import type { AppBridgeBlock } from '../AppBridgeBlock';

export enum BulkDownloadState {
    Init = 'init',
    Started = 'started',
    Pending = 'pending',
    Ready = 'ready',
    Error = 'error',
}

export const useBulkDownload = (appBridge: AppBridgeBlock) => {
    const [status, setStatus] = useState<BulkDownloadState>(BulkDownloadState.Init);
    const [token, setToken] = useState<Nullable<string>>(null);
    const [signature, setSignature] = useState<Nullable<string>>(null);
    const [downloadUrl, setDownloadUrl] = useState<Nullable<string>>(null);

    const generateBulkDownload = async (assetIds: number[], setIds?: number[]) => {
        try {
            const token = await appBridge.getBulkDownloadToken(assetIds, setIds);
            setToken(token);
            setDownloadUrl(null);
            setSignature(null);
            setStatus(BulkDownloadState.Started);
        } catch (error) {
            setStatus(BulkDownloadState.Error);
            console.error(error);
        }
    };

    const startDownload = async () => {
        if (token) {
            try {
                const download = await appBridge.getBulkDownloadByToken(token);
                download.signature && setSignature(download.signature);
                if (download.downloadUrl) {
                    setDownloadUrl(download.downloadUrl);
                    setStatus(BulkDownloadState.Ready);
                } else {
                    setStatus(BulkDownloadState.Pending);
                }
            } catch (error) {
                setStatus(BulkDownloadState.Error);
                console.error(error);
            }
        }
    };

    useEffect(() => {
        if (status === BulkDownloadState.Started && token) {
            startDownload();
        }

        let interval: number;
        if (status === BulkDownloadState.Pending && signature) {
            interval = window.setInterval(async () => {
                try {
                    const download = await appBridge.getBulkDownloadBySignature(signature);
                    download.signature && setSignature(download.signature);
                    if (download.downloadUrl) {
                        setStatus(BulkDownloadState.Ready);
                        setDownloadUrl(download.downloadUrl);
                        clearInterval(interval);
                    }
                } catch (error) {
                    setStatus(BulkDownloadState.Error);
                    console.error(error);
                    clearInterval(interval);
                }
            }, 2500);
        }

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    return { generateBulkDownload, status, downloadUrl };
};
