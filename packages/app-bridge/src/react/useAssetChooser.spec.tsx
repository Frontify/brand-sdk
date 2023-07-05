/* (c) Copyright Frontify Ltd., all rights reserved. */

import { cleanup, renderHook } from '@testing-library/react';
import sinon, { stub } from 'sinon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AppBridgeBlock } from '../AppBridgeBlock';
import { AssetChooserOptionsDummy, AssetDummy, getAppBridgeBlockStub } from '../tests';
import { Asset, AssetChooserOptions } from '../types';
import { useAssetChooser } from './useAssetChooser';

describe('useAssetChooser hook', () => {
    const chosenAssets = [AssetDummy.with(1), AssetDummy.with(2)];
    let appBridgeStub: sinon.SinonStubbedInstance<AppBridgeBlock>;

    beforeEach(() => {
        appBridgeStub = getAppBridgeBlockStub({ chosenAssets });
    });

    afterEach(() => {
        sinon.restore();
        cleanup();
    });

    it('should dispatch "AssetChooser.Open" on "openAssetChooser"', () => {
        const { result } = renderHook(() => useAssetChooser(appBridgeStub));
        const options = AssetChooserOptionsDummy.default();
        result.current.openAssetChooser(vi.fn(), options);
        expect(appBridgeStub.dispatch.calledOnce).toBe(true);
        expect(appBridgeStub.dispatch.calledWith('AssetChooser.Open', { options })).toBe(true);
    });

    it('should register "AssetChosen" handler', async () => {
        // stub object for AssetChooser.Open
        const assetChooserOpen: Awaited<ReturnType<AppBridgeBlock['dispatch']>> = {
            on: () => null,
            close: () => null,
        };
        const spiedOn = vi.spyOn(assetChooserOpen, 'on');

        appBridgeStub.dispatch = stub<Parameters<AppBridgeBlock['dispatch']>>().returns(assetChooserOpen);

        const { result } = renderHook(() => useAssetChooser(appBridgeStub));

        const callback = vi.fn();
        await result.current.openAssetChooser(callback, {});
        expect(spiedOn).toHaveBeenCalledOnce();
        expect(spiedOn).toHaveBeenCalledWith('AssetChosen', callback);
    });
});
