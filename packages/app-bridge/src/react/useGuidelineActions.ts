/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback } from 'react';

import type { AppBridgeTheme } from '../AppBridgeTheme';
import type {
    BrandportalLink,
    CoverPage,
    CoverPageCreate,
    CoverPageUpdate,
    CoverPageUpdateLegacy,
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
    DocumentPageCreate,
    DocumentPageUpdate,
    DocumentStandardCreate,
    DocumentStandardUpdate,
} from '../types';

export const useGuidelineActions = (appBridge: AppBridgeTheme) => {
    const createLink = useCallback(
        async (link: DocumentLinkCreate) => {
            const result = await appBridge.createLink(link);

            window.emitter.emit('AppBridge:GuidelineLinkAction', {
                link: { ...result, documentGroupId: link.documentGroupId },
                action: 'add',
            });
        },
        [appBridge],
    );

    const updateLink = useCallback(
        async (link: DocumentLinkUpdate) => {
            const result = await appBridge.updateLink(link);

            window.emitter.emit('AppBridge:GuidelineLinkAction', {
                link: { ...result, documentGroupId: link.documentGroupId },
                action: 'update',
            });
        },
        [appBridge],
    );

    const deleteLink = useCallback(
        async (id: number) => {
            await appBridge.deleteLink(id);

            window.emitter.emit('AppBridge:GuidelineLinkAction', {
                link: { id },
                action: 'delete',
            });
        },
        [appBridge],
    );

    const createLibrary = useCallback(
        async (library: DocumentLibraryCreate) => {
            const result = await appBridge.createLibrary(library);

            window.emitter.emit('AppBridge:GuidelineLibraryAction', {
                library: { ...result, documentGroupId: library.documentGroupId },
                action: 'add',
            });
        },
        [appBridge],
    );

    const updateLibrary = useCallback(
        async (library: DocumentLibraryUpdate) => {
            const result = await appBridge.updateLibrary(library);

            window.emitter.emit('AppBridge:GuidelineLibraryAction', {
                library: { ...result, documentGroupId: library.documentGroupId },
                action: 'update',
            });
        },
        [appBridge],
    );

    const deleteLibrary = useCallback(
        async (id: number) => {
            await appBridge.deleteLibrary(id);

            window.emitter.emit('AppBridge:GuidelineLibraryAction', {
                library: { id },
                action: 'delete',
            });
        },
        [appBridge],
    );

    const createStandardDocument = useCallback(
        async (document: DocumentStandardCreate) => {
            const result = await appBridge.createStandardDocument(document);

            window.emitter.emit('AppBridge:GuidelineStandardDocumentAction', {
                standardDocument: { ...result, documentGroupId: document.documentGroupId },
                action: 'add',
            });
        },
        [appBridge],
    );

    const updateStandardDocument = useCallback(
        async (document: DocumentStandardUpdate) => {
            const result = await appBridge.updateStandardDocument(document);

            window.emitter.emit('AppBridge:GuidelineStandardDocumentAction', {
                standardDocument: { ...result, documentGroupId: document.documentGroupId },
                action: 'update',
            });
        },
        [appBridge],
    );

    const deleteStandardDocument = useCallback(
        async (id: number) => {
            await appBridge.deleteStandardDocument(id);

            window.emitter.emit('AppBridge:GuidelineStandardDocumentAction', {
                standardDocument: { id },
                action: 'delete',
            });
        },
        [appBridge],
    );

    const createDocumentGroup = useCallback(
        async (documentGroup: DocumentGroupCreate) => {
            const result = await appBridge.createDocumentGroup(documentGroup);

            window.emitter.emit('AppBridge:GuidelineDocumentGroupAction', {
                documentGroup: result,
                action: 'add',
            });
        },
        [appBridge],
    );

    const updateDocumentGroup = useCallback(
        async (documentGroup: DocumentGroupUpdate) => {
            // we are not passing documents as BE does not return them
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { documents, ...restOfDocumentGroup } = await appBridge.updateDocumentGroup(documentGroup);

            window.emitter.emit('AppBridge:GuidelineDocumentGroupAction', {
                documentGroup: restOfDocumentGroup as DocumentGroup,
                action: 'update',
            });
        },
        [appBridge],
    );

    const deleteDocumentGroup = useCallback(
        async (id: number) => {
            await appBridge.deleteDocumentGroup(id);

            window.emitter.emit('AppBridge:GuidelineDocumentGroupAction', {
                documentGroup: { id },
                action: 'delete',
            });
        },
        [appBridge],
    );

    const createPage = useCallback(
        async (documentPage: DocumentPageCreate) => {
            const result = await appBridge.createDocumentPage(documentPage);

            window.emitter.emit('AppBridge:GuidelineDocumentPageAction', {
                documentPage: result,
                action: 'add',
            });
        },
        [appBridge],
    );

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
    const updatePage = useCallback(
        async (documentPage: DocumentPageUpdate) => {
            const result = await appBridge.updateDocumentPage(documentPage);

            window.emitter.emit('AppBridge:GuidelineDocumentPageAction', {
                documentPage: result,
                action: 'update',
            });
        },
        [appBridge],
    );

    const deletePage = useCallback(
        async (id: number) => {
            await appBridge.deleteDocumentPage(id);

            window.emitter.emit('AppBridge:GuidelineDocumentPageAction', {
                documentPage: { id },
                action: 'delete',
            });
        },
        [appBridge],
    );

    const createCategory = useCallback(
        async (category: DocumentCategoryCreate) => {
            const result = await appBridge.createDocumentCategory(category);

            window.emitter.emit('AppBridge:GuidelineDocumentCategoryAction', {
                documentCategory: result,
                action: 'add',
            });
        },
        [appBridge],
    );

    const updateCategory = useCallback(
        async (category: DocumentCategoryUpdate) => {
            // documentPages are not passed as BE does not return them
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { documentPages, ...restOfCategory } = await appBridge.updateDocumentCategory(category);

            window.emitter.emit('AppBridge:GuidelineDocumentCategoryAction', {
                documentCategory: restOfCategory as DocumentCategory,
                action: 'update',
            });
        },
        [appBridge],
    );

    const deleteCategory = useCallback(
        async (id: number) => {
            await appBridge.deleteDocumentCategory(id);

            window.emitter.emit('AppBridge:GuidelineDocumentCategoryAction', {
                documentCategory: { id },
                action: 'delete',
            });
        },
        [appBridge],
    );

    const createCoverPage = useCallback(
        async (coverPage: CoverPageCreate) => {
            const result = await appBridge.createCoverPage(coverPage);

            window.emitter.emit('AppBridge:GuidelineCoverPageAction', {
                coverPage: result,
                action: 'add',
            });
        },
        [appBridge],
    );

    const updateCoverPage = useCallback(
        async (coverPage: CoverPageUpdate) => {
            const result = await appBridge.updateCoverPage(coverPage);

            window.emitter.emit('AppBridge:GuidelineCoverPageAction', {
                coverPage: result,
                action: 'update',
            });
        },
        [appBridge],
    );

    /**
     * @deprecated legacy method, should be removed once new endpoint is available
     */
    const updateLegacyCoverPage = useCallback(
        async (coverPage: Partial<CoverPage>) => {
            const legacyCoverPage: CoverPageUpdateLegacy = {
                ...(coverPage.title && { brandhome_title: coverPage.title }),
                ...(coverPage.draft !== undefined && { brandhome_draft: coverPage.draft }),
                ...(coverPage.hideInNav !== undefined && { brandhome_hide_in_nav: coverPage.hideInNav }),
            };

            await appBridge.updateLegacyCoverPage(legacyCoverPage);

            window.emitter.emit('AppBridge:GuidelineCoverPageAction', {
                coverPage: coverPage as CoverPage,
                action: 'update',
            });
        },
        [appBridge],
    );

    const deleteCoverPage = useCallback(async () => {
        await appBridge.deleteCoverPage();

        window.emitter.emit('AppBridge:GuidelineCoverPageAction', {
            action: 'delete',
        });
    }, [appBridge]);

    const updateBrandportalLink = useCallback(
        async (brandportalLink: Partial<BrandportalLink>) => {
            const result = await appBridge.updateBrandportalLink(brandportalLink);

            if (result) {
                window.emitter.emit('AppBridge:GuidelineBrandportalLinkAction', {
                    brandportalLink: result as BrandportalLink,
                    action: 'update',
                });
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
