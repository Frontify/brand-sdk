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

            window.emitter.emit('AppBridge:GuidelineDocumentAction', {
                document: { ...result, ...(link.documentGroupId && { documentGroupId: link.documentGroupId }) },
                action: 'add',
            });

            if (link.documentGroupId) {
                window.emitter.emit('AppBridge:GuidelineDocumentGroupDocumentAction', {
                    document: { id: result.id, documentGroupId: link.documentGroupId },
                    action: 'add',
                });
            }

            return result;
        },
        [appBridge],
    );

    const updateLink = useCallback(
        async (link: DocumentLinkUpdate) => {
            const result = await appBridge.updateLink(link);

            window.emitter.emit('AppBridge:GuidelineDocumentAction', {
                document: { ...result, ...(link.documentGroupId && { documentGroupId: link.documentGroupId }) },
                action: 'update',
            });

            return result;
        },
        [appBridge],
    );

    const deleteLink = useCallback(
        async (documentId: number) => {
            await appBridge.deleteLink(documentId);

            window.emitter.emit('AppBridge:GuidelineDocumentAction', {
                document: { id: documentId },
                action: 'delete',
            });

            window.emitter.emit('AppBridge:GuidelineDocumentGroupDocumentAction', {
                document: { id: documentId },
                action: 'delete',
            });
        },
        [appBridge],
    );

    const createLibrary = useCallback(
        async (library: DocumentLibraryCreate) => {
            const result = await appBridge.createLibrary(library);

            window.emitter.emit('AppBridge:GuidelineDocumentAction', {
                document: {
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

            return result;
        },
        [appBridge],
    );

    const updateLibrary = useCallback(
        async (library: DocumentLibraryUpdate) => {
            const result = await appBridge.updateLibrary(library);

            window.emitter.emit('AppBridge:GuidelineDocumentAction', {
                document: {
                    ...result,
                    ...(library.documentGroupId && { documentGroupId: library.documentGroupId }),
                },
                action: 'update',
            });

            return result;
        },
        [appBridge],
    );

    const deleteLibrary = useCallback(
        async (documentId: number) => {
            await appBridge.deleteLibrary(documentId);

            window.emitter.emit('AppBridge:GuidelineDocumentAction', {
                document: { id: documentId },
                action: 'delete',
            });

            window.emitter.emit('AppBridge:GuidelineDocumentGroupDocumentAction', {
                document: { id: documentId },
                action: 'delete',
            });
        },
        [appBridge],
    );

    const createStandardDocument = useCallback(
        async (document: DocumentStandardCreate) => {
            const result = await appBridge.createStandardDocument(document);

            window.emitter.emit('AppBridge:GuidelineDocumentAction', {
                document: {
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

            return result;
        },
        [appBridge],
    );

    const updateStandardDocument = useCallback(
        async (document: DocumentStandardUpdate) => {
            const result = await appBridge.updateStandardDocument(document);

            window.emitter.emit('AppBridge:GuidelineDocumentAction', {
                document: {
                    ...result,
                    ...(document.documentGroupId && { documentGroupId: document.documentGroupId }),
                },
                action: 'update',
            });

            return result;
        },
        [appBridge],
    );

    const deleteStandardDocument = useCallback(
        async (documentId: number) => {
            await appBridge.deleteStandardDocument(documentId);

            window.emitter.emit('AppBridge:GuidelineDocumentAction', {
                document: { id: documentId },
                action: 'delete',
            });

            window.emitter.emit('AppBridge:GuidelineDocumentGroupDocumentAction', {
                document: { id: documentId },
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

            return result;
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
        async (documentGroupId: number) => {
            await appBridge.deleteDocumentGroup(documentGroupId);

            window.emitter.emit('AppBridge:GuidelineDocumentGroupAction', {
                documentGroup: { id: documentGroupId },
                action: 'delete',
            });
        },
        [appBridge],
    );

    const createDocumentPage = useCallback(
        async (documentPage: DocumentPageCreate) => {
            const result = await appBridge.createDocumentPage(documentPage);

            window.emitter.emit('AppBridge:GuidelineDocumentPageAction', {
                documentPage: result,
                action: 'add',
            });

            if (documentPage.categoryId) {
                window.emitter.emit('AppBridge:GuidelineDocumentCategoryPageAction', {
                    documentPage: {
                        id: result.id,
                        documentId: documentPage.documentId,
                        categoryId: documentPage.categoryId,
                    },
                    action: 'add',
                });
            }

            return result;
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
    const updateDocumentPage = useCallback(
        async (documentPage: DocumentPageUpdate) => {
            const result = await appBridge.updateDocumentPage(documentPage);

            window.emitter.emit('AppBridge:GuidelineDocumentPageAction', {
                documentPage: result,
                action: 'update',
            });

            return result;
        },
        [appBridge],
    );

    const deleteDocumentPage = useCallback(
        async ({ id, documentId, categoryId }: { id: number; documentId: number; categoryId: Nullable<number> }) => {
            await appBridge.deleteDocumentPage(id);

            window.emitter.emit('AppBridge:GuidelineDocumentPageAction', {
                documentPage: { id, documentId, categoryId },
                action: 'delete',
            });

            if (categoryId) {
                window.emitter.emit('AppBridge:GuidelineDocumentCategoryPageAction', {
                    documentPage: { id, documentId, categoryId },
                    action: 'delete',
                });
            }
        },
        [appBridge],
    );

    const duplicateDocumentPage = useCallback(
        async ({ id, documentId, categoryId }: { id: number; documentId: number; categoryId?: number }) => {
            const result = await appBridge.duplicateDocumentPage(id);

            window.emitter.emit('AppBridge:GuidelineDocumentPageAction', {
                documentPage: { ...result, title: result.name, documentId, categoryId } as unknown as DocumentPage,
                action: 'add',
            });

            if (categoryId) {
                window.emitter.emit('AppBridge:GuidelineDocumentCategoryPageAction', {
                    documentPage: { id: result.id, documentId, categoryId },
                    action: 'add',
                });
            }

            return result;
        },
        [appBridge],
    );

    const createDocumentCategory = useCallback(
        async (category: DocumentCategoryCreate) => {
            const result = await appBridge.createDocumentCategory(category);

            window.emitter.emit('AppBridge:GuidelineDocumentCategoryAction', {
                documentCategory: result,
                action: 'add',
            });

            return result;
        },
        [appBridge],
    );

    const updateDocumentCategory = useCallback(
        async (category: DocumentCategoryUpdate) => {
            const documentCategory = await appBridge.updateDocumentCategory(category);

            window.emitter.emit('AppBridge:GuidelineDocumentCategoryAction', {
                documentCategory,
                action: 'update',
            });
        },
        [appBridge],
    );

    const deleteDocumentCategory = useCallback(
        async ({ id, documentId }: { id: number; documentId: number }) => {
            await appBridge.deleteDocumentCategory(id);

            window.emitter.emit('AppBridge:GuidelineDocumentCategoryAction', {
                documentCategory: { id, documentId },
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

            return result;
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

            return result;
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

            const result = await appBridge.updateLegacyCoverPage(legacyCoverPage);

            window.emitter.emit('AppBridge:GuidelineCoverPageAction', {
                coverPage: coverPage as CoverPage,
                action: 'update',
            });

            return result;
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

            return result;
        },
        [appBridge],
    );

    const moveDocument = useCallback(
        async (documentId: number, position: number, newGroupId?: number) => {
            await appBridge.moveDocument(documentId, position, newGroupId);

            window.emitter.emit('AppBridge:GuidelineDocumentAction', {
                document: {
                    id: documentId,
                    sort: position,
                    documentGroupId: newGroupId,
                } as Document,
                action: 'update',
            });

            window.emitter.emit('AppBridge:GuidelineDocumentGroupDocumentAction', {
                document: { id: documentId, documentGroupId: newGroupId as number },
                action: 'update',
            });
        },
        [appBridge],
    );

    const moveDocumentGroup = useCallback(
        async (documentGroupId: number, position: number) => {
            await appBridge.moveDocumentGroup(documentGroupId, position);

            window.emitter.emit('AppBridge:GuidelineDocumentGroupAction', {
                documentGroup: { id: documentGroupId, sort: position } as DocumentGroup,
                action: 'update',
            });
        },
        [appBridge],
    );

    const moveDocumentCategory = useCallback(
        async (documentCategoryId: number, documentId: number, position: number) => {
            await appBridge.moveDocumentCategory(documentCategoryId, documentId, position);

            window.emitter.emit('AppBridge:GuidelineDocumentCategoryAction', {
                documentCategory: { id: documentCategoryId, documentId, sort: position } as DocumentCategory,
                action: 'update',
            });
        },
        [appBridge],
    );

    const moveDocumentPage = useCallback(
        async (documentPageId: number, documentId: number, position: number, categoryId?: number) => {
            await appBridge.moveDocumentPage(documentPageId, documentId, position, categoryId);

            window.emitter.emit('AppBridge:GuidelineDocumentPageAction', {
                documentPage: { id: documentPageId, documentId, sort: position, categoryId } as DocumentPage,
                action: 'update',
            });

            if (categoryId) {
                window.emitter.emit('AppBridge:GuidelineDocumentCategoryPageAction', {
                    documentPage: { id: documentPageId, documentId, categoryId },
                    action: 'add',
                });
            }
        },
        [appBridge],
    );

    const moveDocumentPageBetweenDocuments = useCallback(
        async (documentPageId: number, sourceDocumentId: number, targetDocumentId: number) => {
            const result = await appBridge.moveDocumentPageBetweenDocuments(documentPageId, targetDocumentId);

            window.emitter.emit('AppBridge:GuidelineDocumentPageAction', {
                documentPage: { id: documentPageId, documentId: sourceDocumentId, categoryId: null },
                action: 'delete',
            });

            window.emitter.emit('AppBridge:GuidelineDocumentPageAction', {
                documentPage: result,
                action: 'update',
            });
        },
        [appBridge],
    );

    const updateDocumentPageTargets = useCallback(
        async (targets: number[], documentPageIds: number[]) => {
            const result = await appBridge.updateDocumentPageTargets(targets, documentPageIds);

            window.emitter.emit('AppBridge:GuidelineDocumentPageTargetsAction', {
                payload: { targets, pageIds: documentPageIds },
                action: 'update',
            });

            return result;
        },
        [appBridge],
    );

    const updateDocumentTargets = useCallback(
        async (targets: number[], documentIds: number[]) => {
            const result = await appBridge.updateDocumentTargets(targets, documentIds);

            window.emitter.emit('AppBridge:GuidelineDocumentTargetsAction', {
                payload: { targets, documentIds },
                action: 'update',
            });

            return result;
        },
        [appBridge],
    );

    return {
        createLink,
        updateLink,
        deleteLink,
        createDocumentPage,
        updateDocumentPage,
        deleteDocumentPage,
        duplicateDocumentPage,
        moveDocumentPage,
        moveDocumentPageBetweenDocuments,
        createLibrary,
        updateLibrary,
        deleteLibrary,
        createDocumentCategory,
        updateDocumentCategory,
        deleteDocumentCategory,
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
        updateDocumentPageTargets,
        updateDocumentTargets,
    };
};
