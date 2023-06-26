/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Asset } from './Asset';

export type CommandResponse = {
    AssetViewer: {
        on(event: 'assetViewerOpened', callback: () => void): void;
        on(event: 'assetViewerClosed', callback: () => void): void;
    };
    AssetChooser: {
        on(event: 'assetChooserOpened', callback: (selectedAssets: Asset[]) => void): void;
        on(event: 'assetChooserClosed', callback: () => void): void;
    };
};
