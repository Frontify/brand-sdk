/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Asset } from './Asset';
import { AssetChooserOptions } from './Terrific';

export type CommandResponse = {
    'AssetChooser.Open': {
        on(event: 'AssetChooserAssetChosen', callback: (selectedAssets: Asset[]) => void, options?: AssetChooserOptions): void;
        close: () => void;
    };
};
