/* (c) Copyright Frontify Ltd., all rights reserved. */

import { RequireAtLeastOne } from 'type-fest';
import {
    createCoverPage,
    createDocument,
    createDocumentCategory,
    createDocumentGroup,
    createDocumentPage,
    deleteCoverPage,
    deleteDocument,
    deleteDocumentCategory,
    deleteDocumentGroup,
    deleteDocumentPage,
    getBrandportalLink,
    getColorPalettesByProjectId,
    getColorsByColorPaletteId,
    getCoverPage,
    getDocumentCategoriesByDocumentId,
    getDocumentGroupsByPortalId,
    getDocumentPagesByDocumentId,
    getDocumentSectionsByDocumentPageId,
    getDocumentsWithoutDocumentGroupByProjectId,
    getUncategorizedPagesByDocumentId,
    updateBrandportalLink,
    updateCoverPage,
    updateDocument,
    updateDocumentCategory,
    updateDocumentGroup,
    updateDocumentPage,
    updateLegacyCoverPage,
} from './repositories';

import {
    BrandportalLink,
    Color,
    ColorPalette,
    CoverPage,
    CoverPageRequestCreate,
    CoverPageUpdateLegacy,
    Document,
    DocumentCategory,
    DocumentCategoryRequest,
    DocumentGroup,
    DocumentGroupRequest,
    DocumentLibrary,
    DocumentLibraryRequestCreate,
    DocumentLibraryRequestUpdate,
    DocumentLink,
    DocumentLinkRequest,
    DocumentLinkRequestUpdate,
    DocumentPage,
    DocumentPageRequestCreate,
    DocumentPageRequestUpdate,
    DocumentSection,
    DocumentStandardRequest,
    LinkType,
} from './types';
import { getDatasetByElement } from './utilities';

export class AppBridgeTheme {
    constructor(private readonly portalId: number) {}

    public getPortalId(): number {
        return this.portalId;
    }

    public getProjectId(): number {
        return window.application.sandbox.config.context.project.id;
    }

    public getEditorState(): boolean {
        return document.querySelector('.js-co-powerbar__sg-edit.state-active') !== null;
    }

    public openNavigationManager() {
        window.emitter.emit('OpenNavigationManager');
    }

    public getTranslationLanguage(): string {
        return getDatasetByElement<{ translationLanguage?: string }>(document.body).translationLanguage ?? '';
    }

    public async createLink(link: Omit<DocumentLinkRequest, 'id'>) {
        return createDocument<DocumentLink>({
            ...link,
            linkType: LinkType.External,
            portalId: this.getPortalId(),
        } as DocumentLink);
    }

    public async updateLink(link: DocumentLinkRequestUpdate) {
        return updateDocument<DocumentLink>(link as DocumentLink);
    }

    public async deleteLink(id: number) {
        return deleteDocument(id);
    }

    public async createLibrary(library: DocumentLibraryRequestCreate) {
        return createDocument<DocumentLibrary>({
            ...library,
            portalId: this.getPortalId(),
            settings: { project: library.settings?.project ?? this.getProjectId() },
        } as DocumentLibrary);
    }

    public async updateLibrary(library: DocumentLibraryRequestUpdate) {
        return updateDocument<DocumentLibrary>(library as DocumentLibrary);
    }

    public async deleteLibrary(id: number) {
        return deleteDocument(id);
    }

