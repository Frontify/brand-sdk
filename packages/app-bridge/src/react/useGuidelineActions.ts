/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback } from 'react';

import type { AppBridgeTheme } from '../AppBridgeTheme';
import type {
    BrandportalLink,
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
    DocumentLibraryCreate,
    DocumentLibraryUpdate,
    DocumentLinkCreate,
    DocumentLinkUpdate,
    DocumentPage,
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
                link: { ...result, ...(link.documentGroupId && { documentGroupId: link.documentGroupId }) },
                action: 'add',
            });

            if (link.documentGroupId) {
                window.emitter.emit('AppBridge:GuidelineDocumentGroupDocumentAction', {
                    document: { id: result.id, documentGroupId: link.documentGroupId },
                    action: 'add',
                });
            }
        },
        [appBridge],
    );

    const updateLink = useCallback(
        async (link: DocumentLinkUpdate) => {
            const result = await appBridge.updateLink(link);

            window.emitter.emit('AppBridge:GuidelineLinkAction', {
                link: { ...result, ...(link.documentGroupId && { documentGroupId: link.documentGroupId }) },
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

            window.emitter.emit('AppBridge:GuidelineDocumentGroupDocumentAction', {
                document: { id },
                action: 'delete',
            });
        },
        [appBridge],
    );

    const createLibrary = useCallback(
        async (library: DocumentLibraryCreate) => {
            const result = await appBridge.createLibrary(library);

            window.emitter.emit('AppBridge:GuidelineLibraryAction', {
                library: {
                    ...result,
                    ...(library.documentGroupId && { documentGroupId: library.documentGroupId }),
                },
                action: 'add',
            });

            if (library.documentGroupId) {
                window.emitter.emit('AppBridge:GuidelineDocumentGroupDocumentAction', {
                    document: { id: result.id, documentGroupId: library.documentGroupId },
                    action: 'add',
                });
            }
        },
        [appBridge],
    );

    const updateLibrary = useCallback(
        async (library: DocumentLibraryUpdate) => {
            const result = await appBridge.updateLibrary(library);

            window.emitter.emit('AppBridge:GuidelineLibraryAction', {
                library: {
                    ...result,
                    ...(library.documentGroupId && { documentGroupId: library.documentGroupId }),
                },
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

            window.emitter.emit('AppBridge:GuidelineDocumentGroupDocumentAction', {
                document: { id },
                action: 'delete',
            });
        },
        [appBridge],
    );

    const createStandardDocument = useCallback(
        async (document: DocumentStandardCreate) => {
            const result = await appBridge.createStandardDocument(document);

            window.emitter.emit('AppBridge:GuidelineStandardDocumentAction', {
                standardDocument: {
                    ...result,
                    ...(document.documentGroupId && { documentGroupId: document.documentGroupId }),
                },
                action: 'add',
            });

            if (document.documentGroupId) {
                window.emitter.emit('AppBridge:GuidelineDocumentGroupDocumentAction', {
                    document: { id: result.id, documentGroupId: document.documentGroupId },
                    action: 'add',
                });
            }
        },
        [appBridge],
    );

    const updateStandardDocument = useCallback(
        async (document: DocumentStandardUpdate) => {
            const result = await appBridge.updateStandardDocument(document);

            window.emitter.emit('AppBridge:GuidelineStandardDocumentAction', {
                standardDocument: {
                    ...result,
                    ...(document.documentGroupId && { documentGroupId: document.documentGroupId }),
                },
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

            window.emitter.emit('AppBridge:GuidelineDocumentGroupDocumentAction', {
                document: { id },
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

            window.emitter.emit(`AppBridge:GuidelineDocumentPageAction:${documentPage.documentId}`, {
                documentPage: result,
                action: 'add',
            });

            if (documentPage.categoryId) {
                window.emitter.emit(`AppBridge:GuidelineDocumentCategoryPageAction:${documentPage.documentId}`, {
                    documentPage: { id: result.id, categoryId: documentPage.categoryId },
                    action: 'add',
                });
            }
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

            window.emitter.emit(`AppBridge:GuidelineDocumentPageAction:${documentPage.documentId}`, {
                documentPage: result,
                action: 'update',
            });
        },
        [appBridge],
    );

    const deletePage = useCallback(
        async ({ id, documentId }: { id: number; documentId: number }) => {
            await appBridge.deleteDocumentPage(id);

            window.emitter.emit(`AppBridge:GuidelineDocumentPageAction:${documentId}`, {
                documentPage: { id },
                action: 'delete',
            });

            window.emitter.emit(`AppBridge:GuidelineDocumentCategoryPageAction:${documentId}`, {
                documentPage: { id },
                action: 'delete',
            });
        },
        [appBridge],
    );

    const createCategory = useCallback(
        async (category: DocumentCategoryCreate) => {
            const result = await appBridge.createDocumentCategory(category);

            window.emitter.emit(`AppBridge:GuidelineDocumentCategoryAction:${category.documentId}`, {
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

            window.emitter.emit(`AppBridge:GuidelineDocumentCategoryAction:${category.documentId}`, {
                documentCategory: restOfCategory as DocumentCategory,
                action: 'update',
            });
        },
        [appBridge],
    );

    const deleteCategory = useCallback(
        async ({ id, documentId }: { id: number; documentId: number }) => {
            await appBridge.deleteDocumentCategory(id);

            window.emitter.emit(`AppBridge:GuidelineDocumentCategoryAction:${documentId}`, {
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

    const moveDocument = useCallback(
        async (id: number, position: number, newGroupId?: number, oldGroupId?: number) => {
            await appBridge.moveDocument(id, position, newGroupId, oldGroupId);

            window.emitter.emit('AppBridge:GuidelineDocumentMoveAction', {
                document: {
                    id,
                    sort: position,
                    documentGroupId: newGroupId,
                } as Document,
                action: 'update',
            });

            window.emitter.emit('AppBridge:GuidelineDocumentGroupDocumentAction', {
                document: { id, documentGroupId: newGroupId as number },
                action: 'update',
            });
        },
        [appBridge],
    );

    const moveDocumentGroup = useCallback(
        async (id: number, position: number) => {
            await appBridge.moveDocumentGroup(id, position);

            window.emitter.emit('AppBridge:GuidelineDocumentGroupAction', {
                documentGroup: { id, sort: position } as DocumentGroup,
                action: 'update',
            });
        },
        [appBridge],
    );

    const moveDocumentCategory = useCallback(
        async (id: number, documentId: number, position: number) => {
            await appBridge.moveDocumentCategory(id, documentId, position);

            window.emitter.emit(`AppBridge:GuidelineDocumentCategoryAction:${documentId}`, {
                documentCategory: { id, documentId, sort: position } as DocumentCategory,
                action: 'update',
            });
        },
        [appBridge],
    );

    const moveDocumentPage = useCallback(
        async (id: number, documentId: number, position: number, category?: number) => {
            await appBridge.moveDocumentPage(id, documentId, position, category);

            window.emitter.emit(`AppBridge:GuidelineDocumentPageAction:${documentId}`, {
                documentPage: { id, documentId, sort: position } as DocumentPage,
                action: 'update',
            });

            window.emitter.emit(`AppBridge:GuidelineDocumentCategoryPageAction:${documentId}`, {
                documentPage: { id, categoryId: category as number },
                action: 'update',
            });
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
        moveDocumentPage,
        createLibrary,
        updateLibrary,
        deleteLibrary,
        createCategory,
        updateCategory,
        deleteCategory,
        moveDocumentCategory,
        createCoverPage,
        updateCoverPage,
        deleteCoverPage,
        updateLegacyCoverPage,
        moveDocumentGroup,
        createDocumentGroup,
        updateDocumentGroup,
        deleteDocumentGroup,
        updateBrandportalLink,
        createDocument: createStandardDocument,
        updateDocument: updateStandardDocument,
        deleteDocument: deleteStandardDocument,
        moveDocument,
    };
};
