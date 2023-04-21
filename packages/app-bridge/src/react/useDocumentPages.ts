/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useState } from 'react';
import { DocumentPageTargetEvent } from './useDocumentPageTargets';

import type { DocumentPage, EmitterAction } from '../types';
import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { AppBridgeTheme } from '../AppBridgeTheme';

export type DocumentPageEvent = {
    action: EmitterAction;
    documentPage: DocumentPage | { id: number };
};

export const useDocumentPages = (
    appBridge: AppBridgeBlock | AppBridgeTheme,
    documentId?: number,
    categoryId?: number,
    allPages?: boolean,
) => {
    const [pages, setPages] = useState<Map<number, DocumentPage>>(new Map([]));
    const [categorizedPages, setCategorizedPages] = useState<Map<number, DocumentPage>>(new Map([]));
    const [uncategorizedPages, setUncategorizedPages] = useState<Map<number, DocumentPage>>(new Map([]));
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const refetch = useCallback(async () => {
        setIsLoading(true);

        if (categoryId) {
            const categorizedPages = await fetchCategorizedDocumentPages(appBridge, categoryId);

            setCategorizedPages(categorizedPages);
        }

        if (documentId) {
            const uncategorizedPages = await fetchUncategorizedDocumentPages(appBridge, documentId);

            setUncategorizedPages(uncategorizedPages);
        }

        if (documentId && allPages) {
            const pages = await fetchDocumentPages(appBridge, documentId);

            setPages(pages);
        }

        setIsLoading(false);
    }, [appBridge, documentId]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        const refetchIfPageExistsInMap = (event: DocumentPageTargetEvent) => {
            for (const id of event.payload.pageIds) {
                if ((pages || categorizedPages || uncategorizedPages).has(id)) {
                    refetch();
                }
            }
        };

        documentId && window.emitter.on(`AppBridge:GuidelineDocumentPageAction:${documentId}`, refetch);
        window.emitter.on('AppBridge:GuidelineDocumentPageTargetsAction', refetchIfPageExistsInMap);

        return () => {
            documentId && window.emitter.off(`AppBridge:GuidelineDocumentPageAction:${documentId}`, refetch);
            window.emitter.off('AppBridge:GuidelineDocumentPageTargetsAction', refetchIfPageExistsInMap);
        };
    }, [documentId, refetch, pages, categorizedPages, uncategorizedPages]);

    return { pages, categorizedPages, uncategorizedPages, refetch, isLoading };
};

const fetchCategorizedDocumentPages = async (appBridge: AppBridgeBlock | AppBridgeTheme, categoryId: number) => {
    const pages = await appBridge.getCategorizedPagesByCategoryId(categoryId);

    return new Map(pages.map((page) => [page.id, page]));
};

const fetchUncategorizedDocumentPages = async (appBridge: AppBridgeBlock | AppBridgeTheme, documentId: number) => {
    const pages = await appBridge.getUncategorizedPagesByDocumentId(documentId);

    return new Map(pages.map((page) => [page.id, page]));
};

const fetchDocumentPages = async (appBridge: AppBridgeBlock | AppBridgeTheme, documentId: number) => {
    const pages = await appBridge.getDocumentPagesByDocumentId(documentId);

    return new Map(pages.map((page) => [page.id, page]));
};
