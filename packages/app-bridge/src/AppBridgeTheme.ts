/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AppBridgeBase } from './AppBridgeBase';
import type {
    Asset,
    BrandportalLink,
    CoverPage,
    CoverPageCreate,
    CoverPageUpdate,
    CoverPageUpdateLegacy,
    Document,
    DocumentCategory,
    DocumentCategoryCreate,
    DocumentCategoryUpdate,
    DocumentGroup,
    DocumentGroupCreate,
    DocumentGroupUpdate,
    DocumentLibraryCreate,
    DocumentLibraryUpdate,
    DocumentLinkCreate,
    DocumentLinkUpdate,
    DocumentPage,
    DocumentPageCreate,
    DocumentPageDuplicate,
    DocumentPageUpdate,
    DocumentStandardCreate,
    DocumentStandardUpdate,
    GuidelineSearchResult,
    TargetsUpdate,
} from './types';

export interface AppBridgeTheme extends AppBridgeBase {
    getPortalId(): number;

    getBrandId(): number;

    /**
     * @deprecated This will be removed in version 4.0.0 of @frontify/app-bridge
     * Use appBridge.dispatch(openNavigationManager()) for opening the Navigation Manager
     */
    openNavigationManager(): void;

    getCoverPageTemplateSettings<Settings>(): Promise<Settings>;

    updateCoverPageTemplateSettings(settings: Record<string, unknown>): Promise<void>;

    getDocumentPageTemplateSettings<Settings>(documentPageId: number): Promise<Settings>;

    updateDocumentPageTemplateSettings(documentPageId: number, settings: Record<string, unknown>): Promise<void>;

    addAssetIdsToCoverPageTemplateAssetKey(key: string, assetIds: number[]): Promise<Record<string, Asset[]>>;

    getCoverPageTemplateAssets(): Promise<Record<string, Asset[]>>;

    deleteAssetIdsFromCoverPageTemplateAssetKey(key: string, assetIds: number[]): Promise<void>;

    addAssetIdsToLibraryPageTemplateAssetKey(
        documentId: number,
        key: string,
        assetIds: number[],
    ): Promise<Record<string, Asset[]>>;

    getLibraryPageTemplateAssets(documentId: number): Promise<Record<string, Asset[]>>;

    deleteAssetIdsFromLibraryPageTemplateAssetKey(documentId: number, key: string, assetIds: number[]): Promise<void>;

    addAssetIdsToDocumentPageTemplateAssetKey(
        documentPageId: number,
        key: string,
        assetIds: number[],
    ): Promise<Record<string, Asset[]>>;

    getDocumentPageTemplateAssets(documentPageId: number): Promise<Record<string, Asset[]>>;

    deleteAssetIdsFromDocumentPageTemplateAssetKey(
        documentPageId: number,
        key: string,
        assetIds: number[],
    ): Promise<void>;

    getLibraryPageTemplateSettings<Settings>(documentId: number): Promise<Settings>;

    updateLibraryPageTemplateSettings(documentId: number, settings: Record<string, unknown>): Promise<void>;

    createLink(link: DocumentLinkCreate): Promise<Document>;

    updateLink(link: DocumentLinkUpdate): Promise<Document>;

    deleteLink(documentId: number): Promise<void>;

    createLibrary(library: DocumentLibraryCreate): Promise<Document>;

    updateLibrary(library: DocumentLibraryUpdate): Promise<Document>;

    deleteLibrary(documentId: number): Promise<void>;

    createStandardDocument(document: DocumentStandardCreate): Promise<Document>;

    updateStandardDocument(document: DocumentStandardUpdate): Promise<Document>;

    deleteStandardDocument(id: number): Promise<void>;

    moveDocument(documentId: number, position: number, newDocumentGroupId?: number): Promise<Document>;

    createDocumentGroup(documentGroup: DocumentGroupCreate): Promise<DocumentGroup>;

    updateDocumentGroup(documentGroup: DocumentGroupUpdate): Promise<DocumentGroup>;

    deleteDocumentGroup(documentGroupId: number): Promise<void>;

    moveDocumentGroup(documentGroupId: number, position: number): Promise<DocumentGroup>;

    createDocumentCategory(category: DocumentCategoryCreate): Promise<DocumentCategory>;

    updateDocumentCategory(category: DocumentCategoryUpdate): Promise<DocumentCategory>;

    deleteDocumentCategory(documentCategoryId: number): Promise<void>;

    moveDocumentCategory(documentCategoryId: number, documentId: number, position: number): Promise<void>;

    createDocumentPage(documentPage: DocumentPageCreate): Promise<DocumentPage>;

    /**
     * A method for page update
     *
     * @param documentPage - {@link DocumentPageUpdate} object
     * @requires id - Indicates page identifier.
     *
     *
     * and at least one of
     *
     * @property  title - Indicates title of a page.
     * @property  documentId - Indicates to witch document the page belongs to.
     * @property  categoryId - Indicates to witch category the page belongs to.
     * @property  visibility - Indicates whether the page is visible only to the editor or everyone.
     * @property  linkUrl - Indicates whether the page is link or not.
     */
    updateDocumentPage(documentPage: DocumentPageUpdate): Promise<DocumentPage>;

    deleteDocumentPage(documentPageId: number): Promise<void>;

    moveDocumentPage(
        documentPageId: number,
        documentId: number,
        position?: number,
        documentCategoryId?: number,
    ): Promise<DocumentPage>;

    duplicateDocumentPage(documentPageId: number): Promise<DocumentPageDuplicate>;

    createCoverPage(coverPage: CoverPageCreate): Promise<CoverPage>;

    updateCoverPage(coverPage: CoverPageUpdate): Promise<CoverPage>;

    /**
     * @deprecated legacy method, should be removed once new endpoint is available
     */
    updateLegacyCoverPage(coverPage: CoverPageUpdateLegacy): Promise<CoverPageUpdateLegacy>;

    deleteCoverPage(): Promise<void>;

    updateBrandportalLink(brandportalLink: Partial<BrandportalLink>): Promise<Partial<BrandportalLink> | null>;

    getCoverPage(): Promise<CoverPage>;

    getBrandportalLink(): Promise<BrandportalLink>;

    getUngroupedDocuments(): Promise<Document[]>;

    updateDocumentTargets(targetIds: number[], documentIds: number[]): Promise<TargetsUpdate>;

    updateDocumentPageTargets(targetIds: number[], documentPageIds: number[]): Promise<TargetsUpdate>;

    /**
     * Search in the current Guideline for a given query.
     * @param query - The query to search for.
     * @param order - The order in which the results should be returned. Defaults to 'relevance'.
     */
    searchInGuideline(query: string, order?: 'relevance' | 'newest' | 'oldest'): Promise<GuidelineSearchResult[]>;
}
