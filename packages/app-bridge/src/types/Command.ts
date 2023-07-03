/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AssetChooserOptions } from './Terrific';

export type CommandPayload = {
    'AssetChooser.Open': {
        options: AssetChooserOptions;
    };
};

export type CommandResponse = {
    'AssetChooser.Open': {
        on(event: 'AssetChooserAssetChosen', payload?: CommandPayload['AssetChooser.Open']): void;
        close: () => void;
    };
};
