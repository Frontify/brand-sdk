/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { AssetChooserOptions } from './Terrific';

export type DispatchOption = {
    openAssetChooser?: AssetChooserOptions;
    closeAssetChooser: void;
    openAssetViewer: { token: string };
    openTemplateChooser: void;
    closeTemplateChooser: void;
    openNavigationManager: void;
};

export type DispatchHandler<CommandName extends keyof DispatchOption> = DispatchOption[CommandName] extends void
    ? { name: CommandName }
    : { name: CommandName; options: DispatchOption[CommandName] };
