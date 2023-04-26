/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { getAppBridgeBlockStub } from '../tests';
import { BulkDownloadState, useBulkDownload } from './';

const appBridgeError = new Error('Something went wrong');

describe('useBulkDownload', () => {
    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
        cleanup();
        sinon.restore();
    });

    it('should have init as initial state', () => {
        const appBridgeStub = getAppBridgeBlockStub();
        const { result } = renderHook(() => useBulkDownload(appBridgeStub));
        expect(result.current.status).toBe(BulkDownloadState.Init);
    });

    it('should call getBulkDownloadToken with the correct arguments', async () => {
        const appBridgeStub = getAppBridgeBlockStub();
        const assetIds = [1, 2, 3];
        const setIds = [4, 5, 6];
        const { result } = renderHook(() => useBulkDownload(appBridgeStub));
        result.current.generateBulkDownload(assetIds, setIds);
        await waitFor(() => {
            sinon.assert.calledWithExactly(appBridgeStub.getBulkDownloadToken, assetIds, setIds);
        });
    });

    it('should set status to error if getBulkDownloadToken throws an error', async () => {
        const appBridgeStub = getAppBridgeBlockStub();
        appBridgeStub.getBulkDownloadToken.rejects(appBridgeError);
        const { result } = renderHook(() => useBulkDownload(appBridgeStub));
        result.current.generateBulkDownload([1, 2, 3]);
        await waitFor(() => {
            expect(result.current.status).toBe(BulkDownloadState.Error);
        });
    });

    it('should set signature and set status to ready', async () => {
        const appBridgeStub = getAppBridgeBlockStub();
        const { result } = renderHook(() => useBulkDownload(appBridgeStub));
        result.current.generateBulkDownload([1, 2, 3]);
        await waitFor(() => {
            sinon.assert.calledWithExactly(appBridgeStub.getBulkDownloadByToken, 'token');
            expect(result.current.downloadUrl).toBe('dummy-url');
            expect(result.current.status).toBe(BulkDownloadState.Ready);
        });
    });

    it('should set status to error if getBulkDownloadByToken throws an error', async () => {
        const appBridgeStub = getAppBridgeBlockStub();
        appBridgeStub.getBulkDownloadByToken.rejects(appBridgeError);
        const { result } = renderHook(() => useBulkDownload(appBridgeStub));
        result.current.generateBulkDownload([1, 2, 3]);
        await waitFor(() => {
            expect(result.current.status).toBe(BulkDownloadState.Error);
        });
    });

    it('should set status to pending if getBulkDownloadByToken doesnt return a signature', async () => {
        const appBridgeStub = getAppBridgeBlockStub();
        appBridgeStub.getBulkDownloadByToken.onCall(0).resolves({ downloadUrl: '', signature: '' });
        const { result } = renderHook(() => useBulkDownload(appBridgeStub));
        result.current.generateBulkDownload([1, 2, 3]);
        await waitFor(() => {
            expect(result.current.status).toBe(BulkDownloadState.Pending);
        });
    });

    it('should call getBulkDownloadBySignature three times till it resolves with downloadUrl', async () => {
        const appBridgeStub = getAppBridgeBlockStub();
        vi.useFakeTimers();
        appBridgeStub.getBulkDownloadByToken.onCall(0).resolves({ downloadUrl: '', signature: 'signature' });
        appBridgeStub.getBulkDownloadBySignature.onCall(0).resolves({ downloadUrl: '', signature: 'signature' });
        appBridgeStub.getBulkDownloadBySignature.onCall(1).resolves({ downloadUrl: '', signature: 'signature' });

        const { result } = renderHook(() => useBulkDownload(appBridgeStub));
        result.current.generateBulkDownload([1, 2, 3]);

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
            expect(result.current.status).toBe(BulkDownloadState.Ready);
            expect(result.current.downloadUrl).toBe('dummy-url');
        });
    });

    it('should call getBulkDownloadBySignature twice, second call will be rejected, state should be Error', async () => {
        const appBridgeStub = getAppBridgeBlockStub();
        vi.useFakeTimers();
        appBridgeStub.getBulkDownloadByToken.onCall(0).resolves({ downloadUrl: '', signature: 'signature' });
        appBridgeStub.getBulkDownloadBySignature.onCall(0).resolves({ downloadUrl: '', signature: 'signature' });
        appBridgeStub.getBulkDownloadBySignature.onCall(1).rejects(appBridgeError);

        const { result } = renderHook(() => useBulkDownload(appBridgeStub));
        result.current.generateBulkDownload([1, 2, 3]);

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
            expect(result.current.status).toBe(BulkDownloadState.Error);
        });
    });

    it('should download the first asset set and after change the second asset set', async () => {
        const appBridgeStub = getAppBridgeBlockStub();
        appBridgeStub.getBulkDownloadByToken
            .onCall(1)
            .resolves({ downloadUrl: 'changed-dummy-url', signature: 'signature' });
        const { result } = renderHook(() => useBulkDownload(appBridgeStub));
        result.current.generateBulkDownload([1, 2, 3]);

        await waitFor(() => {
            expect(result.current.downloadUrl).toBe('dummy-url');
            expect(result.current.status).toBe(BulkDownloadState.Ready);
        });

        result.current.generateBulkDownload([4, 5, 6]);

        await waitFor(() => {
            expect(result.current.downloadUrl).toBe('changed-dummy-url');
            expect(result.current.status).toBe(BulkDownloadState.Ready);
        });
    });

    it('should download the first asset set and after change the second asset set and get by signature', async () => {
        const appBridgeStub = getAppBridgeBlockStub();

        appBridgeStub.getBulkDownloadByToken.onCall(1).resolves({ downloadUrl: '', signature: 'signature' });
        appBridgeStub.getBulkDownloadBySignature
            .onCall(0)
            .resolves({ downloadUrl: 'change-dummy-url', signature: 'signature' });

        const { result } = renderHook(() => useBulkDownload(appBridgeStub));
        result.current.generateBulkDownload([1, 2, 3]);

        await waitFor(() => {
            expect(result.current.downloadUrl).toBe('dummy-url');
            expect(result.current.status).toBe(BulkDownloadState.Ready);
        });

        vi.useFakeTimers();

        result.current.generateBulkDownload([4, 5, 6]);

        await act(async () => {
            await vi.advanceTimersByTimeAsync(2500);
        });

        await vi.runOnlyPendingTimersAsync();

        // use Real Timers again otherwise waitFor will fail, because its would use the fake timer internally
        vi.useRealTimers();
        await waitFor(() => {
            expect(result.current.downloadUrl).toBe('change-dummy-url');
            expect(result.current.status).toBe(BulkDownloadState.Ready);
        });
    });
});
