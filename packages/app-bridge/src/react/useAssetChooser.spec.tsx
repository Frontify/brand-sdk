/* (c) Copyright Frontify Ltd., all rights reserved. */

import React from 'react';
import sinon from 'sinon';
import { afterEach, describe, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import type { Asset } from '../types/Asset';
import { AppBridgeBlock } from '../AppBridgeBlock';
import { useAssetChooser } from './useAssetChooser';
import { withAppBridgeBlockStubs } from '../tests/withAppBridgeBlockStubs';

const OPEN_ASSET_CHOOSER_BUTTON_ID = 'open-asset-chooser';
const CLOSE_ASSET_CHOOSER_BUTTON_ID = 'close-asset-chooser';

const AssetChooserDummy = ({
    appBridge,
    onAssetChosen,
}: {
    appBridge: AppBridgeBlock;
    onAssetChosen?: (selectedAssets: Asset[]) => void;
}) => {
    const { openAssetChooser, closeAssetChooser } = useAssetChooser(appBridge);

    return (
        <>
            <button
                data-test-id={OPEN_ASSET_CHOOSER_BUTTON_ID}
                onClick={() => openAssetChooser(onAssetChosen ?? (() => null), {})}
            />
            <button data-test-id={CLOSE_ASSET_CHOOSER_BUTTON_ID} onClick={() => closeAssetChooser()} />
        </>
    );
};

describe('useReadyForPrint hook', () => {
    afterEach(() => {
        cleanup();
    });

    it('should open the asset chooser', () => {
        const [BlockWithStubs, appBridge] = withAppBridgeBlockStubs(AssetChooserDummy);
        const { getByTestId } = render(<BlockWithStubs />);
        const openAssetChooserButton = getByTestId(OPEN_ASSET_CHOOSER_BUTTON_ID) as HTMLButtonElement;
        openAssetChooserButton.click();
        sinon.assert.calledOnce(appBridge.dispatch);
    });

    it.skip('should close the asset chooser', () => {
        const [BlockWithStubs, appBridge] = withAppBridgeBlockStubs(AssetChooserDummy);
        const { close } = appBridge.dispatch('AssetChooser.Open');
        const { getByTestId } = render(<BlockWithStubs />);
        const openAssetChooserButton = getByTestId(CLOSE_ASSET_CHOOSER_BUTTON_ID) as HTMLButtonElement;
        openAssetChooserButton.click();
        // @ts-ignore // Will be removed. Added atm for pushing the updates to PR
        sinon.assert.calledOnce(close);
    });
});