    public async createStandardDocument(document: Omit<DocumentStandardRequest, 'id'>) {
        try {
            return createDocument<Document>({ ...document, portalId: this.getPortalId() } as Document);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async updateStandardDocument(
        document: RequireAtLeastOne<DocumentStandardRequest, 'documentGroupId' | 'title'>,
    ) {
        return updateDocument<Document>(document as Document);
    }

    public async deleteStandardDocument(id: number) {
        return deleteDocument(id);
    }

    public async createDocumentGroup(documentGroup: Omit<DocumentGroupRequest, 'id'>) {
        return createDocumentGroup({ ...documentGroup, portalId: this.getPortalId() } as DocumentGroup);
    }

    public async updateDocumentGroup(documentGroup: DocumentGroupRequest) {
        return updateDocumentGroup(documentGroup as DocumentGroup);
    }

    public async deleteDocumentGroup(id: number) {
        return deleteDocumentGroup(id);
    }

    public async createDocumentCategory(category: Omit<DocumentCategoryRequest, 'id'>) {
        return createDocumentCategory(category as DocumentCategory);
    }

    public async updateDocumentCategory(category: RequireAtLeastOne<DocumentCategoryRequest, 'title' | 'documentId'>) {
        return updateDocumentCategory(category as DocumentCategory);
    }

    public async deleteDocumentCategory(id: number) {
        return deleteDocumentCategory(id);
    }

    public async createDocumentPage(documentPage: DocumentPageRequestCreate) {
        return createDocumentPage({
            ...documentPage,
            ...(documentPage.linkUrl && { linkType: LinkType.External }),
        } as DocumentPage);
    }

    /**
     * A method for page update
     *
     * @param documentPage - {@link DocumentPageRequestUpdate} object
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
    public async updateDocumentPage(documentPage: DocumentPageRequestUpdate) {
        return updateDocumentPage({
            ...documentPage,
            ...(documentPage.linkUrl && { linkType: LinkType.External }),
        } as DocumentPage);
    }

    public async deleteDocumentPage(id: number) {
        return deleteDocumentPage(id);
    }

    public async createCoverPage(coverPage: CoverPageRequestCreate) {
        return createCoverPage(coverPage as CoverPage);
    }

    public async updateCoverPage(coverPage: RequireOnlyOne<CoverPage, 'id'>) {
        return updateCoverPage(coverPage as CoverPage);
    }

    /**
     * @deprecated legacy method, should be removed once new endpoint is available
     */
    public async updateLegacyCoverPage(coverPage: CoverPageUpdateLegacy) {
        return updateLegacyCoverPage({ ...coverPage, portalId: this.getPortalId() });
    }

    public async deleteCoverPage() {
        return deleteCoverPage(this.getPortalId());
    }

    public async updateBrandportalLink(brandportalLink: Partial<BrandportalLink>) {
        return updateBrandportalLink({
            ...brandportalLink,
            portalId: this.getPortalId(),
            i18n: this.getTranslationLanguage(),
        });
    }

    public getCoverPage(): Promise<CoverPage> {
        return getCoverPage(this.getPortalId());
    }

    public getBrandportalLink(): Promise<BrandportalLink> {
        return getBrandportalLink(this.getPortalId());
    }

    public getDocumentsWithoutDocumentGroups(): Promise<Document[]> {
        return getDocumentsWithoutDocumentGroupByProjectId(this.getPortalId());
    }

    public getDocumentGroups(): Promise<DocumentGroup[]> {
        return getDocumentGroupsByPortalId(this.getPortalId());
    }

    public getDocumentPagesByDocumentId(documentId: number): Promise<DocumentPage[]> {
        return getDocumentPagesByDocumentId(documentId);
    }

    public getDocumentCategoriesByDocumentId(documentId: number): Promise<DocumentCategory[]> {
        return getDocumentCategoriesByDocumentId(documentId);
    }

    public getUncategorizedPagesByDocumentId(documentId: number): Promise<DocumentPage[]> {
        return getUncategorizedPagesByDocumentId(documentId);
    }

    public getDocumentSectionsByDocumentPageId(documentPageId: number): Promise<DocumentSection[]> {
        return getDocumentSectionsByDocumentPageId(documentPageId);
    }

    public async getColorPalettes(): Promise<ColorPalette[]> {
        return getColorPalettesByProjectId(this.getProjectId());
    }

    public async getColorsByColorPaletteId(colorPaletteId: number): Promise<Color[]> {
        return getColorsByColorPaletteId(colorPaletteId);
    }
}
