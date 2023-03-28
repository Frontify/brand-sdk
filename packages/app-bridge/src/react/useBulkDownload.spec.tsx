/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { getAppBridgeBlockStub } from '../tests';
import { BulkDownloadState, useBulkDownload } from './';

const appBridgeError = new Error('Something went wrong');
let appBridgeStub = getAppBridgeBlockStub();

describe('useBulkDownload', () => {
    beforeEach(() => {
        appBridgeStub = getAppBridgeBlockStub();
    });
    afterEach(() => {
        cleanup();
        sinon.restore();
    });

    it('should have init as initial state', () => {
        const { result } = renderHook(() => useBulkDownload(appBridgeStub, [1, 2], [], ''));
        expect(result.current.status).toBe(BulkDownloadState.Init);
    });

    it('should call getBulkDownloadToken with the correct arguments', async () => {
        const assetIds = [1, 2, 3];
        const setIds = [4, 5, 6];
        const { result } = renderHook(() => useBulkDownload(appBridgeStub, assetIds, setIds, ''));
        result.current.generateBulkDownload();
        await waitFor(() => {
            sinon.assert.calledWithExactly(appBridgeStub.getBulkDownloadToken, assetIds, setIds);
        });
    });

    it('should set status to error if getBulkDownloadToken throws an error', async () => {
        appBridgeStub.getBulkDownloadToken.rejects(appBridgeError);
        const { result } = renderHook(() => useBulkDownload(appBridgeStub, [1, 2, 3], [], ''));
        result.current.generateBulkDownload();
        await waitFor(() => {
            expect(result.current.status).toBe(BulkDownloadState.Error);
        });
    });

    it('should set signature and set status to ready', async () => {
        const { result } = renderHook(() => useBulkDownload(appBridgeStub, [1, 2, 3], [], ''));
        result.current.generateBulkDownload();
        await waitFor(() => {
            sinon.assert.calledWithExactly(appBridgeStub.getBulkDownloadByToken, 'token');
            expect(result.current.signature).toBe('dummy-signature');
            expect(result.current.status).toBe(BulkDownloadState.Ready);
        });
    });

    it('should set status to error if getBulkDownloadByToken throws an error', async () => {
        appBridgeStub.getBulkDownloadByToken.rejects(appBridgeError);
        const { result } = renderHook(() => useBulkDownload(appBridgeStub, [1, 2, 3], [], ''));
        result.current.generateBulkDownload();
        await waitFor(() => {
            expect(result.current.status).toBe(BulkDownloadState.Error);
        });
    });

    it('should set status to pending if getBulkDownloadByToken doesnt return a signature', async () => {
        appBridgeStub.getBulkDownloadByToken.onCall(0).resolves({ downloadUrl: '', signature: '' });
        const { result } = renderHook(() => useBulkDownload(appBridgeStub, [1, 2, 3], [], ''));
        result.current.generateBulkDownload();
        await waitFor(() => {
            expect(result.current.status).toBe(BulkDownloadState.Pending);
        });
    });

    it('should call getBulkDownloadBySignature three times till it resolves with downloadUrl', async () => {
        vi.useFakeTimers();
        appBridgeStub.getBulkDownloadByToken.onCall(0).resolves({ downloadUrl: '', signature: 'signature' });
        appBridgeStub.getBulkDownloadBySignature.onCall(0).resolves({ downloadUrl: '', signature: 'signature' });
        appBridgeStub.getBulkDownloadBySignature.onCall(1).resolves({ downloadUrl: '', signature: 'signature' });

        const { result } = renderHook(() => useBulkDownload(appBridgeStub, [1, 2, 3], [], ''));
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
            expect(result.current.status).toBe(BulkDownloadState.Ready);
            expect(result.current.download).toBe('dummy-url');
        });
    });

    it('should call getBulkDownloadBySignature twice, second call will be rejected, state should be Error', async () => {
        vi.useFakeTimers();
        appBridgeStub.getBulkDownloadByToken.onCall(0).resolves({ downloadUrl: '', signature: 'signature' });
        appBridgeStub.getBulkDownloadBySignature.onCall(0).resolves({ downloadUrl: '', signature: 'signature' });
        appBridgeStub.getBulkDownloadBySignature.onCall(1).rejects(appBridgeError);

        const { result } = renderHook(() => useBulkDownload(appBridgeStub, [1, 2, 3], [], ''));
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
            expect(result.current.status).toBe(BulkDownloadState.Error);
        });
    });

    it('should call getBulkDownloadBySignature once, if initialised with signature', async () => {
        const { result } = renderHook(() => useBulkDownload(appBridgeStub, [1, 2, 3], [], 'signature'));
        result.current.generateBulkDownload();

        await waitFor(() => {
            sinon.assert.calledOnce(appBridgeStub.getBulkDownloadBySignature);
            sinon.assert.notCalled(appBridgeStub.getBulkDownloadByToken);
            sinon.assert.notCalled(appBridgeStub.getBulkDownloadToken);
            expect(result.current.status).toBe(BulkDownloadState.Ready);
            expect(result.current.download).toBe('dummy-url');
            expect(result.current.signature).toBe('signature');
        });
    });

    it('should call getBulkDownloadBySignature once, if initialised with signature and token', async () => {
        appBridgeStub.getBulkDownloadBySignature.onCall(0).resolves({ downloadUrl: '', signature: 'signature' });
        const { result } = renderHook(() => useBulkDownload(appBridgeStub, [1, 2, 3], [], 'signature'));
        result.current.generateBulkDownload();

        await waitFor(() => {
            sinon.assert.calledTwice(appBridgeStub.getBulkDownloadBySignature);
            expect(result.current.status).toBe(BulkDownloadState.Ready);
            expect(result.current.download).toBe('dummy-url');
        });
    });

    it('should call getBulkDownloadBySignature once, if initialised with signature, but signature is invalid', async () => {
        appBridgeStub.getBulkDownloadBySignature.onCall(0).rejects(appBridgeError);
        const { result } = renderHook(() => useBulkDownload(appBridgeStub, [1, 2, 3], [], 'invalid-signature'));
        result.current.generateBulkDownload();

        await waitFor(() => {
            sinon.assert.calledTwice(appBridgeStub.getBulkDownloadBySignature);
            expect(result.current.status).toBe(BulkDownloadState.Ready);
            expect(result.current.download).toBe('dummy-url');
        });
    });
});
