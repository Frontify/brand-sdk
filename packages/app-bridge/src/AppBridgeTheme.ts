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

import {
    BrandportalLink,
    Color,
    ColorPalette,
    CoverPage,
    CoverPageUpdateLegacy,
    Document,
    DocumentCategory,
    DocumentGroup,
    DocumentLibrary,
    DocumentLink,
    DocumentPage,
    DocumentSection,
    LinkType,
    ValidCoverPage,
    ValidDocumentCategory,
    ValidDocumentGroup,
    ValidDocumentLibrary,
    ValidDocumentLink,
    ValidDocumentPage,
    ValidDocumentStandard,
} from './types';
import { getDatasetByElement } from './utilities';

export class AppBridgeTheme {
    constructor(private readonly portalId: number) {}

    public async createLink(link: Omit<ValidDocumentLink, 'id'>) {
        try {
            return createDocument<DocumentLink>({
                ...link,
                linkType: LinkType.External,
                portalId: this.getPortalId(),
            } as DocumentLink);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async updateLink(link: RequireOnlyOne<ValidDocumentLink, 'id'>) {
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

    public async createLibrary(library: Omit<ValidDocumentLibrary, 'id'>) {
        try {
            return createDocument<DocumentLibrary>({
                ...library,
                portalId: this.getPortalId(),
                settings: { project: library.settings.project ?? this.getProjectId() },
            } as DocumentLibrary);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async updateLibrary(library: RequireOnlyOne<ValidDocumentLibrary, 'id'>) {
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

    public async createStandardDocument(document: Omit<ValidDocumentStandard, 'id'>) {
        try {
            return createDocument<Document>({ ...document, portalId: this.getPortalId() } as Document);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async updateStandardDocument(document: RequireOnlyOne<ValidDocumentStandard, 'id'>) {
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

    public async createDocumentGroup(documentGroup: Omit<ValidDocumentGroup, 'id'>) {
        try {
            return createDocumentGroup({ ...documentGroup, portalId: this.getPortalId() } as DocumentGroup);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async updateDocumentGroup(documentGroup: RequireOnlyOne<ValidDocumentGroup, 'id'>) {
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

    public async createDocumentPage(documentPage: Omit<ValidDocumentPage, 'id'>) {
        try {
            return createDocumentPage(documentPage as DocumentPage);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async updateDocumentPage(documentPage: RequireOnlyOne<ValidDocumentPage, 'id'>) {
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

    public async createDocumentCategory(category: Omit<ValidDocumentCategory, 'id'>) {
        try {
            return createDocumentCategory(category as DocumentCategory);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async updateDocumentCategory(category: RequireOnlyOne<ValidDocumentCategory, 'id'>) {
        try {
            return updateDocumentCategory(category as DocumentCategory);
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

    public async createCoverPage(coverPage: Omit<ValidCoverPage, 'id'>) {
        try {
            return createCoverPage(coverPage as CoverPage);
        } catch (error) {
            throw console.error('Error: ', error);
        }
    }

    public async updateCoverPage(coverPage: RequireOnlyOne<ValidCoverPage, 'id'>) {
        try {
            return updateCoverPage(coverPage as CoverPage);
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
