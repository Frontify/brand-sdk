/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type BlockSettingsUpdateEvent } from '../react/useBlockSettings';

import { type Asset } from './Asset';
import { type Color } from './Color';
import { type ColorPalette } from './ColorPalette';
import { type DocumentCategory } from './DocumentCategory';
import { type DocumentPage } from './DocumentPage';
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

    'AppBridge:ColorsUpdated': {
        blockId: number;
        colors: Color[];
        prevColors: Color[];
    };

    'AppBridge:ColorPalettesUpdated': {
        blockId: number;
        colorPalettes: ColorPalette[];
        prevColorPalettes: ColorPalette[];
    };

    'AppBridge:PrivacySettingsChanged': PrivacySettings;

    'AppBridge:OpenNavigationManager': void;

    'AppBridge:GuidelineDocumentPage:Action':
        | {
              documentPage: DocumentPage;
              action: 'add' | 'update' | 'move';
          }
        | {
              documentPage: { id: number; documentId: number; categoryId?: Nullable<number> };
              action: 'delete';
          };

    'AppBridge:GuidelineDocumentCategory:Action':
        | {
              documentCategory: DocumentCategory;
              action: 'add' | 'update';
          }
        | {
              documentCategory: { id: number; documentId: number };
              action: 'delete';
          };

    'AppBridge:GuidelineDocumentCategory:DocumentPageAction': {
        documentPage: { id: number; categoryId: number; documentId: number };
        action: 'add' | 'delete';
    };

    'AppBridge:GuidelineDocumentPageTargets:Action': {
        action: 'update';
        payload: {
            targets: number[];
            pageIds: number[];
        };
    };

    'AppBridge:GuidelineDocumentTargets:Action': {
        payload: {
            targets: number[];
            documentIds: number[];
        };
        action: 'update';
    };

    'AppBridge:ViewerOpened': AssetViewerOptions;

    'AppBridge:GuidelineDocumentPage:MoveEvent': {
        documentPage: DocumentPage | { id: number; sort?: Nullable<number> };
        documentId: number;
        categoryId?: Nullable<number>;
        position?: number;
        action: 'movePreview';
    };

    'AppBridge:GuidelineDocumentCategory:MoveEvent': {
        documentCategory: DocumentCategory | { id: number; sort?: Nullable<number> };
        documentId: number;
        position: number;
        action: 'movePreview';
    };
};
