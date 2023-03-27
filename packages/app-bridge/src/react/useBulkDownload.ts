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

export const useBulkDownload = (
    appBridge: AppBridgeBlock,
    assetIds: number[],
    setIds: number[],
    signatureProp: string,
) => {
    const [status, setStatus] = useState<BulkDownloadState>(BulkDownloadState.Init);
    const [token, setToken] = useState<string>('');
    const [signature, setSignature] = useState<string>(signatureProp);
    const [download, setDownload] = useState<string>('');

    const getDownloadUrl = async () => {
        try {
            const download = await appBridge.getBulkDownloadBySignature(signature);
            if (download.downloadUrl !== '') {
                setDownload(download.downloadUrl);
                setStatus(BulkDownloadState.Ready);
            } else {
                setSignature('');
                generateBulkDownload();
            }
        } catch {
            setSignature('');
            generateBulkDownload();
        }
    };

    const generateBulkDownload = async () => {
        if (signature) {
            getDownloadUrl();
        } else {
            try {
                const token = await appBridge.getBulkDownloadToken(assetIds, setIds);
                setToken(token);
                setStatus(BulkDownloadState.Started);
            } catch (error) {
                setStatus(BulkDownloadState.Error);
                console.error(error);
            }
        }
    };

    const startDownload = async () => {
        try {
            const download = await appBridge.getBulkDownloadByToken(token);
            download.signature && setSignature(download.signature);
            download.downloadUrl ? setStatus(BulkDownloadState.Ready) : setStatus(BulkDownloadState.Pending);
        } catch (error) {
            setStatus(BulkDownloadState.Error);
            console.error(error);
        }
    };

    useEffect(() => {
        if (status === BulkDownloadState.Started && token) {
            startDownload();
        }

        if (status === BulkDownloadState.Pending && signature) {
            const interval = setInterval(async () => {
                try {
                    const download = await appBridge.getBulkDownloadBySignature(signature);
                    download.signature && setSignature(download.signature);
                    if (download.downloadUrl) {
                        setStatus(BulkDownloadState.Ready);
                        setDownload(download.downloadUrl);
                        clearInterval(interval);
                    }
                } catch (error) {
                    setStatus(BulkDownloadState.Error);
                    console.error(error);
                }
            }, 2500);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    return { generateBulkDownload, status, signature, download };
};
