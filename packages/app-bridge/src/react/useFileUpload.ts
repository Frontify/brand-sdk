/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useRef, useState } from 'react';

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

export const useFileUpload = (props?: UseFileUploadParameters): UseFileUploadReturnTypes => {
    const results = useRef<FileApi[]>([]);

    const [doneAll, setDoneAll] = useState(false);

    // The worker listener is only added once, so it reads the callbacks from a ref to always call the latest ones.
    const callbacksRef = useRef(props);
    useEffect(() => {
        callbacksRef.current = props;
    });

    const workerRef = useRef<Worker>();

    // The worker is only started by the first upload, so mounted uploaders that never upload don't keep a thread alive.
    useEffect(() => {
        return () => {
            workerRef.current?.terminate();
            workerRef.current = undefined;
        };
    }, []);

    const resetState = useCallback(() => {
        setDoneAll(false);
        results.current = [];
    }, []);

    const getWorker = useCallback(() => {
        if (!workerRef.current) {
            const worker = new Worker();

            worker.addEventListener('message', (workerEvent) => {
                const callbacks = callbacksRef.current;

                switch (workerEvent.data.event) {
                    case WorkerEvent.OnProgress:
                        callbacks?.onUploadProgress?.(workerEvent);
                        break;
                    case WorkerEvent.OnProgressAll:
                        callbacks?.onUploadProgressAll?.(workerEvent);
                        break;
                    case WorkerEvent.OnDone:
                        callbacks?.onUploadDone?.(workerEvent);
                        results.current = [...results.current, workerEvent.data];
                        break;
                    case WorkerEvent.OnDoneAll:
                        callbacks?.onUploadDoneAll?.(results.current);
                        setDoneAll(true);
                        break;
                    case WorkerEvent.OnFail:
                        callbacks?.onUploadFail?.();
                        throw new Error('File upload failed');
                    case WorkerEvent.OnFileFail:
                        callbacks?.onUploadFileFail?.(workerEvent);
                        break;
                    default:
                        throw new Error(`${workerEvent.data.event} is not handled`);
                }
            });

            workerRef.current = worker;
        }

        return workerRef.current;
    }, []);

    const uploadFiles = useCallback(
        (files: FileList | File) => {
            resetState();
            const fileArray = getFilesAsArray(files);

            if (fileArray.length === 0) {
                return;
            }

            const message = {
                files: fileArray,
            };

            getWorker().postMessage(message);
        },
        [getWorker, resetState],
    );

    return [uploadFiles, { results: results.current, doneAll }];
};
