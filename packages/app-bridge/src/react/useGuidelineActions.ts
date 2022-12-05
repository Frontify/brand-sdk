/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback } from 'react';

import { AppBridgeTheme } from '../AppBridgeTheme';
import type {
    BrandportalLink,
    CoverPage,
    CoverPageCreate,
    CreateDocumentGroup,
    CreateDocumentLibrary,
    CreateDocumentLink,
    CreateDocumentPage,
    CreateDocumentStandard,
    Document,
    DocumentGroup,
    DocumentPage,
    EmitterAction,
    UpdateDocumentGroup,
    UpdateDocumentLibrary,
    UpdateDocumentLink,
    UpdateDocumentPage,
    UpdateDocumentStandard,
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
        page: A extends 'delete' ? { id: number } : DocumentPage,
        action: A,
    ) => {
        window.emitter.emit('AppBridge:GuidelineDocumentPageUpdate', {
            page,
            action,
        });
    };

    const emitCoverPageAction = <A extends EmitterAction>(
        coverPage: A extends 'delete' ? undefined : CoverPage,
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
        async (link: CreateDocumentLink) => {
            const result = await appBridge.createLink(link);

            emitDocumentAction(result, 'add');
        },
        [appBridge],
    );

    const updateLink = useCallback(
        async (link: UpdateDocumentLink) => {
            const result = await appBridge.updateLink(link);

            emitDocumentAction(result, 'update');
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
        async (library: CreateDocumentLibrary) => {
            const result = await appBridge.createLibrary(library);

            emitDocumentAction(result, 'add');
        },
        [appBridge],
    );

    const updateLibrary = useCallback(
        async (library: UpdateDocumentLibrary) => {
            const result = await appBridge.updateLibrary(library);

            emitDocumentAction(result, 'update');
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
        async (document: CreateDocumentStandard) => {
            const result = await appBridge.createStandardDocument(document);

            emitDocumentAction(result, 'add');
        },
        [appBridge],
    );

    const updateStandardDocument = useCallback(
        async (document: UpdateDocumentStandard) => {
            const result = await appBridge.updateStandardDocument(document);

            emitDocumentAction(result, 'update');
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
        async (documentGroup: CreateDocumentGroup) => {
            const result = await appBridge.createDocumentGroup(documentGroup);

            emitDocumentAction(result, 'add');
        },
        [appBridge],
    );

    const updateDocumentGroup = useCallback(
        async (documentGroup: UpdateDocumentGroup) => {
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
        async (documentPage: CreateDocumentPage) => {
            const result = await appBridge.createDocumentPage(documentPage);

            emitPageAction(result, 'add');
        },
        [appBridge],
    );

    const updatePage = useCallback(
        async (documentPage: UpdateDocumentPage) => {
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

    const createCoverPage = useCallback(
        async (coverPage: CoverPageCreate) => {
            const result = await appBridge.createCoverPage(coverPage);

            emitCoverPageAction(result, 'add');
        },
        [appBridge],
    );

    const updateCoverPage = useCallback(
        async (coverPage: CoverPage) => {
            const result = await appBridge.updateCoverPage(coverPage);

            emitCoverPageAction(result, 'update');
        },
        [appBridge],
    );

    /**
     * @deprecated legacy method, should be removed once new endpoint is available
     */
    const publishCoverPage = useCallback(
        async (coverPage: { brandhome_draft: boolean }) => {
            const result = (await appBridge.publishCoverPage(coverPage)) as { brandhome_draft: boolean };

            emitCoverPageAction({ draft: result.brandhome_draft } as CoverPage, 'update');
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
        createCoverPage,
        updateCoverPage,
        deleteCoverPage,
        publishCoverPage,
        createDocumentGroup,
        updateDocumentGroup,
        deleteDocumentGroup,
        updateBrandportalLink,
        createDocument: createStandardDocument,
        updateDocument: updateStandardDocument,
        deleteDocument: deleteStandardDocument,
    };
};
