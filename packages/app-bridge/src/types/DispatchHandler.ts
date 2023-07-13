/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Asset } from './Asset';
import { AssetChooserOptions } from './Terrific';

export type DispatchOption = {
    openAssetChooser: AssetChooserOptions;
    closeAssetChooser: void;
    trackPlatformAnalytics: {
        name: 'asset:download';
        data: {
            asset: Asset;
            documentId?: number;
            downloadType: string;
        };
    };
};

export type DispatchHandler<CommandName extends keyof DispatchOption> = {
    commandName: CommandName;
    options?: DispatchOption[CommandName];
};
