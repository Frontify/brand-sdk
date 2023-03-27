/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, renderHook, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { getAppBridgeBlockStub } from '../tests';
import { BulkDownloadState, useBulkDownload } from './useBulkDownload';

const appBridgeError = new Error('Something went wrong');
let appBridgeStub = getAppBridgeBlockStub();

describe('useBulkDownload', () => {
    beforeEach(() => {
        appBridgeStub = getAppBridgeBlockStub();
    });
    afterEach(() => {
        cleanup();
    });

    it('should have init as initial state', () => {
        const { result } = renderHook(() => useBulkDownload(appBridgeStub, [1, 2], []));
        expect(result.current.status).toBe(BulkDownloadState.Init);
    });

    it('should call getBulkDownloadToken with the correct arguments', async () => {
        const assetIds = [1, 2, 3];
        const setIds = [4, 5, 6];
        const { result } = renderHook(() => useBulkDownload(appBridgeStub, assetIds, setIds));
        result.current.generateBulkDownload();
        await waitFor(() => {
            sinon.assert.calledWithExactly(appBridgeStub.getBulkDownloadToken, assetIds, setIds);
        });
    });

    it('should set status to error if getBulkDownloadToken throws an error', async () => {
        appBridgeStub.getBulkDownloadToken.rejects(appBridgeError);
        const { result } = renderHook(() => useBulkDownload(appBridgeStub, [1, 2, 3], []));
        result.current.generateBulkDownload();
        await waitFor(() => {
            expect(result.current.status).toBe(BulkDownloadState.Error);
        });
    });

    it('should set signature and set status to ready', async () => {
        const { result } = renderHook(() => useBulkDownload(appBridgeStub, [1, 2, 3], []));
        result.current.generateBulkDownload();
        await waitFor(() => {
            sinon.assert.calledWithExactly(appBridgeStub.getBulkDownloadByToken, 'token');
            expect(result.current.signature).toBe('dummy-signature');
            expect(result.current.status).toBe(BulkDownloadState.Ready);
        });
    });

    it('should set status to error if getBulkDownloadByToken throws an error', async () => {
        appBridgeStub.getBulkDownloadByToken.rejects(appBridgeError);
        const { result } = renderHook(() => useBulkDownload(appBridgeStub, [1, 2, 3], []));
        result.current.generateBulkDownload();
        await waitFor(() => {
            expect(result.current.status).toBe(BulkDownloadState.Error);
        });
    });

    it('should set status to pending if getBulkDownloadByToken doesnt return a signature', async () => {
        appBridgeStub.getBulkDownloadByToken.onCall(0).resolves({ downloadUrl: '', signature: '' });
        const { result } = renderHook(() => useBulkDownload(appBridgeStub, [1, 2, 3], []));
        result.current.generateBulkDownload();
        await waitFor(() => {
            expect(result.current.status).toBe(BulkDownloadState.Pending);
        });
    });
});
