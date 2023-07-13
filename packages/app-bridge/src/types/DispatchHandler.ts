/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AssetChooserOptions } from './Terrific';

export type DispatchOption = {
    openAssetChooser: AssetChooserOptions;
    closeAssetChooser: void;
};

export type DispatchHandler<CommandName extends keyof DispatchOption> = {
    commandName: CommandName;
    options?: DispatchOption[CommandName];
};
