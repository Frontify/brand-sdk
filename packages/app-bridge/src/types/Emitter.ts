/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { Emitter as MittEmitter } from 'mitt';

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

export type EmitterAction = 'add' | 'update' | 'delete';

export type Emitter = MittEmitter<{
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

    'AppBridge:GuidelineStandardDocumentAction':
        | {
              standardDocument: Document;
              action: 'add' | 'update';
          }
        | {
              standardDocument: { id: number };
              action: 'delete';
          };

    'AppBridge:GuidelineLibraryAction':
        | {
              library: Document;
              action: 'add' | 'update';
          }
        | {
              library: { id: number };
              action: 'delete';
          };

    'AppBridge:GuidelineLinkAction':
        | {
              link: Document;
              action: 'add' | 'update';
          }
        | {
              link: { id: number };
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

    'AppBridge:GuidelineDocumentMoveAction': {
        document: Document;
        action: 'update';
    };
}>;
