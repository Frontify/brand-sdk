/* (c) Copyright Frontify Ltd., all rights reserved. */

import { act } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, renderHook } from '@testing-library/react-hooks';

import { AssetDummy, getAppBridgeBlockStub } from '../tests';
import { useBlockAssets } from './useBlockAssets';

describe('useBlockAssets hook', () => {
    afterEach(() => {
        cleanup();
    });

    const loadUseBlockAssets = async () => {
        const asset = AssetDummy.with(1);
        const appBridgeStub = getAppBridgeBlockStub({
            blockId: 123,
            blockAssets: { key: [AssetDummy.with(1)] },
        });

        const { result } = renderHook(() => useBlockAssets(appBridgeStub));
        return { result, appBridgeStub, asset };
    };

    it('should delete an asset', async () => {
        const { result, appBridgeStub } = await loadUseBlockAssets();
        await act(async () => {
            await result.current.deleteAssetIdsFromKey('key', [1]);
        });

        const call = appBridgeStub.deleteAssetIdsFromBlockAssetKey.getCall(0);
        expect(call.firstArg).toEqual('key');
        expect(call.lastArg).toEqual([1]);
        expect(result.current.blockAssets).toStrictEqual({ key: [] });
    });

    it('should notify about updated assets on delete', async () => {
        const { result, asset } = await loadUseBlockAssets();

        await act(async () => {
            await result.current.deleteAssetIdsFromKey('key', [1]);
        });

        const call = window.emitter.emit.getCall(0);

        expect(call.firstArg).toEqual('AppBridge:BlockAssetsUpdated');
        expect(call.lastArg.blockId).toEqual(123);
        expect(call.lastArg.prevBlockAssets).toMatchObject({ key: [asset] });
        expect(call.lastArg.blockAssets).toStrictEqual({ key: [] });
    });

    it('should add asset ids', async () => {
        const { result, appBridgeStub } = await loadUseBlockAssets();
        await act(async () => {
            await result.current.addAssetIdsToKey('key', [2]);
        });

        const call = appBridgeStub.addAssetIdsToBlockAssetKey.getCall(0);
        expect(call.firstArg).toEqual('key');
        expect(call.lastArg).toEqual([2]);
        expect(result.current.blockAssets['key'].map(({ id }) => id)).toEqual([1, 2]);
    });

    it('should notify about updated assets on add asset ids to key', async () => {
        const { result, asset } = await loadUseBlockAssets();
        const assetToAdd = AssetDummy.with(2);
        await act(async () => {
            await result.current.addAssetIdsToKey('key', [assetToAdd.id]);
        });

        const call = window.emitter.emit.getCall(0);
        expect(call.firstArg).toEqual('AppBridge:BlockAssetsUpdated');
        expect(call.lastArg.blockId).toEqual(123);
        expect(call.lastArg.blockAssets).toMatchObject({ key: [asset, assetToAdd] });
        expect(call.lastArg.prevBlockAssets).toMatchObject({ key: [asset] });
    });
});
