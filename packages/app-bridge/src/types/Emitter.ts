/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { Emitter as MittEmitter } from 'mitt';

import type { BlockSettingsUpdateEvent } from '../react/useBlockSettings';

import type { Asset } from './Asset';
import type { Color } from './Color';
import { Document } from './Document';
import { DocumentPage } from './DocumentPage';
import { DocumentGroup } from './DocumentGroup';
import type { ColorPalette } from './ColorPalette';
import type { CoverPage } from './CoverPage';

export type EmitterAction = 'add' | 'update' | 'delete';

export type Emitter = MittEmitter<{
    'AppBridge:BlockSettingsUpdated': BlockSettingsUpdateEvent;
    'AppBridge:BlockAssetsUpdated': {
        blockId: number;
        blockAssets: Record<string, Asset[]>;
    };
    'AppBridge:ColorsUpdated': {
        blockId: number;
        colors: Color[];
    };
    'AppBridge:ColorPalettesUpdated': {
        blockId: number;
        colorPalettes: ColorPalette[];
    };
    'AppBridge:GuidelineDocumentUpdate': {
        document: Document | DocumentGroup;
        action: EmitterAction;
    };
    'AppBridge:GuidelineDocumentPageUpdate': {
        page: DocumentPage;
        action: EmitterAction;
    };
    'AppBridge:GuidelineCoverPageUpdate': {
        coverPage: CoverPage;
        action: EmitterAction;
    };
    'AppBridge:GuidelineBrandportalLinkUpdate': {
        brandportalLink: CoverPage;
        action: EmitterAction;
    };
}>;
