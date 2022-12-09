/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback } from 'react';
import { RequireAtLeastOne } from 'type-fest';

import { AppBridgeTheme } from '../AppBridgeTheme';
import type {
    BrandportalLink,
    CoverPage,
    CoverPageRequestCreate,
    CoverPageUpdateLegacy,
    Document,
    DocumentCategory,
    DocumentCategoryRequest,
    DocumentGroup,
    DocumentGroupRequest,
    DocumentLibraryRequestCreate,
    DocumentLibraryRequestUpdate,
    DocumentLinkRequest,
    DocumentLinkRequestUpdate,
    DocumentPage,
    DocumentPageRequestCreate,
    DocumentPageRequestUpdate,
    DocumentStandardRequest,
    EmitterAction,
} from '../types';

export const useGuidelineActions = (appBridge: AppBridgeTheme) => {
    const emitDocumentAction = <A extends EmitterAction>(
        document: A extends 'delete' ? { id: number } : Document | DocumentGroup,
        action: A,
    ) => {
        window.emitter.emit('AppBridge:GuidelineDocumentUpdate', {
            document,
            action,
        });
    };

    const emitPageAction = <A extends EmitterAction>(
        page: A extends 'delete' ? { id: number } : DocumentPage | DocumentCategory,
        action: A,
    ) => {
        window.emitter.emit('AppBridge:GuidelineDocumentPageUpdate', {
            page,
            action,
        });
    };

    const emitCoverPageAction = <A extends EmitterAction>(
        coverPage: A extends 'delete' ? undefined : Partial<CoverPage>,
        action: A,
    ) => {
        window.emitter.emit('AppBridge:GuidelineCoverPageUpdate', {
            coverPage,
            action,
        });
    };

    const emitBrandportalLinkAction = <A extends EmitterAction>(
        brandportalLink: Partial<BrandportalLink>,
        action: A,
    ) => {
        window.emitter.emit('AppBridge:GuidelineBrandportalLinkUpdate', {
            brandportalLink,
            action,
        });
    };

    const createLink = useCallback(
        async (link: Omit<DocumentLinkRequest, 'id'>) => {
            const result = await appBridge.createLink(link);

            emitDocumentAction({ ...result, documentGroupId: link.documentGroupId }, 'add');
        },
        [appBridge],
    );

    const updateLink = useCallback(
        async (link: DocumentLinkRequestUpdate) => {
            const result = await appBridge.updateLink(link);

            emitDocumentAction({ ...result, documentGroupId: link.documentGroupId }, 'update');
        },
        [appBridge],
    );

    const deleteLink = useCallback(
        async (id: number) => {
            await appBridge.deleteLink(id);

            emitDocumentAction({ id }, 'delete');
        },
        [appBridge],
    );

    const createLibrary = useCallback(
        async (library: DocumentLibraryRequestCreate) => {
            const result = await appBridge.createLibrary(library);

            emitDocumentAction({ ...result, documentGroupId: library.documentGroupId }, 'add');
        },
        [appBridge],
    );

    const updateLibrary = useCallback(
        async (library: DocumentLibraryRequestUpdate) => {
            const result = await appBridge.updateLibrary(library);

            emitDocumentAction({ ...result, documentGroupId: library.documentGroupId }, 'update');
        },
        [appBridge],
    );

    const deleteLibrary = useCallback(
        async (id: number) => {
            await appBridge.deleteLibrary(id);

            emitDocumentAction({ id }, 'delete');
        },
        [appBridge],
    );

    const createStandardDocument = useCallback(
        async (document: Omit<DocumentStandardRequest, 'id'>) => {
            const result = await appBridge.createStandardDocument(document);

            emitDocumentAction({ ...result, documentGroupId: document.documentGroupId }, 'add');
        },
        [appBridge],
    );

    const updateStandardDocument = useCallback(
        async (document: RequireAtLeastOne<DocumentStandardRequest, 'documentGroupId' | 'title'>) => {
            const result = await appBridge.updateStandardDocument(document);

            emitDocumentAction({ ...result, documentGroupId: document.documentGroupId }, 'update');
        },
        [appBridge],
    );

    const deleteStandardDocument = useCallback(
        async (id: number) => {
            await appBridge.deleteStandardDocument(id);

            emitDocumentAction({ id }, 'delete');
        },
        [appBridge],
    );

    const createDocumentGroup = useCallback(
        async (documentGroup: Omit<DocumentGroupRequest, 'id'>) => {
            const result = await appBridge.createDocumentGroup(documentGroup);

            emitDocumentAction(result, 'add');
        },
        [appBridge],
    );

    const updateDocumentGroup = useCallback(
        async (documentGroup: DocumentGroupRequest) => {
            const result = await appBridge.updateDocumentGroup(documentGroup);

            emitDocumentAction(result, 'update');
        },
        [appBridge],
    );

    const deleteDocumentGroup = useCallback(
        async (id: number) => {
            await appBridge.deleteDocumentGroup(id);

            emitDocumentAction({ id }, 'delete');
        },
        [appBridge],
    );

    const createPage = useCallback(
        async (documentPage: DocumentPageRequestCreate) => {
            const result = await appBridge.createDocumentPage(documentPage);

            emitPageAction(result, 'add');
        },
        [appBridge],
    );

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
    const updatePage = useCallback(
        async (documentPage: DocumentPageRequestUpdate) => {
            const result = await appBridge.updateDocumentPage(documentPage);

            emitPageAction(result, 'update');
        },
        [appBridge],
    );

    const deletePage = useCallback(
        async (id: number) => {
            await appBridge.deleteDocumentPage(id);

            emitPageAction({ id }, 'delete');
        },
        [appBridge],
    );

    const createCategory = useCallback(
        async (category: Omit<DocumentCategoryRequest, 'id'>) => {
            const result = await appBridge.createDocumentCategory(category);

            emitPageAction(result, 'add');
        },
        [appBridge],
    );

    const updateCategory = useCallback(
        async (category: RequireAtLeastOne<DocumentCategoryRequest, 'title' | 'documentId'>) => {
            const result = await appBridge.updateDocumentCategory(category);

            emitPageAction(result, 'update');
        },
        [appBridge],
    );

    const deleteCategory = useCallback(
        async (id: number) => {
            await appBridge.deleteDocumentCategory(id);

            emitPageAction({ id }, 'delete');
        },
        [appBridge],
    );

    const createCoverPage = useCallback(
        async (coverPage: CoverPageRequestCreate) => {
            const result = await appBridge.createCoverPage(coverPage);

            emitCoverPageAction(result, 'add');
        },
        [appBridge],
    );

    const updateCoverPage = useCallback(
        async (coverPage: RequireOnlyOne<CoverPage, 'id'>) => {
            const result = await appBridge.updateCoverPage(coverPage);

            emitCoverPageAction(result, 'update');
        },
        [appBridge],
    );

    /**
     * @deprecated legacy method, should be removed once new endpoint is available
     */
    const updateLegacyCoverPage = useCallback(
        async (coverPage: Partial<CoverPage>) => {
            const legacyCoverPage: CoverPageUpdateLegacy = {
                ...(coverPage.draft && { brandhome_draft: coverPage.draft }),
                ...(coverPage.title && { brandhome_title: coverPage.title }),
                ...(coverPage.hideInNav && { brandhome_hide_in_nav: coverPage.hideInNav }),
            };

            await appBridge.updateLegacyCoverPage(legacyCoverPage);

            emitCoverPageAction(coverPage, 'update');
        },
        [appBridge],
    );

    const deleteCoverPage = useCallback(async () => {
        await appBridge.deleteCoverPage();

        emitCoverPageAction(undefined, 'delete');
    }, [appBridge]);

    const updateBrandportalLink = useCallback(
        async (brandportalLink: Partial<BrandportalLink>) => {
            const result = await appBridge.updateBrandportalLink(brandportalLink);

            if (result) {
                emitBrandportalLinkAction(result, 'update');
            }
        },
        [appBridge],
    );

    return {
        createLink,
        updateLink,
        deleteLink,
        createPage,
        updatePage,
        deletePage,
        createLibrary,
        updateLibrary,
        deleteLibrary,
        createCategory,
        updateCategory,
        deleteCategory,
        createCoverPage,
        updateCoverPage,
        deleteCoverPage,
        updateLegacyCoverPage,
        createDocumentGroup,
        updateDocumentGroup,
        deleteDocumentGroup,
        updateBrandportalLink,
        createDocument: createStandardDocument,
        updateDocument: updateStandardDocument,
        deleteDocument: deleteStandardDocument,
    };
};
