/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useState } from 'react';

import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { DocumentPage, EmitterAction } from '../types';

export type DocumentPageEvent = {
    action: EmitterAction;
    documentPage: DocumentPage | { id: number };
};

const sortDocumentPages = (a: DocumentPage, b: DocumentPage) => (a.sort && b.sort ? a.sort - b.sort : 0);

export const useDocumentPages = (appBridge: AppBridgeTheme, documentId: number) => {
    const [pages, setPages] = useState<Map<number, DocumentPage>>(new Map([]));

    const refetch = useCallback(async () => {
        const pages = await fetchDocumentPages(appBridge, documentId);

        setPages(pages);
    }, [appBridge, documentId]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        const handleEventUpdates = (event: DocumentPageEvent) => {
            setPages((previousState) => {
                const handler = actionHandlers[event.action] || actionHandlers.default;

                return handler(previousState, event.documentPage as DocumentPage);
            });
        };

        window.emitter.on(`AppBridge:GuidelineDocumentPageAction:${documentId}`, handleEventUpdates);

        return () => {
            window.emitter.off(`AppBridge:GuidelineDocumentPageAction:${documentId}`, handleEventUpdates);
        };
    }, [documentId]);

    /**
     * returns list of document pages that do not belong to any document category
     */
    const getUncategorizedPages = useCallback(
        () => Array.from(pages.values()).filter((page) => !page.categoryId),
        [pages],
    );

    /**
     * returns list of document pages of specific document category
     * if documentGroupId is provided.
     * Otherwise, it returns document pages for all document categories
     */
    const getCategorizedPages = useCallback(
        (
            documentCategoryId?: number,
            options: { sortBy?: (a: DocumentPage, b: DocumentPage) => any } = { sortBy: sortDocumentPages },
        ) =>
            Array.from(pages.values())
                .filter((page) => (documentCategoryId ? page.categoryId === documentCategoryId : page.categoryId))
                .sort(options.sortBy),
        [pages],
    );

    return { pages, getCategorizedPages, getUncategorizedPages, refetch };
};

const actionHandlers = {
    add: (pages: Map<number, DocumentPage>, pageToAdd: DocumentPage) => new Map(pages.set(pageToAdd.id, pageToAdd)),

    update: (pages: Map<number, DocumentPage>, pageToUpdate: DocumentPage) => {
        const page = pages.get(pageToUpdate.id);

        return new Map(pages.set(pageToUpdate.id, { ...page, ...pageToUpdate }));
    },

    delete: (pages: Map<number, DocumentPage>, pageToDelete: DocumentPage) => {
        const nextPages = new Map(pages);
        nextPages.delete(pageToDelete.id);
        return nextPages;
    },

    default: (pages: Map<number, DocumentPage>) => pages,
};

const fetchDocumentPages = async (appBridge: AppBridgeTheme, documentId: number) => {
    const pages = await appBridge.getDocumentPagesByDocumentId(documentId);

    return new Map(pages.map((page) => [page.id, page]));
};
