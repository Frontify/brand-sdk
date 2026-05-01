/* (c) Copyright Frontify Ltd., all rights reserved. */

import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AssetDummy, getAppBridgeBlockStub } from '../tests';

import { useBlockAssets } from './useBlockAssets';

describe('useBlockAssets hook', () => {
    beforeEach(() => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
        cleanup();
    });

    const loadUseBlockAssets = (existingAssets = [AssetDummy.with(1)]) => {
        const asset = AssetDummy.with(1);
        const appBridgeStub = getAppBridgeBlockStub({
            blockId: 123,
            blockAssets: { key: existingAssets },
        });

        const { result } = renderHook(() => useBlockAssets(appBridgeStub));
        return { result, appBridgeStub, asset };
    };

    it('should initialize block assets from context without calling getBlockAssets', () => {
        const { result, appBridgeStub } = loadUseBlockAssets();

        expect(result.current.blockAssets.key.map(({ id }) => id)).toEqual([1]);
        sinon.assert.notCalled(appBridgeStub.getBlockAssets);
    });

    it('should fall back to empty assets when context does not provide assets', () => {
        const appBridgeStub = getAppBridgeBlockStub({
            blockId: 123,
            blockAssets: { key: [AssetDummy.with(1)] },
        });
        appBridgeStub.context.withArgs('assets').returns({ get: () => undefined, subscribe: () => () => undefined });

        const { result } = renderHook(() => useBlockAssets(appBridgeStub));

        expect(result.current.blockAssets).toStrictEqual({});
        sinon.assert.notCalled(appBridgeStub.getBlockAssets);
    });

    it('should delete an asset', async () => {
        const { result, appBridgeStub } = loadUseBlockAssets();
        await act(async () => {
            await result.current.deleteAssetIdsFromKey('key', [1]);
        });

        const call = appBridgeStub.deleteAssetIdsFromBlockAssetKey.getCall(0);
        await waitFor(() => {
            expect(call.firstArg).toEqual('key');
            expect(call.lastArg).toEqual([1]);
            expect(result.current.blockAssets).toStrictEqual({ key: [] });
        });
    });

    it('should set assets', async () => {
        const { result, appBridgeStub } = loadUseBlockAssets([AssetDummy.with(1), AssetDummy.with(2)]);

        await act(async () => {
            await result.current.updateAssetIdsFromKey('key', [2, 1]);
        });

        await waitFor(() => {
            sinon.assert.calledWithExactly(appBridgeStub.api, {
                name: 'setAssetIdsByBlockAssetKey',
                payload: { key: 'key', assetIds: [2, 1] },
            });
            expect(result.current.blockAssets.key.map((asset) => asset.id)).toEqual([2, 1]);
        });
    });

    it('should not sort assets if api call throws error', async () => {
        const { result, appBridgeStub } = loadUseBlockAssets([AssetDummy.with(1), AssetDummy.with(2)]);
        (appBridgeStub.api as unknown as Mock) = vi.fn().mockImplementation(() => {
            return Promise.reject(new Error('Unsuccessful API call'));
        });

        await act(async () => {
            await result.current.updateAssetIdsFromKey('key', [2, 1]);
        });

        await waitFor(() => {
            expect(result.current.blockAssets.key.map((asset) => asset.id)).toEqual([1, 2]);
        });

        expect(console.error).toHaveBeenCalledOnce();
    });

    it('should add asset ids', async () => {
        const { result, appBridgeStub } = loadUseBlockAssets();
        await act(async () => {
            await result.current.addAssetIdsToKey('key', [2]);
        });

        const call = appBridgeStub.addAssetIdsToBlockAssetKey.getCall(0);
        await waitFor(() => {
            expect(call.firstArg).toEqual('key');
            expect(call.lastArg).toEqual([2]);
            expect(result.current.blockAssets.key.map(({ id }) => id)).toEqual([1, 2]);
        });
    });

    it('does not fetch block assets after a mutation', async () => {
        const { result, appBridgeStub } = loadUseBlockAssets();

        await act(async () => {
            await result.current.deleteAssetIdsFromKey('key', [1]);
        });
        await act(async () => {
            await result.current.addAssetIdsToKey('key', [2]);
        });
        await act(async () => {
            await result.current.updateAssetIdsFromKey('key', [3]);
        });

        sinon.assert.notCalled(appBridgeStub.getBlockAssets);
    });

    it('unsubscribes from Context.assets on unmount', () => {
        const appBridgeStub = getAppBridgeBlockStub({
            blockId: 123,
            blockAssets: { key: [AssetDummy.with(1)] },
        });
        const unsubscribe = sinon.spy();
        appBridgeStub.context.withArgs('assets').returns({
            get: () => ({}),
            subscribe: () => unsubscribe,
        });

        const { unmount } = renderHook(() => useBlockAssets(appBridgeStub));
        sinon.assert.notCalled(unsubscribe);

        unmount();
        sinon.assert.calledOnce(unsubscribe);
    });
});
