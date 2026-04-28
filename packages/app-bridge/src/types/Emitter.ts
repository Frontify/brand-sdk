/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type BlockSettingsUpdateEvent } from '../react/useBlockSettings';

import { type Asset } from './Asset';
import { type PrivacySettings } from './PrivacySettings';
import { type Template } from './Template';
import { type AssetViewerOptions } from './Terrific';

export type EmitterEvents = {
    'AppBridge:BlockSettingsUpdated': BlockSettingsUpdateEvent;

    'AppBridge:BlockTemplatesUpdated': {
        blockId: number;
        blockTemplates: Record<string, Template[]>;
        prevBlockTemplates: Record<string, Template[]>;
    };

    'AppBridge:BlockAssetsUpdated': {
        blockId: number;
        blockAssets: Record<string, Asset[]>;
        prevBlockAssets: Record<string, Asset[]>;
    };

    'AppBridge:PrivacySettingsChanged': PrivacySettings;

    'AppBridge:OpenNavigationManager': void;

    'AppBridge:ViewerOpened': AssetViewerOptions;
};
