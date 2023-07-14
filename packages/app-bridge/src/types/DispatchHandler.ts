/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { AssetChooserOptions } from './Terrific';

export type DispatchOption = {
    openAssetChooser: AssetChooserOptions;
    closeAssetChooser: void;
    openAssetViewer: { token: string };
    openTemplateChooser: void;
    closeTemplateChooser: void;
};

export type DispatchHandler<CommandName extends keyof DispatchOption> = {
    commandName: CommandName;
    options?: DispatchOption[CommandName];
};
