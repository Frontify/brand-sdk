/* (c) Copyright Frontify Ltd., all rights reserved. */

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
    getAllDocumentsByProjectId,
    getBrandportalLink,
    getColorPalettesByProjectId,
    getColorsByColorPaletteId,
    getCoverPage,
    getDocumentCategoriesByDocumentId,
    getDocumentGroupsByPortalId,
    getDocumentPageTargets,
    getDocumentPagesByDocumentId,
    getDocumentSectionsByDocumentPageId,
    getDocumentTargets,
    getUncategorizedPagesByDocumentId,
    getUngroupedDocumentsByProjectId,
    moveDocument,
    moveDocumentCategory,
    moveDocumentGroup,
    moveDocumentPage,
    updateBrandportalLink,
    updateCoverPage,
    updateDocument,
    updateDocumentCategory,
    updateDocumentGroup,
    updateDocumentPage,
    updateDocumentPageTargets,
    updateDocumentTargets,
    updateLegacyCoverPage,
} from './repositories';

import {
    BrandportalLink,
    Color,
    ColorPalette,
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
    DocumentLibrary,
    DocumentLibraryCreate,
    DocumentLibraryUpdate,
    DocumentLink,
    DocumentLinkCreate,
    DocumentLinkUpdate,
    DocumentPage,
    DocumentPageCreate,
    DocumentPageUpdate,
    DocumentSection,
    DocumentStandardCreate,
    DocumentStandardUpdate,
    LinkType,
    Targets,
    TargetsUpdate,
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
        window.emitter.emit('AppBridge:OpenNavigationManager');
    }

    public getTranslationLanguage(): string {
        return getDatasetByElement<{ translationLanguage?: string }>(document.body).translationLanguage ?? '';
    }

    public async createLink(link: DocumentLinkCreate) {
        return createDocument<DocumentLink>({
            ...link,
            linkType: LinkType.External,
            portalId: this.getPortalId(),
        } as DocumentLink);
    }

    public async updateLink(link: DocumentLinkUpdate) {
        return updateDocument<DocumentLink>(link as DocumentLink);
    }

    public async deleteLink(id: number) {
        return deleteDocument(id);
    }

    public async createLibrary(library: DocumentLibraryCreate) {
        return createDocument<DocumentLibrary>({
            ...library,
            portalId: this.getPortalId(),
            settings: { project: library.settings?.project ?? this.getProjectId() },
        } as DocumentLibrary);
    }

    public async updateLibrary(library: DocumentLibraryUpdate) {
        return updateDocument<DocumentLibrary>(library as DocumentLibrary);
    }

    public async deleteLibrary(id: number) {
        return deleteDocument(id);
    }

    public async createStandardDocument(document: DocumentStandardCreate) {
        return createDocument<Document>({ ...document, portalId: this.getPortalId() } as Document);
    }

    public async updateStandardDocument(document: DocumentStandardUpdate) {
        return updateDocument<Document>(document as Document);
    }

    public async deleteStandardDocument(id: number) {
        return deleteDocument(id);
    }

    public async moveDocument(id: number, position: number, newGroupId?: number, oldGroupId?: number) {
        return moveDocument(id, this.getPortalId(), position, newGroupId, oldGroupId);
    }

    public async createDocumentGroup(documentGroup: DocumentGroupCreate) {
        return createDocumentGroup({ ...documentGroup, portalId: this.getPortalId() } as DocumentGroup);
    }

    public async updateDocumentGroup(documentGroup: DocumentGroupUpdate) {
        return updateDocumentGroup(documentGroup as DocumentGroup);
    }

    public async deleteDocumentGroup(id: number) {
        return deleteDocumentGroup(id);
    }

    public async moveDocumentGroup(id: number, position: number) {
        return moveDocumentGroup(id, this.getPortalId(), position);
    }

    public async createDocumentCategory(category: DocumentCategoryCreate) {
        return createDocumentCategory(category as DocumentCategory);
    }

    public async updateDocumentCategory(category: DocumentCategoryUpdate) {
        return updateDocumentCategory(category as DocumentCategory);
    }

    public async deleteDocumentCategory(id: number) {
        return deleteDocumentCategory(id);
    }

    public async moveDocumentCategory(id: number, documentId: number, position: number) {
        return moveDocumentCategory(id, documentId, position);
    }

    public async createDocumentPage(documentPage: DocumentPageCreate) {
        return createDocumentPage({
            ...documentPage,
            ...(documentPage.linkUrl && { linkType: LinkType.External }),
        } as DocumentPage);
    }

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
    public async updateDocumentPage(documentPage: DocumentPageUpdate) {
        return updateDocumentPage({
            ...documentPage,
            ...(documentPage.linkUrl && { linkType: LinkType.External }),
        } as DocumentPage);
    }

    public async deleteDocumentPage(id: number) {
        return deleteDocumentPage(id);
    }

    public async moveDocumentPage(id: number, documentId: number, position: number, category?: number) {
        return moveDocumentPage(id, documentId, position, category);
    }

    public async createCoverPage(coverPage: CoverPageCreate) {
        return createCoverPage(coverPage as CoverPage);
    }

    public async updateCoverPage(coverPage: CoverPageUpdate) {
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

    public getUngroupedDocuments(): Promise<Document[]> {
        return getUngroupedDocumentsByProjectId(this.getPortalId());
    }

    public getAllDocuments(): Promise<Document[]> {
        return getAllDocumentsByProjectId(this.getPortalId());
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

    public async getDocumentTargets(documentId: number): Promise<Targets> {
        return getDocumentTargets(documentId);
    }

    public async updateDocumentTargets(targetIds: number[], documentIds: number[]): Promise<TargetsUpdate> {
        return updateDocumentTargets(targetIds, documentIds);
    }

    public async getDocumentPageTargets(documentPageId: number): Promise<Targets> {
        return getDocumentPageTargets(documentPageId);
    }

    public async updateDocumentPageTargets(targetIds: number[], documentIds: number[]): Promise<TargetsUpdate> {
        return updateDocumentPageTargets(targetIds, documentIds);
    }
}
