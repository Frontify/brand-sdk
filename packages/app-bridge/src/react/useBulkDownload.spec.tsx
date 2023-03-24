/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, renderHook, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { getAppBridgeBlockStub } from '../tests';
import { BulkDownloadStatus, useBulkDownload } from './useBulkDownload';

const appBridgeStub = getAppBridgeBlockStub();

describe('useBulkDownload', () => {
    afterEach(() => {
        cleanup();
    });

    it('should have init as initial state', () => {
        const { result } = renderHook(() => useBulkDownload(appBridgeStub, [1, 2], [], 'en'));
        expect(result.current.status).toBe(BulkDownloadStatus.Init);
    });

    it('should set token and after generateBulkDownload resolves', async () => {
        const { result } = renderHook(() => useBulkDownload(appBridgeStub, [1, 2, 3], [], 'en'));
        result.current.generateBulkDownload();
        sinon.assert.calledOnceWithExactly(appBridgeStub.getBulkDownloadToken, [1, 2, 3], []);

        await waitFor(() => {
            expect(result.current.token).toBe('token');
        });
    });

    it('should set signature and bulkDownload and set status to ready', async () => {
        const { result } = renderHook(() => useBulkDownload(appBridgeStub, [1, 2, 3], [], 'en'));
        result.current.generateBulkDownload();
        await waitFor(() => {
            sinon.assert.calledWithExactly(appBridgeStub.getBulkDownloadByToken, 'token');
            expect(result.current.signature).toBe('dummy-signature');
            expect(result.current.status).toBe(BulkDownloadStatus.Ready);
        });
    });
});
