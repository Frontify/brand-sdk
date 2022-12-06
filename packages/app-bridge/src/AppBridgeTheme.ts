/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    createCoverPage,
    createDocument,
    createDocumentGroup,
    createDocumentPage,
    createDocumentPageCategory,
    deleteCoverPage,
    deleteDocument,
    deleteDocumentGroup,
    deleteDocumentPage,
    deleteDocumentPageCategory,
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
    updateDocumentPageCategory,
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
    DocumentGroup,
    DocumentLibrary,
    DocumentLink,
    DocumentPage,
    DocumentPageCategory,
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

    public async createLink(link: CreateDocumentLink) {
        try {
            return createDocument<DocumentLink>(link as DocumentLink);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async updateLink(link: UpdateDocumentLink) {
        try {
            return updateDocument<DocumentLink>(link as DocumentLink);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async deleteLink(id: number) {
        try {
            return deleteDocument(id);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async createLibrary(library: CreateDocumentLibrary) {
        try {
            return createDocument<DocumentLibrary>(library as DocumentLibrary);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async updateLibrary(library: UpdateDocumentLibrary) {
        try {
            return updateDocument<DocumentLibrary>(library as DocumentLibrary);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async deleteLibrary(id: number) {
        try {
            return deleteDocument(id);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async createStandardDocument(document: CreateDocumentStandard) {
        try {
            return createDocument<Document>(document as Document);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async updateStandardDocument(document: UpdateDocumentStandard) {
        try {
            return updateDocument<Document>(document as Document);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async deleteStandardDocument(id: number) {
        try {
            return deleteDocument(id);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async createDocumentGroup(documentGroup: CreateDocumentGroup) {
        try {
            return createDocumentGroup(documentGroup as DocumentGroup);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async updateDocumentGroup(documentGroup: UpdateDocumentGroup) {
        try {
            return updateDocumentGroup(documentGroup as DocumentGroup);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async deleteDocumentGroup(id: number) {
        try {
            return deleteDocumentGroup(id);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async createDocumentPage(documentPage: CreateDocumentPage) {
        try {
            return createDocumentPage(documentPage as DocumentPage);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async updateDocumentPage(documentPage: UpdateDocumentPage) {
        try {
            return updateDocumentPage(documentPage as DocumentPage);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async deleteDocumentPage(id: number) {
        try {
            return deleteDocumentPage(id);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async createDocumentPageCategory(category: DocumentPageCategory) {
        try {
            return createDocumentPageCategory(category);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async updateDocumentPageCategory(category: DocumentPageCategory) {
        try {
            return updateDocumentPageCategory(category);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async deleteDocumentPageCategory(id: number) {
        try {
            return deleteDocumentPageCategory(id);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async createCoverPage(coverPage: CoverPageCreate) {
        try {
            return createCoverPage(coverPage as CoverPage);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async updateCoverPage(coverPage: Partial<CoverPage>) {
        try {
            return updateCoverPage(coverPage);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    /**
     * @deprecated legacy method, should be removed once new endpoint is available
     */
    public async publishCoverPage(coverPage: { brandhome_draft: boolean }) {
        try {
            return publishCoverPage({ ...coverPage, portalId: this.getPortalId() });
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async deleteCoverPage() {
        try {
            return deleteCoverPage(this.getPortalId());
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async updateBrandportalLink(brandportalLink: Partial<BrandportalLink>) {
        try {
            return await updateBrandportalLink({
                ...brandportalLink,
                portalId: this.getPortalId(),
                i18n: this.getTranslationLanguage(),
            });
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

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

    public getDocumentCategoriesByDocumentId(documentId: number): Promise<DocumentPageCategory[]> {
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

    public getTranslationLanguage(): string {
        return getDatasetByElement<{ translationLanguage?: string }>(document.body).translationLanguage ?? '';
    }
}
