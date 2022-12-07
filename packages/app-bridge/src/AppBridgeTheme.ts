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

import type {
    BrandportalLink,
    Color,
    ColorPalette,
    CoverPage,
    CoverPageCreate,
    CoverPageUpdateLegacy,
    CreateDocumentCategory,
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
    UpdateDocumentCategory,
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

    public async createDocumentCategory(category: CreateDocumentCategory) {
        try {
            return createDocumentCategory(category as DocumentCategory);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async updateDocumentCategory(category: UpdateDocumentCategory) {
        try {
            return updateDocumentCategory(category);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async deleteDocumentCategory(id: number) {
        try {
            return deleteDocumentCategory(id);
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
    public async updateLegacyCoverPage(coverPage: CoverPageUpdateLegacy) {
        try {
            return updateLegacyCoverPage({ ...coverPage, portalId: this.getPortalId() });
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

    public getTranslationLanguage(): string {
        return getDatasetByElement<{ translationLanguage?: string }>(document.body).translationLanguage ?? '';
    }
}
