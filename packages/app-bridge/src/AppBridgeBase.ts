/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    Color,
    ColorPalette,
    Document,
    DocumentCategory,
    DocumentGroup,
    DocumentPage,
    DocumentPageTargets,
    DocumentSection,
    DocumentTargets,
} from './types';

export interface AppBridgeBase {
    getProjectId(): number;

    getEditorState(): boolean;

    getTranslationLanguage(): string;

    getColorPalettes(): Promise<ColorPalette[]>;

    getColorsByColorPaletteId(colorPaletteId: number): Promise<Color[]>;

    getAllDocuments(): Promise<Document[]>;

    getDocumentGroups(): Promise<DocumentGroup[]>;

    getDocumentPagesByDocumentId(documentId: number): Promise<DocumentPage[]>;

    getDocumentCategoriesByDocumentId(documentId: number): Promise<DocumentCategory[]>;

    getUncategorizedPagesByDocumentId(documentId: number): Promise<DocumentPage[]>;

    getDocumentSectionsByDocumentPageId(documentPageId: number): Promise<DocumentSection[]>;

    getDocumentTargets(documentId: number): Promise<DocumentTargets>;

    getDocumentPageTargets(documentPageId: number): Promise<DocumentPageTargets>;
}
