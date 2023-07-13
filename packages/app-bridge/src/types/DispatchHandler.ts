/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Asset } from './Asset';
import { AssetChooserOptions } from './Terrific';

export type DispatchOption = {
    'AssetChooser.Open': AssetChooserOptions;
    'AssetChooser.Close': void;
    'Tracking.Send': {
        name: 'download asset';
        data: {
            asset: Asset;
        };
    };
};

export type DispatchHandler<CommandName extends keyof DispatchOption> = {
    commandName: CommandName;
    options?: DispatchOption[CommandName];
};
