/* (c) Copyright Frontify Ltd., all rights reserved. */

import { cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { AssetDummy, getAppBridgeBlockStub } from '../tests';
import { useAssetViewer } from './useAssetViewer';

describe('useAssetViewer', () => {
    afterEach(() => {
        cleanup();
    });

    const loadUseAssetViewer = async () => {
        const asset = AssetDummy.with(1);
        const appBridgeStub = getAppBridgeBlockStub({
            blockId: 123,
            blockAssets: { key: [AssetDummy.with(1)] },
        });

        const { result } = renderHook(() => useAssetViewer(appBridgeStub));
        return { result, appBridgeStub, asset };
    };

    it('should open the asset viewer', async () => {
        const { result, appBridgeStub, asset } = await loadUseAssetViewer();
        result.current.open(asset);

        const call = appBridgeStub.dispatch.getCall(0);
        waitFor(() => {
            expect(
                call.calledOnceWithExactly({
                    commandName: 'AssetViewer.Open',
                    options: {
                        token: asset.token,
                    },
                }),
            ).toBe(true);
        });
    });
});
