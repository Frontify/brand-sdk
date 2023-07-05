/* (c) Copyright Frontify Ltd., all rights reserved. */

import { act, cleanup, renderHook } from '@testing-library/react';
import sinon, { stub } from 'sinon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AppBridgeBlock } from '../AppBridgeBlock';
import { AssetChooserOptionsDummy, getAppBridgeBlockStub } from '../tests';
import { useAssetChooser } from './useAssetChooser';

describe('useAssetChooser hook', () => {
    let appBridgeStub: sinon.SinonStubbedInstance<AppBridgeBlock>;
    let assetChooserOpen: ReturnType<AppBridgeBlock['dispatch']>;

    beforeEach(() => {
        appBridgeStub = getAppBridgeBlockStub();
        assetChooserOpen = {
            on: () => null,
            close: () => null,
        };
        appBridgeStub.dispatch = stub<Parameters<AppBridgeBlock['dispatch']>>().returns(assetChooserOpen);
    });

    afterEach(() => {
        sinon.restore();
        cleanup();
    });

    it('should dispatch "AssetChooser.Open" on "openAssetChooser"', () => {
        const { result } = renderHook(() => useAssetChooser(appBridgeStub));
        const options = AssetChooserOptionsDummy.default();

        act(() => {
            result.current.openAssetChooser(vi.fn(), options);
        });
        expect(appBridgeStub.dispatch.calledOnce).toBe(true);
        expect(appBridgeStub.dispatch.calledWith('AssetChooser.Open', { options })).toBe(true);
    });

    it('should register "AssetChosen" handler', () => {
        const spiedOn = vi.spyOn(assetChooserOpen, 'on');
        const { result } = renderHook(() => useAssetChooser(appBridgeStub));
        const { openAssetChooser } = result.current;

        const callback = vi.fn();
        act(() => {
            openAssetChooser(callback, {});
        });
        expect(spiedOn).toHaveBeenCalledOnce();
        expect(spiedOn).toHaveBeenCalledWith('AssetChosen', callback);
    });

    it('should close AssetChooser', () => {
        const spiedClose = vi.spyOn(assetChooserOpen, 'close');
        const { result } = renderHook(() => useAssetChooser(appBridgeStub));
        const { openAssetChooser, closeAssetChooser } = result.current;

        act(() => {
            openAssetChooser(vi.fn(), {});
        });

        act(() => {
            closeAssetChooser();
        });

        expect(spiedClose).toHaveBeenCalledOnce();
    });
});
