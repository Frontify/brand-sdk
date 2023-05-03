/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { Asset } from './Asset';
import { BlockSettingsUpdateEvent } from './BlockSettings';
import type { BrandportalLink } from './BrandportalLink';
import type { Color } from './Color';
import type { ColorPalette } from './ColorPalette';
import type { CoverPage } from './CoverPage';
import type { Document } from './Document';
import type { DocumentCategory } from './DocumentCategory';
import type { DocumentGroup } from './DocumentGroup';
import type { DocumentPage } from './DocumentPage';
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

    'AppBridge:GuidelineDocumentAction':
        | {
              document: Document;
              action: 'add' | 'update';
          }
        | {
              document: { id: number };
              action: 'delete';
          };

    'AppBridge:GuidelineDocumentGroupAction':
        | {
              documentGroup: DocumentGroup;
              action: 'add' | 'update';
          }
        | {
              documentGroup: { id: number };
              action: 'delete';
          };

    'AppBridge:GuidelineCoverPageAction':
        | {
              coverPage: CoverPage;
              action: 'add' | 'update';
          }
        | {
              action: 'delete';
          };

    'AppBridge:GuidelineBrandportalLinkAction': {
        brandportalLink: BrandportalLink;
        action: 'update';
    };

    'AppBridge:PrivacySettingsChanged': PrivacySettings;

    'AppBridge:OpenNavigationManager': void;

    [key: `AppBridge:GuidelineDocumentPageAction:${number}`]:
        | {
              documentPage: DocumentPage;
              action: 'add' | 'update';
          }
        | {
              documentPage: { id: number };
              action: 'delete';
          };

    [key: `AppBridge:GuidelineDocumentCategoryAction:${number}`]:
        | {
              documentCategory: DocumentCategory;
              action: 'add' | 'update';
          }
        | {
              documentCategory: { id: number };
              action: 'delete';
          };

    [key: `AppBridge:GuidelineDocumentCategoryPageAction:${number}`]:
        | {
              documentPage: { id: number; categoryId: number };
              action: 'add' | 'update';
          }
        | {
              documentPage: { id: number };
              action: 'delete';
          };

    'AppBridge:GuidelineDocumentGroupDocumentAction':
        | {
              document: { id: number; documentGroupId: number };
              action: 'add' | 'update';
          }
        | {
              document: { id: number };
              action: 'delete';
          };

    'AppBridge:GuidelineDocumentPageTargetsAction': {
        action: 'update';
        payload: {
            targets: number[];
            pageIds: number[];
        };
    };

    'AppBridge:GuidelineDocumentTargetsAction': {
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
