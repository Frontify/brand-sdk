/* (c) Copyright Frontify Ltd., all rights reserved. */

import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { type CreateAssetBulkDownloadResponse } from '../registries';
import { AssetDummy, getAppBridgeBlockStub } from '../tests';

import { AssetBulkDownloadState, useAssetBulkDownload } from './useAssetBulkDownload';

const appBridgeError = new Error('Something went wrong');

const createDeferredDownload = () => {
    let resolveDownload: (response: CreateAssetBulkDownloadResponse) => void = () => {};
    const promise = new Promise<CreateAssetBulkDownloadResponse>((resolve) => {
        resolveDownload = resolve;
    });
    return { promise, resolve: resolveDownload };
};

const startBulkDownload = (generateBulkDownload: () => Promise<void>) => {
    let download: Promise<void> = Promise.resolve();
    act(() => {
        download = generateBulkDownload();
    });
    return download;
};

const getSignalOfCall = (api: AppBridgeBlock['api'], callIndex: number) =>
    (api as sinon.SinonStub).getCall(callIndex).args[0].payload.signal as AbortSignal;

describe('useAssetBulkDownload', () => {
    beforeEach(() => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
        cleanup();
        sinon.restore();
    });

    it('should have init as initial state', () => {
        const appBridgeStub = getAppBridgeBlockStub();
        const { result } = renderHook(() => useAssetBulkDownload(appBridgeStub));
        expect(result.current.status).toBe(AssetBulkDownloadState.Init);
    });

    it('should call createAssetBulkDownload with the block assets and an abort signal', async () => {
        const appBridgeStub = getAppBridgeBlockStub();
        const { result } = renderHook(() => useAssetBulkDownload(appBridgeStub));
        const blockAssets = { setting1: [AssetDummy.with(123)], setting2: [AssetDummy.with(456)] };

        await act(() => result.current.generateBulkDownload(blockAssets));

        sinon.assert.calledOnceWithExactly(appBridgeStub.api, {
            name: 'createAssetBulkDownload',
            payload: { blockAssets, signal: sinon.match.instanceOf(AbortSignal) },
        });
    });

    it('should set status to pending while the download is being prepared', async () => {
        const appBridgeStub = getAppBridgeBlockStub();
        const download = createDeferredDownload();
        appBridgeStub.api = sinon.stub<Parameters<AppBridgeBlock['api']>>().returns(download.promise);
        const { result } = renderHook(() => useAssetBulkDownload(appBridgeStub));

        startBulkDownload(result.current.generateBulkDownload);

        expect(result.current.status).toBe(AssetBulkDownloadState.Pending);
        expect(result.current.downloadUrl).toBeNull();

        await act(async () => download.resolve({ downloadUrl: 'ready-url' }));
    });

    it('should set the download url and status to ready once the download is ready', async () => {
        const appBridgeStub = getAppBridgeBlockStub();
        const { result } = renderHook(() => useAssetBulkDownload(appBridgeStub));

        await act(() => result.current.generateBulkDownload());

        expect(result.current.downloadUrl).toBe('https://example.com/bulk-download.zip');
        expect(result.current.status).toBe(AssetBulkDownloadState.Ready);
    });

    it('should set status to error if createAssetBulkDownload rejects', async () => {
        const appBridgeStub = getAppBridgeBlockStub();
        appBridgeStub.api = sinon.stub<Parameters<AppBridgeBlock['api']>>().rejects(appBridgeError);
        const { result } = renderHook(() => useAssetBulkDownload(appBridgeStub));

        await act(() => result.current.generateBulkDownload());

        expect(result.current.status).toBe(AssetBulkDownloadState.Error);
        expect(console.error).toHaveBeenCalledWith(appBridgeError);
    });

    it('should replace the download url when a second download is generated', async () => {
        const appBridgeStub = getAppBridgeBlockStub();
        appBridgeStub.api = sinon
            .stub<Parameters<AppBridgeBlock['api']>>()
            .onFirstCall()
            .resolves({ downloadUrl: 'first-url' })
            .onSecondCall()
            .resolves({ downloadUrl: 'second-url' });
        const { result } = renderHook(() => useAssetBulkDownload(appBridgeStub));

        await act(() => result.current.generateBulkDownload());
        expect(result.current.downloadUrl).toBe('first-url');

        await act(() => result.current.generateBulkDownload());
        expect(result.current.downloadUrl).toBe('second-url');
        expect(result.current.status).toBe(AssetBulkDownloadState.Ready);
    });

    it('should abort the download when the component unmounts', () => {
        const appBridgeStub = getAppBridgeBlockStub();
        appBridgeStub.api = sinon.stub<Parameters<AppBridgeBlock['api']>>().returns(createDeferredDownload().promise);
        const { result, unmount } = renderHook(() => useAssetBulkDownload(appBridgeStub));

        startBulkDownload(result.current.generateBulkDownload);
        const signal = getSignalOfCall(appBridgeStub.api, 0);
        expect(signal.aborted).toBe(false);

        unmount();

        expect(signal.aborted).toBe(true);
    });

    it('should abort the previous download and ignore its result when a new one starts', async () => {
        const appBridgeStub = getAppBridgeBlockStub();
        const firstDownload = createDeferredDownload();
        appBridgeStub.api = sinon
            .stub<Parameters<AppBridgeBlock['api']>>()
            .onFirstCall()
            .returns(firstDownload.promise)
            .onSecondCall()
            .resolves({ downloadUrl: 'second-url' });
        const { result } = renderHook(() => useAssetBulkDownload(appBridgeStub));

        startBulkDownload(result.current.generateBulkDownload);
        await act(() => result.current.generateBulkDownload());

        expect(getSignalOfCall(appBridgeStub.api, 0).aborted).toBe(true);
        expect(result.current.downloadUrl).toBe('second-url');

        await act(async () => firstDownload.resolve({ downloadUrl: 'first-url' }));

        await waitFor(() => {
            expect(result.current.downloadUrl).toBe('second-url');
            expect(result.current.status).toBe(AssetBulkDownloadState.Ready);
        });
    });

    it('should not set status to error when an aborted download rejects', async () => {
        const appBridgeStub = getAppBridgeBlockStub();
        appBridgeStub.api = sinon.stub<Parameters<AppBridgeBlock['api']>>().callsFake((apiHandler) => {
            const { signal } = (apiHandler as { payload: { signal: AbortSignal } }).payload;
            return new Promise((_resolve, reject) => {
                signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
            });
        });
        const { result, unmount } = renderHook(() => useAssetBulkDownload(appBridgeStub));

        const download = startBulkDownload(result.current.generateBulkDownload);
        unmount();
        await download;

        expect(result.current.status).toBe(AssetBulkDownloadState.Pending);
        expect(console.error).not.toHaveBeenCalled();
    });
});
