/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Asset } from './Asset';

export type Command = 'AssetViewer' | 'AssetChooser';

export enum CommandEvents {
    AssetViewerOpened = 'assetViewerOpened',
    AssetViewerClosed = 'assetViewerClosed',
    AssetChooserOpened = 'assetChooserOpened',
    AssetChooserClosed = 'assetChooserClosed',
}

export type CommandResponse = {
    AssetViewer: {
        on(event: CommandEvents.AssetViewerOpened, callback: () => void): void;
        on(event: CommandEvents.AssetViewerClosed, callback: () => void): void;
    };
    AssetChooser: {
        on(event: CommandEvents.AssetChooserOpened, callback: (selectedAssets: Asset[]) => void): void;
        on(event: CommandEvents.AssetChooserClosed, callback: () => void): void;
    };
};
