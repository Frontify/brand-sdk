/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type BlockSettingsUpdateEvent } from '../react/useBlockSettings';

import { type Asset } from './Asset';
import { type PrivacySettings } from './PrivacySettings';
import { type Template } from './Template';
import { type AssetViewerOptions } from './Terrific';

export type EmitterAction = 'add' | 'update' | 'delete';

export type EmitterEvents = {
    'AppBridge:BlockSettingsUpdated': BlockSettingsUpdateEvent;

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

    'AppBridge:PrivacySettingsChanged': PrivacySettings;

    'AppBridge:ColorPalettesUpdated': {
        blockId: number;
        colorPalettes: ColorPalette[];
        prevColorPalettes: ColorPalette[];
    };

    'AppBridge:OpenNavigationManager': void;

    'AppBridge:ViewerOpened': AssetViewerOptions;
};
