/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Asset } from './Asset';
import { AssetChooserOptions } from './Terrific';

export type BlockCommandPayload = {
    'AssetChooser.Open': {
        options: AssetChooserOptions;
    };
};

export type BlockCommandResponse = {
    'AssetChooser.Open': {
        on: (event: 'AssetChosen', callback: (selectedAssets: Asset[]) => void) => void;
        close: () => void;
    };
};
