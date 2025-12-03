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

    useEffect(() => {
        const worker = new Worker();
        workerRef.current = worker;

        // eslint-disable-next-line @eslint-react/web-api/no-leaked-event-listener
        worker.addEventListener('message', (workerEvent) => {
            switch (workerEvent.data.event) {
                case WorkerEvent.OnProgress:
                    // eslint-disable-next-line react-hooks/immutability
                    onProgress(workerEvent);
                    break;
                case WorkerEvent.OnProgressAll:
                    // eslint-disable-next-line react-hooks/immutability
                    onProgressAll(workerEvent);
                    break;
                case WorkerEvent.OnDone:
                    // eslint-disable-next-line react-hooks/immutability
                    onDone(workerEvent);
                    break;
                case WorkerEvent.OnDoneAll:
                    // eslint-disable-next-line react-hooks/immutability
                    onDoneAll();
                    break;
                case WorkerEvent.OnFail:
                    // eslint-disable-next-line react-hooks/immutability
                    onFail();
                    break;
                case WorkerEvent.OnFileFail:
                    // eslint-disable-next-line react-hooks/immutability
                    onFileFail(workerEvent);
                    break;
                default:
                    throw new Error(`${workerEvent.data.event} is not handled`);
            }
        });

        return () => {
            worker.terminate();
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

    const uploadFiles = (files: FileList | File) => {
        resetState();
        const fileArray = getFilesAsArray(files);

        if (fileArray.length === 0) {
            return;
        }

        const message = {
            files: fileArray,
        };

        if (workerRef?.current) {
            workerRef.current.postMessage(message);
        }
    };

    return [uploadFiles, { results: results.current, doneAll }];
};
