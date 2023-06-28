/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Asset, AssetChooserOptions } from '../../types';

export interface AssetChooserActions {
    openAssetChooser: (callback: (selectedAsset: Asset[]) => void, options: AssetChooserOptions) => void;
    closeAssetChooser: () => void;
}
