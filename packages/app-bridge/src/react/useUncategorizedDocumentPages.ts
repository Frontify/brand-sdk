/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useState } from 'react';
import { DocumentPageTargetEvent } from './useDocumentPageTargets';

import type { DocumentPage, EmitterEvents } from '../types';
import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { AppBridgeTheme } from '../AppBridgeTheme';

type Options = {
    /**
     * Whether it should fetch on mount.
     */
    enabled?: boolean;
};

const sortDocumentPages = (a: DocumentPage, b: DocumentPage) => (a.sort && b.sort ? a.sort - b.sort : 0);

export const useUncategorizedDocumentPages = (
    appBridge: AppBridgeBlock | AppBridgeTheme,
    documentId: number,
    options: Options = { enabled: true },
) => {
    const [documentPages, setDocumentPages] = useState<Map<number, DocumentPage>>(new Map([]));
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const refetch = useCallback(async () => {
        setIsLoading(true);
        setDocumentPages(await fetchDocumentPagesByDocumentId(appBridge, documentId));
        setIsLoading(false);
    }, [appBridge, documentId]);

    useEffect(() => {
        if (options.enabled) {
            refetch();
        }
    }, [options.enabled, refetch]);

    useEffect(() => {
        const refetchIfPageExistsInMap = (event: DocumentPageTargetEvent) => {
            for (const id of event.payload.pageIds) {
                if (documentPages.has(id)) {
                    refetch();
                }
            }
        };

        const handler = ({ action, documentPage }: EmitterEvents['AppBridge:GuidelineDocumentPageAction']) => {
            if (
                documentPage.documentId === documentId &&
                !documentPage.categoryId &&
                (documentPages.has(documentPage.id) || action === 'add')
            ) {
                refetch();
            }
        };

        window.emitter.on('AppBridge:GuidelineDocumentPageAction', handler);
        window.emitter.on('AppBridge:GuidelineDocumentPageTargetsAction', refetchIfPageExistsInMap);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentPageAction', handler);
            window.emitter.off('AppBridge:GuidelineDocumentPageTargetsAction', refetchIfPageExistsInMap);
        };
    }, [documentId, refetch, documentPages]);

    return { documentPages: Array.from(documentPages.values()), refetch, isLoading };
};

const fetchDocumentPagesByDocumentId = async (appBridge: AppBridgeBlock | AppBridgeTheme, documentId: number) => {
    const pages = await appBridge.getUncategorizedDocumentPagesByDocumentId(documentId);
    return new Map(pages.sort(sortDocumentPages).map((page) => [page.id, page]));
};
