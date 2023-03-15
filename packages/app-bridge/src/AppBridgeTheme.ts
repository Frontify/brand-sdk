/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    createCoverPage,
    createDocument,
    createDocumentCategory,
    createDocumentGroup,
    createDocumentPage,
    createProject,
    deleteCoverPage,
    deleteDocument,
    deleteDocumentCategory,
    deleteDocumentGroup,
    deleteDocumentPage,
    duplicateDocumentPage,
    getAllDocumentsByProjectId,
    getBrandportalLink,
    getColorPalettesByProjectId,
    getColorsByColorPaletteId,
    getCoverPage,
    getDocumentAppearance,
    getDocumentCategoriesByDocumentId,
    getDocumentGroupsByPortalId,
    getDocumentPageTargets,
    getDocumentPagesByDocumentId,
    getDocumentSectionsByDocumentPageId,
    getDocumentTargets,
    getHub,
    getUncategorizedPagesByDocumentId,
    getUngroupedDocumentsByProjectId,
    moveDocument,
    moveDocumentCategory,
    moveDocumentGroup,
    moveDocumentPage,
    moveDocumentPageBetweenDocuments,
    updateBrandportalLink,
    updateCoverPage,
    updateDocument,
    updateDocumentCategory,
    updateDocumentGroup,
    updateDocumentPage,
    updateDocumentPageTargets,
    updateDocumentTargets,
    updateHub,
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
    DocumentPageTargets,
    DocumentPageUpdate,
    DocumentSection,
    DocumentStandardCreate,
    DocumentStandardUpdate,
    DocumentTargets,
    LinkType,
    ProjectCreate,
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

    public getBrandId(): number {
        return window.application.sandbox.config.context.brand.id;
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

    public async getCoverPageSettings<Settings>(): Promise<Settings> {
        return getHub(this.getPortalId()) as Settings;
    }

    public async updateCoverPageSettings(settings: Record<string, unknown>): Promise<void> {
        await updateHub(this.getPortalId(), { ...settings });
    }

    public async getDocumentSettings<Settings>(documentId: number): Promise<Settings> {
        return getDocumentAppearance(documentId) as Settings;
    }

    public async createLink(link: DocumentLinkCreate) {
        return createDocument<DocumentLink>({
            ...link,
            linkType: LinkType.External,
            portalId: this.getPortalId(),
        } as DocumentLink);
    }

    public async updateLink(link: DocumentLinkUpdate) {
        return updateDocument<DocumentLink>(link as DocumentLink, this.getTranslationLanguage());
    }

    public async deleteLink(id: number) {
        return deleteDocument(id);
    }

    public async createLibrary(library: DocumentLibraryCreate) {
        const projectId = library.settings?.project ?? (await this.createProjectIdForLibrary(library));

        return createDocument<DocumentLibrary>({
            ...library,
            portalId: this.getPortalId(),
            settings: { project: projectId },
        } as DocumentLibrary);
    }

    private async createProjectIdForLibrary(library: DocumentLibraryCreate) {
        const createdProject = await this.createProject({
            projectType: library.mode,
            name: library.title,
            styleguide: this.getProjectId(),
            brand: this.getBrandId(),
        });

        return createdProject.id;
    }

    private async createProject(project: ProjectCreate) {
        return createProject(project);
    }

    public async updateLibrary(library: DocumentLibraryUpdate) {
        return updateDocument<DocumentLibrary>(library as DocumentLibrary, this.getTranslationLanguage());
    }

    public async deleteLibrary(id: number) {
        return deleteDocument(id);
    }

    public async createStandardDocument(document: DocumentStandardCreate) {
        return createDocument<Document>({ ...document, portalId: this.getPortalId() } as Document);
    }

    public async updateStandardDocument(document: DocumentStandardUpdate) {
        return updateDocument<Document>(document as Document, this.getTranslationLanguage());
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
        return updateDocumentGroup(documentGroup as DocumentGroup, this.getTranslationLanguage());
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
        return updateDocumentCategory(category as DocumentCategory, this.getTranslationLanguage());
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
        return updateDocumentPage(
            {
                ...documentPage,
                ...(documentPage.linkUrl && { linkType: LinkType.External }),
            } as DocumentPage,
            this.getTranslationLanguage(),
        );
    }

    public async deleteDocumentPage(id: number) {
        return deleteDocumentPage(id);
    }

    public async moveDocumentPage(id: number, documentId: number, position: number, category?: number) {
        return moveDocumentPage(id, documentId, position, category);
    }

    public async moveDocumentPageBetweenDocuments(id: number, sourceDocumentId: number, targetDocumentId: number) {
        return moveDocumentPageBetweenDocuments(id, sourceDocumentId, targetDocumentId);
    }

    public async duplicateDocumentPage(id: number) {
        return duplicateDocumentPage(id);
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
        return getUngroupedDocumentsByProjectId(this.getPortalId(), this.getTranslationLanguage());
    }

    public getAllDocuments(): Promise<Document[]> {
        return getAllDocumentsByProjectId(this.getPortalId(), this.getTranslationLanguage());
    }

    public getDocumentGroups(): Promise<DocumentGroup[]> {
        return getDocumentGroupsByPortalId(this.getPortalId(), this.getTranslationLanguage());
    }

    public getDocumentPagesByDocumentId(documentId: number): Promise<DocumentPage[]> {
        return getDocumentPagesByDocumentId(documentId, this.getTranslationLanguage());
    }

    public getDocumentCategoriesByDocumentId(documentId: number): Promise<DocumentCategory[]> {
        return getDocumentCategoriesByDocumentId(documentId, this.getTranslationLanguage());
    }

    public getUncategorizedPagesByDocumentId(documentId: number): Promise<DocumentPage[]> {
        return getUncategorizedPagesByDocumentId(documentId, this.getTranslationLanguage());
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

    public async getDocumentTargets(documentId: number): Promise<DocumentTargets> {
        return getDocumentTargets(documentId);
    }

    public async updateDocumentTargets(targetIds: number[], documentIds: number[]): Promise<TargetsUpdate> {
        return updateDocumentTargets(targetIds, documentIds);
    }

    public async getDocumentPageTargets(documentPageId: number): Promise<DocumentPageTargets> {
        return getDocumentPageTargets(documentPageId);
    }

    public async updateDocumentPageTargets(targetIds: number[], documentPageIds: number[]): Promise<TargetsUpdate> {
        return updateDocumentPageTargets(targetIds, documentPageIds);
    }
}
