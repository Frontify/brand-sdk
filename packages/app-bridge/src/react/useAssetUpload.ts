/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useRef, useState } from 'react';

import { createAssetByFileId } from '../repositories/AssetRepository';
import { type Asset, type FileApi } from '../types';

import { useFileUpload } from './useFileUpload';

export type UseAssetUploadParameters = {
    onUploadProgress?: (event: MessageEvent) => void;
    onUploadProgressAll?: (event: MessageEvent) => void;
    onUploadDone?: (event: MessageEvent<FileApi>) => void;
    onUploadDoneAll?: (event: Asset[]) => void;
    onUploadFail?: () => void;
    onUploadAssetFail?: (event: MessageEvent) => void;
};

export type UseAssetUploadReturnTypes = [(files: FileList | File) => void, { results: Asset[]; doneAll: boolean }];

export const useAssetUpload = (props?: UseAssetUploadParameters): UseAssetUploadReturnTypes => {
    const results = useRef<Asset[]>([]);
    const promises = useRef<Promise<unknown>[]>([]);
    const [doneAll, setDoneAll] = useState(false);

    const { onUploadProgress, onUploadProgressAll, onUploadDone, onUploadDoneAll, onUploadFail, onUploadAssetFail } =
        props ?? {};

    const projectId = window.application?.sandbox?.config?.context?.project?.id;

    const onProgress = (workerEvent: MessageEvent<FileApi>) => {
        onUploadProgress?.(workerEvent);
    };

    const onProgressAll = (workerEvent: MessageEvent<FileApi>) => {
        onUploadProgressAll?.(workerEvent);
    };

    const onDone = async (workerEvent: MessageEvent<FileApi>) => {
        const assetPromise = createAssetFromFileIds(workerEvent.data.file_id);
        promises.current.push(assetPromise);

        onUploadDone?.(workerEvent);

        results.current = [...results.current, await assetPromise];
    };

    const onDoneAll = async () => {
        await Promise.all(promises.current);

        onUploadDoneAll?.(results.current);

        setDoneAll(true);
    };

    const onFail = () => {
        onUploadFail?.();
    };

    const onFileFail = (workerEvent: MessageEvent<FileApi>) => {
        onUploadAssetFail?.(workerEvent);
    };

    const resetState = () => {
        setDoneAll(false);
        results.current = [];
    };

    const createAssetFromFileIds = async (fileId: string) => {
        return await createAssetByFileId(fileId, projectId);
    };

    const [uploadFilesInternal] = useFileUpload({
        onUploadProgress: onProgress,
        onUploadProgressAll: onProgressAll,
        onUploadDone: onDone,
        onUploadDoneAll: onDoneAll,
        onUploadFail: onFail,
        onUploadFileFail: onFileFail,
    });

    const uploadFiles = (files: FileList | File) => {
        resetState();
        uploadFilesInternal(files);
    };

    // eslint-disable-next-line react-hooks/refs
    return [uploadFiles, { results: results.current, doneAll }];
};
