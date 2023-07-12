/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AssetChooserOptions } from './Terrific';

export type DispatchOption = {
    'AssetChooser.Open': AssetChooserOptions;
    'AssetChooser.Close': void;
    'AssetViewer.Open': { token: string };
    'TemplateChooser.Open': void;
};

export type DispatchHandler<CommandName extends keyof DispatchOption> = {
    commandName: CommandName;
    options?: DispatchOption[CommandName];
};
