/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useState } from 'react';

import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { Document } from '../types';

type Options = {
    /**
     * Whether it should fetch on mount.
     */
    enabled?: boolean;
};

const sortDocuments = (a: Document, b: Document) => (a.sort && b.sort ? a.sort - b.sort : 0);

export const useDocuments = (appBridge: AppBridgeBlock | AppBridgeTheme, options: Options = { enabled: true }) => {
    const [documents, setDocuments] = useState<Map<number, Document>>(new Map([]));
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const refetch = useCallback(async () => {
        setIsLoading(true);
        const documents = await fetchDocuments(appBridge);

        setDocuments(documents);
        setIsLoading(false);
    }, [appBridge]);

    useEffect(() => {
        if (options.enabled) {
            refetch();
        }

        window.emitter.on('AppBridge:GuidelineDocumentAction', refetch);
        window.emitter.on('AppBridge:GuidelineDocumentTargetsAction', refetch);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentAction', refetch);
            window.emitter.off('AppBridge:GuidelineDocumentTargetsAction', refetch);
        };
    }, [options.enabled, refetch]);

    /**
     * returns list of documents that do not belong to any document group
     */
    const getUngroupedDocuments = useCallback(
        (options: { sortBy?: (a: Document, b: Document) => number } = { sortBy: sortDocuments }) =>
            Array.from(documents.values())
                .filter((document) => !document.documentGroupId)
                .sort(options.sortBy),
        [documents],
    );

    /**
     * returns list of documents of specific group
     * if documentGroupId is provided.
     * Otherwise, it returns documents for all groups
     */
    const getGroupedDocuments = useCallback(
        (
            documentGroupId?: number,
            options: { sortBy?: (a: Document, b: Document) => number } = { sortBy: sortDocuments },
        ) =>
            Array.from(documents.values())
                .filter((document) =>
                    documentGroupId ? document.documentGroupId === documentGroupId : document.documentGroupId,
                )
                .sort(options.sortBy),
        [documents],
    );

    return { documents, getUngroupedDocuments, getGroupedDocuments, refetch, isLoading };
};

const fetchDocuments = async (appBridge: AppBridgeBlock | AppBridgeTheme) => {
    const documents = await appBridge.getAllDocuments();
    return new Map(documents.map((document) => [document.id, document]));
};
