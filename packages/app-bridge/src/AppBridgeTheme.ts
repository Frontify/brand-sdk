/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    createCoverPage,
    createDocument,
    createDocumentGroup,
    createDocumentPage,
    deleteCoverPage,
    deleteDocument,
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
    publishCoverPage,
    updateBrandportalLink,
    updateCoverPage,
    updateDocument,
    updateDocumentGroup,
    updateDocumentPage,
} from './repositories';

import type {
    BrandportalLink,
    Color,
    ColorPalette,
    CoverPage,
    CoverPageCreate,
    CreateDocumentGroup,
    CreateDocumentLibrary,
    CreateDocumentLink,
    CreateDocumentPage,
    CreateDocumentStandard,
    Document,
    DocumentCategory,
    DocumentGroup,
    DocumentLibrary,
    DocumentLink,
    DocumentPage,
    DocumentSection,
    UpdateDocumentGroup,
    UpdateDocumentLibrary,
    UpdateDocumentLink,
    UpdateDocumentPage,
    UpdateDocumentStandard,
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

    public async createLink(link: CreateDocumentLink) {
        return createDocument<DocumentLink>(link as DocumentLink);
    }

    public async updateLink(link: UpdateDocumentLink) {
        return updateDocument<DocumentLink>(link as DocumentLink);
    }

    public async deleteLink(id: number) {
        return deleteDocument(id);
    }

    public async createLibrary(library: CreateDocumentLibrary) {
        return createDocument<DocumentLibrary>(library as DocumentLibrary);
    }

    public async updateLibrary(library: UpdateDocumentLibrary) {
        return updateDocument<DocumentLibrary>(library as DocumentLibrary);
    }

    public async deleteLibrary(id: number) {
        return deleteDocument(id);
    }

    public async createStandardDocument(document: CreateDocumentStandard) {
        return createDocument<Document>(document as Document);
    }

    public async updateStandardDocument(document: UpdateDocumentStandard) {
        return updateDocument<Document>(document as Document);
    }

    public async deleteStandardDocument(id: number) {
        return deleteDocument(id);
    }

    public async createDocumentGroup(documentGroup: CreateDocumentGroup) {
        return createDocumentGroup(documentGroup as DocumentGroup);
    }

    public async updateDocumentGroup(documentGroup: UpdateDocumentGroup) {
        return updateDocumentGroup(documentGroup as DocumentGroup);
    }

    public async deleteDocumentGroup(id: number) {
        return deleteDocumentGroup(id);
    }

    public async createDocumentPage(documentPage: CreateDocumentPage) {
        return createDocumentPage(documentPage as DocumentPage);
    }

    public async updateDocumentPage(documentPage: UpdateDocumentPage) {
        return updateDocumentPage(documentPage as DocumentPage);
    }

    public async deleteDocumentPage(id: number) {
        return deleteDocumentPage(id);
    }

    public async createCoverPage(coverPage: CoverPageCreate) {
        return createCoverPage(coverPage as CoverPage);
    }

    public async updateCoverPage(coverPage: CoverPage) {
        return updateCoverPage(coverPage as CoverPage);
    }

    /**
     * @deprecated legacy method, should be removed once new endpoint is available
     */
    public async publishCoverPage(coverPage: { brandhome_draft: boolean }) {
        return publishCoverPage({ ...coverPage, portalId: this.getPortalId() });
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
