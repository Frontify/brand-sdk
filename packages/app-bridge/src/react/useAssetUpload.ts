/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useRef, useState } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { type CreateAssetsResponse, createAssets } from '../registries';
import { type Asset, type FileApi } from '../types';

export type UseAssetUploadParameters = {
    onUploadProgress?: (event: MessageEvent) => void;
    onUploadProgressAll?: (event: MessageEvent) => void;
    onUploadDone?: (event: MessageEvent<FileApi>) => void;
    onUploadDoneAll?: (event: Asset[]) => void;
    onUploadFail?: () => void;
    onUploadAssetFail?: (event: MessageEvent) => void;
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
                        onProgress: (progress) =>
                            callbacksRef.current?.onUploadProgressAll?.(
                                new MessageEvent('message', { data: progress }),
                            ),
                        onFileProgress: ({ index, loaded, total }) =>
                            callbacksRef.current?.onUploadProgress?.(
                                new MessageEvent('message', { data: { index, loaded, total, lengthComputable: true } }),
                            ),
                        onFileDone: ({ asset }) =>
                            callbacksRef.current?.onUploadDone?.(
                                new MessageEvent<FileApi>('message', {
                                    data: {
                                        file_id: asset.fileId,
                                        file_name: asset.fileName,
                                        generic_url: asset.genericUrl,
                                    },
                                }),
                            ),
                        onFileFail: ({ file, index, message }) =>
                            callbacksRef.current?.onUploadAssetFail?.(
                                new MessageEvent('message', { data: { file, index, error: message } }),
                            ),
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
