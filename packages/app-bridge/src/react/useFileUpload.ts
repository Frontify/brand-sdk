/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useRef, useState } from 'react';

import { type FileApi } from '../types';
import Worker from '../workers/upload.worker.js?worker&inline';

export type UseFileUploadParameters = {
    onUploadProgress?: (event: MessageEvent) => void;
    onUploadProgressAll?: (event: MessageEvent) => void;
    onUploadDone?: (event: MessageEvent<FileApi>) => void;
    onUploadDoneAll?: (event: FileApi[]) => void;
    onUploadFail?: () => void;
    onUploadFileFail?: (event: MessageEvent) => void;
};

enum WorkerEvent {
    OnProgress = 'onProgress',
    OnProgressAll = 'onProgressAll',
    OnDone = 'onDone',
    OnDoneAll = 'onDoneAll',
    OnFail = 'onFail',
    OnFileFail = 'onFileFail',
}

export type UseFileUploadReturnTypes = [(files: FileList | File) => void, { results: FileApi[]; doneAll: boolean }];

export const useFileUpload = (props?: UseFileUploadParameters): UseFileUploadReturnTypes => {
    const results = useRef<FileApi[]>([]);

    const [doneAll, setDoneAll] = useState(false);

    const { onUploadProgress, onUploadProgressAll, onUploadDone, onUploadDoneAll, onUploadFail, onUploadFileFail } =
        props ?? {};

    const workerRef = useRef<Worker>();

    // The worker is only started by the first upload, so mounted uploaders that never upload don't keep a thread alive.
    useEffect(() => {
        return () => {
            workerRef.current?.terminate();
            workerRef.current = undefined;
        };
    }, []);

    const onProgress = (workerEvent: MessageEvent<FileApi>) => {
        onUploadProgress?.(workerEvent);
    };

    const onProgressAll = (workerEvent: MessageEvent<FileApi>) => {
        onUploadProgressAll?.(workerEvent);
    };

    const onDone = (workerEvent: MessageEvent<FileApi>) => {
        onUploadDone?.(workerEvent);
        results.current = [...results.current, workerEvent.data];
    };

    const onDoneAll = () => {
        onUploadDoneAll?.(results.current);
        setDoneAll(true);
    };

    const onFail = () => {
        onUploadFail?.();
        throw new Error('File upload failed');
    };

    const onFileFail = (workerEvent: MessageEvent<FileApi>) => {
        onUploadFileFail?.(workerEvent);
    };

    const getFilesAsArray = (files: FileList | File): File[] => {
        const fileArray: File[] = [];

        if (files instanceof File) {
            fileArray.push(files);
        }

        if (files instanceof FileList) {
            fileArray.push(...Array.from(files));
        }

        return fileArray;
    };

    const resetState = () => {
        setDoneAll(false);
        results.current = [];
    };

    const getWorker = () => {
        if (!workerRef.current) {
            const worker = new Worker();

            worker.addEventListener('message', (workerEvent) => {
                switch (workerEvent.data.event) {
                    case WorkerEvent.OnProgress:
                        onProgress(workerEvent);
                        break;
                    case WorkerEvent.OnProgressAll:
                        onProgressAll(workerEvent);
                        break;
                    case WorkerEvent.OnDone:
                        onDone(workerEvent);
                        break;
                    case WorkerEvent.OnDoneAll:
                        onDoneAll();
                        break;
                    case WorkerEvent.OnFail:
                        onFail();
                        break;
                    case WorkerEvent.OnFileFail:
                        onFileFail(workerEvent);
                        break;
                    default:
                        throw new Error(`${workerEvent.data.event} is not handled`);
                }
            });

            workerRef.current = worker;
        }

        return workerRef.current;
    };

    const uploadFiles = (files: FileList | File) => {
        resetState();
        const fileArray = getFilesAsArray(files);

        if (fileArray.length === 0) {
            return;
        }

        const message = {
            files: fileArray,
        };

        getWorker().postMessage(message);
    };

    return [uploadFiles, { results: results.current, doneAll }];
};
