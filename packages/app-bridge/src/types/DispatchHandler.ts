/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Asset } from './Asset';
import type { AssetChooserOptions } from './Terrific';

export type DispatchOption = {
    openAssetChooser?: AssetChooserOptions;
    closeAssetChooser: void;
    trackPlatformAnalytics: {
        name: 'asset:download';
        data: {
            asset: Asset;
            documentId?: number;
            downloadType: string;
        };
    };
    openAssetViewer: { token: string };
    openTemplateChooser: void;
    closeTemplateChooser: void;
    openNavigationManager: void;
};

export type DispatchHandler<CommandName extends keyof DispatchOption> = {
    name: CommandName;
    options: DispatchOption[CommandName];
};
