/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AssetChooserOptions } from './Terrific';

export type BlockCommandPayload = {
    'AssetChooser.Open': {
        options: AssetChooserOptions;
    };
};

export type BlockCommandResponse = {
    'AssetChooser.Open': {
        on(event: 'AssetChooserAssetChosen', payload?: BlockCommandPayload['AssetChooser.Open']): void;
        close: () => void;
    };
};
