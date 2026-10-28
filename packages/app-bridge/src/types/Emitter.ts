/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Asset } from './Asset';
import { type Template } from './Template';
import { type AssetViewerOptions } from './Terrific';

export type EmitterEvents = {
    'AppBridge:BlockAssetsUpdated': {
        blockId: number;
        blockAssets: Record<string, Asset[]>;
        prevBlockAssets: Record<string, Asset[]>;
    };

    'AppBridge:BlockTemplatesUpdated': {
        blockId: number;
        blockTemplates: Record<string, Template[]>;
        prevBlockTemplates: Record<string, Template[]>;
    };

    'AppBridge:ViewerOpened': AssetViewerOptions;
};
