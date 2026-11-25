/* (c) Copyright Frontify Ltd., all rights reserved. */

import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { type CreateAssetsPayload, type CreateAssetsResponse } from '../registries';
import { AssetDummy, getAppBridgeBlockStub } from '../tests';

import { useAssetUpload } from './useAssetUpload';

const firstFile = new File(['abc'], 'first.png');
const secondFile = new File(['defgh'], 'second.pdf');

const createFileList = (...files: File[]): FileList => {
    const dataTransfer = new DataTransfer();
    for (const file of files) {
        dataTransfer.items.add(file);
    }
    return dataTransfer.files;
};

const answerCreateAssets = (
    appBridge: ReturnType<typeof getAppBridgeBlockStub>,
    answer: (payload: CreateAssetsPayload) => Promise<CreateAssetsResponse>,
) => {
    appBridge.api.callsFake((apiHandler) => {
        if (apiHandler.name !== 'createAssets') {
            throw new Error(`Unexpected API method ${apiHandler.name}`);
        }
        return answer(apiHandler.payload);
    });
};

describe('useAssetUpload hook', () => {
    afterEach(() => {
        cleanup();
    });

    it('should keep the same upload function when the callbacks change on every render', () => {
        const appBridge = getAppBridgeBlockStub();
        const { result, rerender } = renderHook(() => useAssetUpload(appBridge, { onUploadProgress: () => {} }));
        const [uploadFiles] = result.current;

        rerender();

        expect(result.current[0]).toBe(uploadFiles);
    });

    it('should upload the files through the host and return the created assets', async () => {
        const appBridge = getAppBridgeBlockStub();
        const onUploadDoneAll = vi.fn();
        const { result } = renderHook(() => useAssetUpload(appBridge, { onUploadDoneAll }));

        act(() => {
            result.current[0](createFileList(firstFile, secondFile));
        });

        await waitFor(() => expect(result.current[1].doneAll).toBe(true));
        expect(result.current[1].results.map(({ fileName }) => fileName)).toEqual(['first.png', 'second.pdf']);
        expect(onUploadDoneAll).toHaveBeenCalledWith(result.current[1].results);
    });

    it('should report the progress of each file and of all files', async () => {
        const appBridge = getAppBridgeBlockStub();
        const onUploadProgress = vi.fn();
        const onUploadProgressAll = vi.fn();
        const { result } = renderHook(() => useAssetUpload(appBridge, { onUploadProgress, onUploadProgressAll }));

        act(() => {
            result.current[0](createFileList(firstFile, secondFile));
        });

        await waitFor(() => expect(result.current[1].doneAll).toBe(true));
        expect(onUploadProgress.mock.calls.map(([progress]) => progress)).toEqual([
            { file: firstFile, index: 0, loaded: 3, total: 3 },
            { file: secondFile, index: 1, loaded: 5, total: 5 },
        ]);
        expect(onUploadProgressAll.mock.calls.map(([progress]) => progress)).toEqual([
            { loaded: 3, total: 8 },
            { loaded: 8, total: 8 },
        ]);
    });

    it('should call onUploadDone with each created asset', async () => {
        const appBridge = getAppBridgeBlockStub();
        const onUploadDone = vi.fn();
        const { result } = renderHook(() => useAssetUpload(appBridge, { onUploadDone }));

        act(() => {
            result.current[0](firstFile);
        });

        await waitFor(() => expect(result.current[1].doneAll).toBe(true));
        const asset = result.current[1].results[0];
        expect(onUploadDone).toHaveBeenCalledOnce();
        expect(onUploadDone).toHaveBeenCalledWith({ file: firstFile, index: 0, asset });
    });

    it('should call the latest callbacks after a re-render', async () => {
        const appBridge = getAppBridgeBlockStub();
        let releaseUpload = () => {};
        answerCreateAssets(appBridge, (payload) => {
            return new Promise((resolve) => {
                releaseUpload = () => {
                    payload.onProgress?.({ loaded: 3, total: 3 });
                    resolve({ assets: [AssetDummy.with(1)], failures: [] });
                };
            });
        });
        const firstOnUploadProgressAll = vi.fn();
        const latestOnUploadProgressAll = vi.fn();
        const { result, rerender } = renderHook(
            ({ onUploadProgressAll }) => useAssetUpload(appBridge, { onUploadProgressAll }),
            { initialProps: { onUploadProgressAll: firstOnUploadProgressAll } },
        );

        act(() => {
            result.current[0](firstFile);
        });
        rerender({ onUploadProgressAll: latestOnUploadProgressAll });
        act(() => {
            releaseUpload();
        });

        await waitFor(() => expect(result.current[1].doneAll).toBe(true));
        expect(firstOnUploadProgressAll).not.toHaveBeenCalled();
        expect(latestOnUploadProgressAll).toHaveBeenCalledOnce();
    });

    it('should report a file that fails and still return the other assets', async () => {
        const appBridge = getAppBridgeBlockStub();
        answerCreateAssets(appBridge, (payload) => {
            const failure = { file: firstFile, index: 0, message: 'File type not allowed' };
            payload.onFileFail?.(failure);
            return Promise.resolve({ assets: [AssetDummy.with(2)], failures: [failure] });
        });
        const onUploadAssetFail = vi.fn();
        const { result } = renderHook(() => useAssetUpload(appBridge, { onUploadAssetFail }));

        act(() => {
            result.current[0](createFileList(firstFile, secondFile));
        });

        await waitFor(() => expect(result.current[1].doneAll).toBe(true));
        expect(onUploadAssetFail).toHaveBeenCalledWith({
            file: firstFile,
            index: 0,
            message: 'File type not allowed',
        });
        expect(result.current[1].results).toEqual([AssetDummy.with(2)]);
    });

    it('should call onUploadFail when the upload fails', async () => {
        const appBridge = getAppBridgeBlockStub();
        appBridge.api.rejects(new Error('Network error'));
        const onUploadFail = vi.fn();
        const { result } = renderHook(() => useAssetUpload(appBridge, { onUploadFail }));

        act(() => {
            result.current[0](firstFile);
        });

        await waitFor(() => expect(onUploadFail).toHaveBeenCalledOnce());
        expect(result.current[1].doneAll).toBe(false);
    });

    it('should cancel the upload without calling onUploadFail when the component unmounts', async () => {
        const appBridge = getAppBridgeBlockStub();
        let signal: AbortSignal | undefined;
        answerCreateAssets(appBridge, (payload) => {
            signal = payload.signal;
            return new Promise((_resolve, reject) => {
                payload.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
            });
        });
        const onUploadFail = vi.fn();
        const { result, unmount } = renderHook(() => useAssetUpload(appBridge, { onUploadFail }));

        act(() => {
            result.current[0](firstFile);
        });
        unmount();

        await waitFor(() => expect(signal?.aborted).toBe(true));
        expect(onUploadFail).not.toHaveBeenCalled();
    });

    it('should not call the host when there are no files', () => {
        const appBridge = getAppBridgeBlockStub();
        const { result } = renderHook(() => useAssetUpload(appBridge));

        act(() => {
            result.current[0](createFileList());
        });

        expect(appBridge.api.called).toBe(false);
    });
});
