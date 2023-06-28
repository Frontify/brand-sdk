/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Asset } from './Asset';
import { AssetChooserOptions } from './Terrific';

export type AssetViewerEvent = {
    AssetViewerOpen: 'AssetViewer.Open';
    AssetViewerClose: 'AssetViewer.Close';
};

export type AssetChooserEvent = 'AssetChooserOpen' | 'AssetChooserClose';

export type OffMethod = (eventName: AssetChooserEvent) => void;

export type OpenAssetChooserCallback = (
    callback: (selectedAssets: Asset[]) => void,
    options?: AssetChooserOptions,
) => void;

export type AssetChooserOnMethod = {
    AssetChooserOpen: (eventName: 'AssetChooserOpen') => {
        openAssetChooser: OpenAssetChooserCallback;
        closeAssetChooser: () => void;
        off: (eventName: AssetChooserEvent) => void;
    };
    AssetChooserClose: (eventName: 'AssetChooserClose') => {
        off: (eventName: AssetChooserEvent) => void;
    };
};

export type AssetViewerOnMethod = {
    AssetViewerOpen: (eventName: AssetViewerEvent['AssetViewerOpen']) => {
        off: OffMethod;
    };
};
