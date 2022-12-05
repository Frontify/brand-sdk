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
import { BrandportalLink } from './types/BrandportalLink';

export class AppBridgeTheme {
    constructor(private readonly portalId: number) {}

    public async createLink(link: CreateDocumentLink) {
        try {
            return await createDocument<DocumentLink>(link as DocumentLink);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async updateLink(link: UpdateDocumentLink) {
        try {
            return await updateDocument<DocumentLink>(link as DocumentLink);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async deleteLink(id: number) {
        try {
            return await deleteDocument(id);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async createLibrary(library: CreateDocumentLibrary) {
        try {
            return await createDocument<DocumentLibrary>(library as DocumentLibrary);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async updateLibrary(library: UpdateDocumentLibrary) {
        try {
            return await updateDocument<DocumentLibrary>(library as DocumentLibrary);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async deleteLibrary(id: number) {
        try {
            return await deleteDocument(id);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async createStandardDocument(document: CreateDocumentStandard) {
        try {
            return await createDocument<Document>(document as Document);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async updateStandardDocument(document: UpdateDocumentStandard) {
        try {
            return await updateDocument<Document>(document as Document);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async deleteStandardDocument(id: number) {
        try {
            return await deleteDocument(id);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async createDocumentGroup(documentGroup: CreateDocumentGroup) {
        try {
            return await createDocumentGroup(documentGroup as DocumentGroup);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async updateDocumentGroup(documentGroup: UpdateDocumentGroup) {
        try {
            return await updateDocumentGroup(documentGroup as DocumentGroup);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async deleteDocumentGroup(id: number) {
        try {
            return await deleteDocumentGroup(id);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async createDocumentPage(documentPage: CreateDocumentPage) {
        try {
            return await createDocumentPage(documentPage as DocumentPage);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async updateDocumentPage(documentPage: UpdateDocumentPage) {
        try {
            return await updateDocumentPage(documentPage as DocumentPage);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async deleteDocumentPage(id: number) {
        try {
            return await deleteDocumentPage(id);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async createCoverPage(coverPage: CoverPageCreate) {
        try {
            return await createCoverPage(coverPage as CoverPage);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async updateCoverPage(coverPage: CoverPage) {
        try {
            return await updateCoverPage(coverPage as CoverPage);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    /**
     * @deprecated legacy method, should be removed once new endpoint is available
     */
    public async publishCoverPage(coverPage: { brandhome_draft: boolean }) {
        try {
            return await publishCoverPage({ ...coverPage, portalId: this.getPortalId() });
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async deleteCoverPage() {
        try {
            return await deleteCoverPage(this.getPortalId());
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async updateBrandportalLink(brandportalLink: Partial<BrandportalLink>) {
        try {
            return await updateBrandportalLink({ ...brandportalLink, portalId: this.getPortalId() });
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
}
