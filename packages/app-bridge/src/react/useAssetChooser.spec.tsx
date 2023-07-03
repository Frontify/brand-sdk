/* (c) Copyright Frontify Ltd., all rights reserved. */

import { cleanup, renderHook } from '@testing-library/react';
import sinon from 'sinon';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { AppBridgeBlock } from '../AppBridgeBlock';
import { AssetDummy, getAppBridgeBlockStub } from '../tests';
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
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        result.current.openAssetChooser(() => {}, {});
        expect(appBridgeStub.dispatch.calledOnce).toBe(true);
        expect(appBridgeStub.dispatch.calledWith('AssetChooser.Open')).toBe(true);
    });
});
