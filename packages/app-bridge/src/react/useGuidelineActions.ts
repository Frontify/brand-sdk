/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback } from 'react';

import { AppBridgeTheme } from '../AppBridgeTheme';
import type {
    BrandportalLink,
    CoverPage,
    CoverPageUpdateLegacy,
    Document,
    DocumentCategory,
    DocumentGroup,
    DocumentPage,
    EmitterAction,
    ValidCoverPage,
    ValidDocumentCategory,
    ValidDocumentGroup,
    ValidDocumentLibrary,
    ValidDocumentLink,
    ValidDocumentPage,
    ValidDocumentStandard,
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
        async (link: Omit<ValidDocumentLink, 'id'>) => {
            const result = await appBridge.createLink(link);

            emitDocumentAction({ ...result, documentGroupId: link.documentGroupId }, 'add');
        },
        [appBridge],
    );

    const updateLink = useCallback(
        async (link: RequireOnlyOne<ValidDocumentLink, 'id'>) => {
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
        async (library: Omit<ValidDocumentLibrary, 'id'>) => {
            const result = await appBridge.createLibrary(library);

            emitDocumentAction({ ...result, documentGroupId: library.documentGroupId }, 'add');
        },
        [appBridge],
    );

    const updateLibrary = useCallback(
        async (library: RequireOnlyOne<ValidDocumentLibrary, 'id'>) => {
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
        async (document: Omit<ValidDocumentStandard, 'id'>) => {
            const result = await appBridge.createStandardDocument(document);

            emitDocumentAction({ ...result, documentGroupId: document.documentGroupId }, 'add');
        },
        [appBridge],
    );

    const updateStandardDocument = useCallback(
        async (document: RequireOnlyOne<ValidDocumentStandard, 'id'>) => {
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
        async (documentGroup: Omit<ValidDocumentGroup, 'id'>) => {
            const result = await appBridge.createDocumentGroup(documentGroup);

            emitDocumentAction(result, 'add');
        },
        [appBridge],
    );

    const updateDocumentGroup = useCallback(
        async (documentGroup: RequireOnlyOne<ValidDocumentGroup, 'id'>) => {
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
        async (documentPage: Omit<ValidDocumentPage, 'id'>) => {
            const result = await appBridge.createDocumentPage(documentPage);

            emitPageAction(result, 'add');
        },
        [appBridge],
    );

    const updatePage = useCallback(
        async (documentPage: RequireOnlyOne<ValidDocumentPage, 'id'>) => {
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
        async (category: Omit<ValidDocumentCategory, 'id'>) => {
            const result = await appBridge.createDocumentCategory(category);

            emitPageAction(result, 'add');
        },
        [appBridge],
    );

    const updateCategory = useCallback(
        async (category: RequireOnlyOne<ValidDocumentCategory, 'id'>) => {
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
        async (coverPage: Omit<ValidCoverPage, 'id'>) => {
            const result = await appBridge.createCoverPage(coverPage);

            emitCoverPageAction(result, 'add');
        },
        [appBridge],
    );

    const updateCoverPage = useCallback(
        async (coverPage: RequireOnlyOne<ValidCoverPage, 'id'>) => {
            const result = await appBridge.updateCoverPage(coverPage);

            emitCoverPageAction(result, 'update');
        },
        [appBridge],
    );

    /**
     * @deprecated legacy method, should be removed once new endpoint is available
     */
    const updateLegacyCoverPage = useCallback(
        async (coverPage: Partial<ValidCoverPage>) => {
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
