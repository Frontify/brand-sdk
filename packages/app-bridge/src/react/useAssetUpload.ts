/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useRef, useState } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { type CreateAssetsResponse, createAssets } from '../registries';
import {
    type Asset,
    type CreateAssetsFileFailure,
    type CreateAssetsFileProgress,
    type CreateAssetsFileSuccess,
    type CreateAssetsProgress,
} from '../types';

export type UseAssetUploadParameters = {
    onUploadProgress?: (progress: CreateAssetsFileProgress) => void;
    onUploadProgressAll?: (progress: CreateAssetsProgress) => void;
    onUploadDone?: (result: CreateAssetsFileSuccess) => void;
    onUploadDoneAll?: (assets: Asset[]) => void;
    onUploadFail?: () => void;
    onUploadAssetFail?: (failure: CreateAssetsFileFailure) => void;
};

export type UseAssetUploadReturnTypes = [(files: FileList | File) => void, { results: Asset[]; doneAll: boolean }];

const getFilesAsArray = (files: FileList | File): File[] => (files instanceof File ? [files] : Array.from(files));

export const useAssetUpload = (
    appBridge: AppBridgeBlock,
    props?: UseAssetUploadParameters,
): UseAssetUploadReturnTypes => {
    const resultsRef = useRef<Asset[]>([]);
    const [doneAll, setDoneAll] = useState(false);

    const callbacksRef = useRef(props);
    useEffect(() => {
        callbacksRef.current = props;
    });

    const abortControllersRef = useRef(new Set<AbortController>());
    useEffect(() => {
        const abortControllers = abortControllersRef.current;
        return () => {
            for (const abortController of abortControllers) {
                abortController.abort();
            }
        };
    }, []);

    const upload = useCallback(
        (files: File[]) => {
            const abortController = new AbortController();
            abortControllersRef.current.add(abortController);

            const onUploaded = ({ assets }: CreateAssetsResponse) => {
                abortControllersRef.current.delete(abortController);
                resultsRef.current = assets;
                callbacksRef.current?.onUploadDoneAll?.(assets);
                setDoneAll(true);
            };

            const onUploadFailed = () => {
                abortControllersRef.current.delete(abortController);
                if (!abortController.signal.aborted) {
                    callbacksRef.current?.onUploadFail?.();
                }
            };

            appBridge
                .api(
                    createAssets({
                        files,
                        signal: abortController.signal,
                        onProgress: (progress) => callbacksRef.current?.onUploadProgressAll?.(progress),
                        onFileProgress: (progress) => callbacksRef.current?.onUploadProgress?.(progress),
                        onFileDone: (result) => callbacksRef.current?.onUploadDone?.(result),
                        onFileFail: (failure) => callbacksRef.current?.onUploadAssetFail?.(failure),
                    }),
                )
                .then(onUploaded)
                .catch(onUploadFailed);
        },
        [appBridge],
    );

    const uploadFiles = useCallback(
        (files: FileList | File) => {
            setDoneAll(false);
            resultsRef.current = [];

            const fileArray = getFilesAsArray(files);
            if (fileArray.length === 0) {
                return;
            }

            upload(fileArray);
        },
        [upload],
    );

    return [uploadFiles, { results: resultsRef.current, doneAll }];
};
