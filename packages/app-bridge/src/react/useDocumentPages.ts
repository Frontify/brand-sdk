/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useState } from 'react';
import { DocumentPageTargetEvent } from './useDocumentPageTargets';

import type { AppBridgeBase } from '../AppBridgeBase';
import type { DocumentPage, EmitterAction } from '../types';

export type DocumentPageEvent = {
    action: EmitterAction;
    documentPage: DocumentPage | { id: number };
};

const sortDocumentPages = (a: DocumentPage, b: DocumentPage) => (a.sort && b.sort ? a.sort - b.sort : 0);

export const useDocumentPages = (appBridge: AppBridgeBase, documentId: number) => {
    const [pages, setPages] = useState<Map<number, DocumentPage>>(new Map([]));
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const refetch = useCallback(async () => {
        setIsLoading(true);
        const pages = await fetchDocumentPages(appBridge, documentId);

        setPages(pages);
        setIsLoading(false);
    }, [appBridge, documentId]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        const refetchIfPageExistsInMap = (event: DocumentPageTargetEvent) => {
            for (const id of event.payload.pageIds) {
                if (pages.has(id)) {
                    refetch();
                }
            }
        };

        window.emitter.on(`AppBridge:GuidelineDocumentPageAction:${documentId}`, refetch);
        window.emitter.on('AppBridge:GuidelineDocumentPageTargetsAction', refetchIfPageExistsInMap);

        return () => {
            window.emitter.off(`AppBridge:GuidelineDocumentPageAction:${documentId}`, refetch);
            window.emitter.off('AppBridge:GuidelineDocumentPageTargetsAction', refetchIfPageExistsInMap);
        };
    }, [documentId, refetch, pages]);

    /**
     * returns list of document pages that do not belong to any document category
     */
    const getUncategorizedPages = useCallback(
        (options: { sortBy?: (a: DocumentPage, b: DocumentPage) => any } = { sortBy: sortDocumentPages }) =>
            Array.from(pages.values())
                .filter((page) => !page.categoryId)
                .sort(options.sortBy),
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

    return { pages, getCategorizedPages, getUncategorizedPages, refetch, isLoading };
};

const fetchDocumentPages = async (appBridge: AppBridgeBase, documentId: number) => {
    const pages = await appBridge.getDocumentPagesByDocumentId(documentId);

    return new Map(pages.map((page) => [page.id, page]));
};
