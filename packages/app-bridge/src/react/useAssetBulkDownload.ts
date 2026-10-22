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

const sleep = (ms: number, signal: AbortSignal) =>
    new Promise<void>((resolve, reject) => {
        const timeoutId = window.setTimeout(resolve, ms);
        signal.addEventListener(
            'abort',
            () => {
                window.clearTimeout(timeoutId);
                reject(new DOMException('The bulk download was aborted.', 'AbortError'));
            },
            { once: true },
        );
    });

export const useAssetBulkDownload = (appBridge: AppBridgeBlock) => {
    const abortControllerRef = useRef<AbortController | null>(null);
    const [status, setStatus] = useState<AssetBulkDownloadState>(AssetBulkDownloadState.Init);
    const [downloadUrl, setDownloadUrl] = useState<Nullable<string>>(null);

    useEffect(() => () => abortControllerRef.current?.abort(), []);

    const generateBulkDownload = async (blockAssets?: Record<string, Asset[]>) => {
        abortControllerRef.current?.abort();
        const abortController = new AbortController();
        abortControllerRef.current = abortController;
        const { signal } = abortController;

        try {
            setStatus(AssetBulkDownloadState.Started);

            const { assetBulkDownloadToken } = await appBridge.api({
                name: 'getAssetBulkDownloadToken',
                payload: { blockAssets },
            });
            signal.throwIfAborted();

            setDownloadUrl(null);

            let download = await appBridge.getBulkDownloadByToken(assetBulkDownloadToken);
            signal.throwIfAborted();

            // Wait for the download to be prepared, one check at a time so slow responses don't pile up.
            while (!download.downloadUrl) {
                setStatus(AssetBulkDownloadState.Pending);
                await sleep(POLLING_INTERVAL_IN_MS, signal);
                download = await appBridge.getBulkDownloadBySignature(download.signature);
                signal.throwIfAborted();
            }

            setDownloadUrl(download.downloadUrl);
            setStatus(AssetBulkDownloadState.Ready);
        } catch (error) {
            if (signal.aborted) {
                return;
            }
            setStatus(AssetBulkDownloadState.Error);
            console.error(error);
        }
    };

    return { generateBulkDownload, status, downloadUrl };
};
