/* (c) Copyright Frontify Ltd., all rights reserved. */

import { act, cleanup, renderHook } from '@testing-library/react';
import sinon from 'sinon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AppBridgeBlock } from '../AppBridgeBlock';
import { AssetChooserOptionsDummy, getAppBridgeBlockStub } from '../tests';
import { useAssetChooser } from './useAssetChooser';

describe('useAssetChooser hook', () => {
    let appBridgeStub: sinon.SinonStubbedInstance<AppBridgeBlock>;

    beforeEach(() => {
        appBridgeStub = getAppBridgeBlockStub();
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
        expect(
            appBridgeStub.dispatch.calledWith({
                commandName: 'AssetChooser.Open',
                options,
            }),
        ).toBe(true);
    });

    it('should subscribe to "AssetChooser.AssetChosen" handler', () => {
        const spiedOn = vi.spyOn(appBridgeStub, 'subscribe');
        const { result } = renderHook(() => useAssetChooser(appBridgeStub));
        const { openAssetChooser } = result.current;

        const callback = vi.fn();
        act(() => {
            openAssetChooser(callback, {});
        });
        expect(spiedOn).toHaveBeenCalledOnce();
        expect(spiedOn).toHaveBeenCalledWith('AssetChooser.AssetChosen', callback);
    });

    it('should dispatch AssetChooser.Close', () => {
        const spiedClose = vi.spyOn(appBridgeStub, 'dispatch');
        const { result } = renderHook(() => useAssetChooser(appBridgeStub));
        const { closeAssetChooser } = result.current;

        act(() => {
            closeAssetChooser();
        });

        expect(spiedClose).toHaveBeenCalledOnce();
        expect(spiedClose).toHaveBeenCalledWith({
            commandName: 'AssetChooser.Close',
        });
    });
});
