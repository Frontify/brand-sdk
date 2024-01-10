/* (c) Copyright Frontify Ltd., all rights reserved. */

import React from 'react';
import sinon from 'sinon';
import { afterEach, describe, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import type { Asset } from '../types/Asset';
import { AppBridgeBlock } from '../AppBridgeBlock';
import { useAssetChooser } from './useAssetChooser';
import { withAppBridgeBlockStubs } from '../tests/withAppBridgeBlockStubs';
import { AssetDummy } from '..';

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

describe('useAssetChooser hook', () => {
    afterEach(() => {
        sinon.reset();
        cleanup();
    });

    it('should open the asset chooser', () => {
        const [BlockWithStubs, appBridge] = withAppBridgeBlockStubs(AssetChooserDummy);
        const { getByTestId } = render(<BlockWithStubs />);
        const openAssetChooserButton = getByTestId(OPEN_ASSET_CHOOSER_BUTTON_ID) as HTMLButtonElement;
        openAssetChooserButton.click();
        sinon.assert.calledWith(appBridge.dispatch, sinon.match.has('name', 'openAssetChooser'));
    });

    it('should close the asset chooser', () => {
        const [BlockWithStubs, appBridge] = withAppBridgeBlockStubs(AssetChooserDummy);
        const { getByTestId } = render(<BlockWithStubs />);
        const openAssetChooserButton = getByTestId(CLOSE_ASSET_CHOOSER_BUTTON_ID) as HTMLButtonElement;
        openAssetChooserButton.click();
        sinon.assert.calledWith(appBridge.dispatch, sinon.match.has('name', 'closeAssetChooser'));
    });

    it('should call the onAssetChosen callback when an asset is chosen', () => {
        const [BlockWithStubs] = withAppBridgeBlockStubs(AssetChooserDummy);
        const onAssetChosen = sinon.spy();
        const { getByTestId } = render(<BlockWithStubs onAssetChosen={onAssetChosen} />);
        const openAssetChooserButton = getByTestId(OPEN_ASSET_CHOOSER_BUTTON_ID) as HTMLButtonElement;
        openAssetChooserButton.click();
        sinon.assert.calledWith(onAssetChosen, [AssetDummy.with(123)]);
    });
});
