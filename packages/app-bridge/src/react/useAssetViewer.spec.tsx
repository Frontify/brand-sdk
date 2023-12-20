/* (c) Copyright Frontify Ltd., all rights reserved. */

import { cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { AssetDummy, getAppBridgeBlockStub } from '../tests';

import { useAssetViewer } from './useAssetViewer';

describe('useAssetViewer', () => {
    afterEach(() => {
        cleanup();
    });

    const loadUseAssetViewer = () => {
        const asset = AssetDummy.with(1);
        const appBridgeStub = getAppBridgeBlockStub({
            blockId: 123,
            blockAssets: { key: [AssetDummy.with(1)] },
        });

        const { result } = renderHook(() => useAssetViewer(appBridgeStub));
        return { result, appBridgeStub, asset };
    };

    it('should open the asset viewer', async () => {
        const { result, appBridgeStub, asset } = loadUseAssetViewer();
        result.current.open(asset);

        const call = appBridgeStub.openAssetViewer.getCall(0);
        await waitFor(() => {
            expect(call.calledOnceWithExactly(asset.token)).toBe(true);
        });
    });
});
