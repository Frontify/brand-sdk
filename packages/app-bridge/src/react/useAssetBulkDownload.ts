/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useRef, useState } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { type Asset } from '../types';

export enum AssetBulkDownloadState {
    Init = 'init',
    Started = 'started',
    Pending = 'pending',
    Ready = 'ready',
    Error = 'error',
}

const POLLING_INTERVAL_IN_MS = 2500;

export const useAssetBulkDownload = (appBridge: AppBridgeBlock) => {
    // Identifies the latest download, so responses for an earlier download or after unmount are ignored.
    const downloadIdRef = useRef(0);
    const pollingTimeoutIdRef = useRef<number | null>(null);
    const [status, setStatus] = useState<AssetBulkDownloadState>(AssetBulkDownloadState.Init);
    const [downloadUrl, setDownloadUrl] = useState<Nullable<string>>(null);

    useEffect(() => {
        return () => {
            downloadIdRef.current += 1;
            window.clearTimeout(pollingTimeoutIdRef.current ?? undefined);
        };
    }, []);

    const isCurrentDownload = (id: number) => id === downloadIdRef.current;

    const generateBulkDownload = async (blockAssets?: Record<string, Asset[]>) => {
        downloadIdRef.current += 1;
        const id = downloadIdRef.current;
        window.clearTimeout(pollingTimeoutIdRef.current ?? undefined);

        try {
            setStatus(AssetBulkDownloadState.Started);

            const { assetBulkDownloadToken } = await appBridge.api({
                name: 'getAssetBulkDownloadToken',
                payload: { blockAssets },
            });

            if (!isCurrentDownload(id)) {
                return;
            }

            setDownloadUrl(null);
            startDownload(assetBulkDownloadToken, id);
        } catch (error) {
            if (isCurrentDownload(id)) {
                setStatus(AssetBulkDownloadState.Error);
            }
            console.error(error);
        }
    };

    const startDownload = async (token: string, id: number) => {
        try {
            const download = await appBridge.getBulkDownloadByToken(token);

            if (!isCurrentDownload(id)) {
                return;
            }

            if (download.downloadUrl) {
                setDownloadUrl(download.downloadUrl);
                setStatus(AssetBulkDownloadState.Ready);
            } else {
                setStatus(AssetBulkDownloadState.Pending);
                pollUntilReady(download.signature, id);
            }
        } catch (error) {
            if (isCurrentDownload(id)) {
                setStatus(AssetBulkDownloadState.Error);
            }
            console.error(error);
        }
    };

    // Schedule the next check only after the previous one finished, so slow responses don't pile up.
    const pollUntilReady = (signature: string, id: number) => {
        pollingTimeoutIdRef.current = window.setTimeout(() => {
            (async () => {
                try {
                    const download = await appBridge.getBulkDownloadBySignature(signature);

                    if (!isCurrentDownload(id)) {
                        return;
                    }

                    if (download.downloadUrl) {
                        setStatus(AssetBulkDownloadState.Ready);
                        setDownloadUrl(download.downloadUrl);
                    } else {
                        pollUntilReady(signature, id);
                    }
                } catch (error) {
                    if (isCurrentDownload(id)) {
                        setStatus(AssetBulkDownloadState.Error);
                    }
                    console.error(error);
                }
            })();
        }, POLLING_INTERVAL_IN_MS);
    };

    return { generateBulkDownload, status, downloadUrl };
};
