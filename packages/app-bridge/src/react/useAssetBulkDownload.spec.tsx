/* (c) Copyright Frontify Ltd., all rights reserved. */

import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import sinon, { stub } from 'sinon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { AssetDummy, getAppBridgeBlockStub } from '../tests';

import { AssetBulkDownloadState, useAssetBulkDownload } from './useAssetBulkDownload';

const appBridgeError = new Error('Something went wrong');

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

    it('should call getAssetBulkDownloadToken with the correct arguments', async () => {
        const appBridgeStub = getAppBridgeBlockStub();
        const { result } = renderHook(() => useAssetBulkDownload(appBridgeStub));
        const blockAssets = { setting1: [AssetDummy.with(123)], setting2: [AssetDummy.with(456)] };
        result.current.generateBulkDownload(blockAssets);
        await waitFor(() => {
            sinon.assert.calledWithExactly(appBridgeStub.api, {
                name: 'getAssetBulkDownloadToken',
                payload: { blockAssets },
            });
        });
    });

    it('should set status to error if getAssetBulkDownloadToken throws an error', async () => {
        const appBridgeStub = getAppBridgeBlockStub();
        appBridgeStub.api = stub<Parameters<AppBridgeBlock['api']>>()
            .withArgs({
                name: 'getAssetBulkDownloadToken',
                payload: { blockAssets: undefined },
            })
            .rejects(appBridgeError);
        const { result } = renderHook(() => useAssetBulkDownload(appBridgeStub));
        result.current.generateBulkDownload();
        await waitFor(() => {
            expect(result.current.status).toBe(AssetBulkDownloadState.Error);
        });
    });

    it('should set signature and set status to ready', async () => {
        const appBridgeStub = getAppBridgeBlockStub();
        const { result } = renderHook(() => useAssetBulkDownload(appBridgeStub));
        result.current.generateBulkDownload();
        await waitFor(() => {
            sinon.assert.calledWithExactly(appBridgeStub.getBulkDownloadByToken, 'token');
            expect(result.current.downloadUrl).toBe('dummy-url');
            expect(result.current.status).toBe(AssetBulkDownloadState.Ready);
        });
    });

    it('should set status to error if getBulkDownloadByToken throws an error', async () => {
        const appBridgeStub = getAppBridgeBlockStub();
        appBridgeStub.getBulkDownloadByToken.rejects(appBridgeError);
        const { result } = renderHook(() => useAssetBulkDownload(appBridgeStub));
        result.current.generateBulkDownload();
        await waitFor(() => {
            expect(result.current.status).toBe(AssetBulkDownloadState.Error);
        });
    });

    it('should set status to pending if getBulkDownloadByToken doesnt return a signature', async () => {
        const appBridgeStub = getAppBridgeBlockStub();
        appBridgeStub.getBulkDownloadByToken.onCall(0).resolves({ downloadUrl: '', signature: '' });
        const { result } = renderHook(() => useAssetBulkDownload(appBridgeStub));
        result.current.generateBulkDownload();
        await waitFor(() => {
            expect(result.current.status).toBe(AssetBulkDownloadState.Pending);
        });
    });

    it('should call getBulkDownloadBySignature three times till it resolves with downloadUrl', async () => {
        const appBridgeStub = getAppBridgeBlockStub();
        vi.useFakeTimers();
        appBridgeStub.getBulkDownloadByToken.onCall(0).resolves({ downloadUrl: '', signature: 'signature' });
        appBridgeStub.getBulkDownloadBySignature.onCall(0).resolves({ downloadUrl: '', signature: 'signature' });
        appBridgeStub.getBulkDownloadBySignature.onCall(1).resolves({ downloadUrl: '', signature: 'signature' });

        const { result } = renderHook(() => useAssetBulkDownload(appBridgeStub));
        result.current.generateBulkDownload();

        await act(async () => {
            await vi.advanceTimersByTimeAsync(2500);
        });

        for (let i = 0; i < 3; i++) {
            await vi.runOnlyPendingTimersAsync();
        }

        // use Real Timers again otherwise waitFor will fail, because it would use the fake timer internally
        vi.useRealTimers();
        await waitFor(() => {
            sinon.assert.calledThrice(appBridgeStub.getBulkDownloadBySignature);
            expect(result.current.status).toBe(AssetBulkDownloadState.Ready);
            expect(result.current.downloadUrl).toBe('dummy-url');
        });
    });

    it('should call getBulkDownloadBySignature twice, second call will be rejected, state should be Error', async () => {
        const appBridgeStub = getAppBridgeBlockStub();
        vi.useFakeTimers();
        appBridgeStub.getBulkDownloadByToken.onCall(0).resolves({ downloadUrl: '', signature: 'signature' });
        appBridgeStub.getBulkDownloadBySignature.onCall(0).resolves({ downloadUrl: '', signature: 'signature' });
        appBridgeStub.getBulkDownloadBySignature.onCall(1).rejects(appBridgeError);

        const { result } = renderHook(() => useAssetBulkDownload(appBridgeStub));
        result.current.generateBulkDownload();

        await act(async () => {
            await vi.advanceTimersByTimeAsync(2500);
        });

        for (let i = 0; i < 2; i++) {
            await vi.runOnlyPendingTimersAsync();
        }

        // use Real Timers again otherwise waitFor will fail, because its would use the fake timer internally
        vi.useRealTimers();
        await waitFor(() => {
            sinon.assert.calledTwice(appBridgeStub.getBulkDownloadBySignature);
            expect(result.current.status).toBe(AssetBulkDownloadState.Error);
        });
    });

    it('should download the first asset set and after change the second asset set', async () => {
        const appBridgeStub = getAppBridgeBlockStub();
        appBridgeStub.getBulkDownloadByToken
            .onCall(1)
            .resolves({ downloadUrl: 'changed-dummy-url', signature: 'signature' });
        const { result } = renderHook(() => useAssetBulkDownload(appBridgeStub));
        result.current.generateBulkDownload();

        await waitFor(() => {
            expect(result.current.downloadUrl).toBe('dummy-url');
            expect(result.current.status).toBe(AssetBulkDownloadState.Ready);
        });

        result.current.generateBulkDownload();

        await waitFor(() => {
            expect(result.current.downloadUrl).toBe('changed-dummy-url');
            expect(result.current.status).toBe(AssetBulkDownloadState.Ready);
        });
    });

    it('should download the first asset set and after change the second asset set and get by signature', async () => {
        const appBridgeStub = getAppBridgeBlockStub();

        appBridgeStub.getBulkDownloadByToken.onCall(1).resolves({ downloadUrl: '', signature: 'signature' });
        appBridgeStub.getBulkDownloadBySignature
            .onCall(0)
            .resolves({ downloadUrl: 'change-dummy-url', signature: 'signature' });

        const { result } = renderHook(() => useAssetBulkDownload(appBridgeStub));
        result.current.generateBulkDownload();

        await waitFor(() => {
            expect(result.current.downloadUrl).toBe('dummy-url');
            expect(result.current.status).toBe(AssetBulkDownloadState.Ready);
        });

        vi.useFakeTimers();

        result.current.generateBulkDownload();

        await act(async () => {
            await vi.advanceTimersByTimeAsync(2500);
        });

        await vi.runOnlyPendingTimersAsync();

        // use Real Timers again otherwise waitFor will fail, because its would use the fake timer internally
        vi.useRealTimers();
        await waitFor(() => {
            expect(result.current.downloadUrl).toBe('change-dummy-url');
            expect(result.current.status).toBe(AssetBulkDownloadState.Ready);
        });
    });
    describe('polling lifecycle', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('should stop checking after the component unmounts', async () => {
            const appBridgeStub = getAppBridgeBlockStub();
            appBridgeStub.getBulkDownloadByToken.resolves({ downloadUrl: '', signature: 'signature' });
            appBridgeStub.getBulkDownloadBySignature.resolves({ downloadUrl: '', signature: 'signature' });

            const { result, unmount } = renderHook(() => useAssetBulkDownload(appBridgeStub));
            await act(async () => {
                result.current.generateBulkDownload();
                await vi.advanceTimersByTimeAsync(5000);
            });

            unmount();
            const callsAtUnmount = appBridgeStub.getBulkDownloadBySignature.callCount;

            await act(async () => {
                await vi.advanceTimersByTimeAsync(30_000);
            });

            expect(appBridgeStub.getBulkDownloadBySignature.callCount - callsAtUnmount).toBe(0);
        });

        it('should stop checking the previous download when a new one starts', async () => {
            const appBridgeStub = getAppBridgeBlockStub();
            appBridgeStub.getBulkDownloadByToken.onCall(0).resolves({ downloadUrl: '', signature: 'first' });
            appBridgeStub.getBulkDownloadByToken.onCall(1).resolves({ downloadUrl: 'second-url', signature: 'second' });
            appBridgeStub.getBulkDownloadBySignature.resolves({ downloadUrl: '', signature: 'first' });

            const { result } = renderHook(() => useAssetBulkDownload(appBridgeStub));
            await act(async () => {
                result.current.generateBulkDownload();
                await vi.advanceTimersByTimeAsync(5000);
            });

            await act(async () => {
                result.current.generateBulkDownload();
                await vi.advanceTimersByTimeAsync(100);
            });

            expect(result.current.downloadUrl).toBe('second-url');
            const callsAfterSecondDownload = appBridgeStub.getBulkDownloadBySignature.callCount;

            await act(async () => {
                await vi.advanceTimersByTimeAsync(30_000);
            });

            expect(appBridgeStub.getBulkDownloadBySignature.callCount - callsAfterSecondDownload).toBe(0);
        });

        it('should never have more than one check in flight when responses are slow', async () => {
            const appBridgeStub = getAppBridgeBlockStub();
            let inFlight = 0;
            let maxInFlight = 0;
            appBridgeStub.getBulkDownloadByToken.resolves({ downloadUrl: '', signature: 'signature' });
            appBridgeStub.getBulkDownloadBySignature.callsFake(async () => {
                inFlight += 1;
                maxInFlight = Math.max(maxInFlight, inFlight);
                await new Promise((resolve) => setTimeout(resolve, 6000));
                inFlight -= 1;
                return { downloadUrl: '', signature: 'signature' };
            });

            const { result } = renderHook(() => useAssetBulkDownload(appBridgeStub));
            await act(async () => {
                result.current.generateBulkDownload();
                await vi.advanceTimersByTimeAsync(40_000);
            });

            expect(maxInFlight).toBe(1);
        });
    });
});
