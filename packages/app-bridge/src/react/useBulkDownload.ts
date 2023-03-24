/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';
import { BulkDownload } from '../types';
import type { AppBridgeBlock } from '../AppBridgeBlock';

export enum BulkDownloadStatus {
    Init = 'init',
    Started = 'started',
    Pending = 'pending',
    Ready = 'ready',
    Error = 'error',
}

export const useBulkDownload = (appBridge: AppBridgeBlock, assetIds: number[], setIds: number[], language: string) => {
    const [bulkDownload, setBulkDownload] = useState<BulkDownload | null>(null);
    const [status, setStatus] = useState<BulkDownloadStatus>(BulkDownloadStatus.Init);
    const [token, setToken] = useState<string>('');
    const [signature, setSignature] = useState<string>('');

    const generateBulkDownload = async () => {
        try {
            const token = await appBridge.getBulkDownloadToken(assetIds, setIds);
            setToken(token);
            setStatus(BulkDownloadStatus.Started);
        } catch (error) {
            setStatus(BulkDownloadStatus.Error);
            console.error(error);
        }
    };

    const startDownload = async () => {
        try {
            const download = await appBridge.getBulkDownloadByToken(token);
            download.signature && setSignature(download.signature);
            setBulkDownload(download);
            download.downloadUrl === '' ? setStatus(BulkDownloadStatus.Pending) : setStatus(BulkDownloadStatus.Ready);
        } catch (error) {
            setStatus(BulkDownloadStatus.Error);
            console.error(error);
        }
    };

    useEffect(() => {
        if (status === BulkDownloadStatus.Started && token) {
            startDownload();
        }

        if (status === BulkDownloadStatus.Pending && signature) {
            const interval = setInterval(async () => {
                try {
                    const download = await appBridge.getBulkDownloadBySignature(signature);
                    if (!download.downloadUrl) {
                        return;
                    }
                    setBulkDownload(download);
                    setStatus(BulkDownloadStatus.Ready);
                    clearInterval(interval);
                } catch (error) {
                    setStatus(BulkDownloadStatus.Error);
                    console.error(error);
                }
            }, 2500);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    return { generateBulkDownload, status, token, signature };
};
