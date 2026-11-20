/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useRef, useState } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { type Asset } from '../types';
import { type Nullable } from '../types/Nullable';

export enum AssetBulkDownloadState {
    Init = 'init',
    Started = 'started',
    Pending = 'pending',
    Ready = 'ready',
    Error = 'error',
}

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
            setStatus(AssetBulkDownloadState.Pending);
            setDownloadUrl(null);

            const { downloadUrl } = await appBridge.api({
                name: 'createAssetBulkDownload',
                payload: { blockAssets, signal },
            });
            signal.throwIfAborted();

            setDownloadUrl(downloadUrl);
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
