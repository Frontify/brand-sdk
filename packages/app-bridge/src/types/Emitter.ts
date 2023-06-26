/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { BlockSettingsUpdateEvent } from '../react/useBlockSettings';

import type { Asset } from './Asset';
import type { Color } from './Color';
import type { Document } from './Document';
import type { DocumentPage } from './DocumentPage';
import type { ColorPalette } from './ColorPalette';
import type { CoverPage } from './CoverPage';
import type { DocumentGroup } from './DocumentGroup';
import type { DocumentCategory } from './DocumentCategory';
import type { BrandportalLink } from './BrandportalLink';
import type { PrivacySettings } from './PrivacySettings';

export type EmitterAction = 'add' | 'update' | 'delete';

export type EmitterEvents = {
    'AppBridge:PageTemplateSettingsUpdated': { pageTemplateSettings: Record<string, unknown> };
    'AppBridge:BlockSettingsUpdated': BlockSettingsUpdateEvent;

    'AppBridge:BlockAssetsUpdated': {
        blockId: number;
        blockAssets: Record<string, Asset[]>;
        prevBlockAssets: Record<string, Asset[]>;
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

    'AppBridge:GuidelineDocument:Action':
        | {
              document: Document;
              action: 'add' | 'update' | 'move';
          }
        | {
              document: { id: number; documentGroupId?: Nullable<number> };
              action: 'delete';
          };

    'AppBridge:GuidelineDocumentGroup:Action':
        | {
              documentGroup: DocumentGroup;
              action: 'add' | 'update';
          }
        | {
              documentGroup: { id: number };
              action: 'delete';
          };

    'AppBridge:GuidelineCoverPage:Action':
        | {
              coverPage: CoverPage;
              action: 'add' | 'update';
          }
        | {
              action: 'delete';
          };

    'AppBridge:GuidelineBrandportalLink:Action': {
        brandportalLink: BrandportalLink;
        action: 'update';
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
        documentPage: { id: number; categoryId: number };
        action: 'add' | 'delete';
    };

    'AppBridge:GuidelineDocument:DocumentPageAction': {
        documentPage: { id: number; documentId: number };
        action: 'add' | 'delete';
    };

    'AppBridge:GuidelineDocument:DocumentCategoryAction': {
        documentCategory: { id: number; documentId: number };
        action: 'add' | 'delete';
    };

    'AppBridge:GuidelineDocument:MoveEvent': {
        document: Document | { id: number; documentGroupId?: Nullable<number> };
        position: number;
        newGroupId?: Nullable<number>;
        action: 'movePreview';
    };

    'AppBridge:GuidelineDocumentGroup:DocumentAction': {
        document: { id: number; documentGroupId: number };
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

    'AppBridge:ViewerOpened': {
        token: string;
    };
};
