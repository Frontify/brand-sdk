/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    Color,
    ColorPalette,
    DispatchAction,
    Document,
    DocumentCategory,
    DocumentGroup,
    DocumentPage,
    DocumentPageTargets,
    DocumentSection,
    DocumentTargets,
} from './types';

export interface AppBridgeBase {
    dispatch(action: 'GetProjectId'): Promise<number>;
    dispatch(action: 'GetEditorState'): boolean;
    dispatch(action: 'GetTranslationLanguage'): string;
    dispatch(action: 'GetColorPalettes'): Promise<ColorPalette[]>;
    dispatch(action: DispatchAction, payload?: unknown): unknown;

    /**
     * @deprecated Use `dispatch('GetProjectId')` instead.
     * This will be removed in version 4.0.0 of @frontify/app-bridge.
     */
    getProjectId(): number;

    /**
     * @deprecated Use `dispatch('GetEditorState')` instead.
     * This will be removed in version 4.0.0 of @frontify/app-bridge.
     */
    getEditorState(): boolean;

    /**
     * @deprecated Use `dispatch('GetTranslationLanguage')` instead.
     * This will be removed in version 4.0.0 of @frontify/app-bridge.
     */
    getTranslationLanguage(): string;

    /**
     * @deprecated Use `await dispatch('GetColorPalettes')` instead.
     * This will be removed in version 4.0.0 of @frontify/app-bridge.
     */
    getColorPalettes(): Promise<ColorPalette[]>;

    getColorsByColorPaletteId(colorPaletteId: number): Promise<Color[]>;

    getAllDocuments(): Promise<Document[]>;

    getUngroupedDocuments(): Promise<Document[]>;

    getDocumentsByDocumentGroupId(documentGroupId: number): Promise<Document[]>;

    getDocumentGroups(): Promise<DocumentGroup[]>;

    getDocumentPagesByDocumentId(documentId: number): Promise<DocumentPage[]>;

    getDocumentPagesByDocumentCategoryId(documentCategoryId: number): Promise<DocumentPage[]>;

    getDocumentCategoriesByDocumentId(documentId: number): Promise<DocumentCategory[]>;

    getUncategorizedDocumentPagesByDocumentId(documentId: number): Promise<DocumentPage[]>;

    getDocumentSectionsByDocumentPageId(documentPageId: number): Promise<DocumentSection[]>;

    getDocumentTargets(documentId: number): Promise<DocumentTargets>;

    getDocumentPageTargets(documentPageId: number): Promise<DocumentPageTargets>;
}
