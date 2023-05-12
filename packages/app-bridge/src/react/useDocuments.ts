/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useState } from 'react';
import { produce } from 'immer';

import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { Document, EmitterEvents } from '../types';

type DocumentPageEvent = EmitterEvents['AppBridge:GuidelineDocument:DocumentPageAction'];
type DocumentCategoryEvent = EmitterEvents['AppBridge:GuidelineDocument:DocumentCategoryAction'];

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
        setDocuments(await fetchDocuments(appBridge));
        setIsLoading(false);
    }, [appBridge]);

    useEffect(() => {
        if (options.enabled) {
            refetch();
        }
    }, [options.enabled, refetch]);

    useEffect(() => {
        const handleDocumentPageEvent = (event: DocumentPageEvent) => {
            if (!documents.has(event.documentPage.documentId)) {
                return;
            }

            setDocuments(
                produce((draft) => {
                    const action = `${event.action}-page` as const;
                    const handler = actionHandlers[action] || actionHandlers.default;
                    return handler(draft, event.documentPage);
                }),
            );
        };

        const handleDocumentCategoryEvent = (event: DocumentCategoryEvent) => {
            if (!documents.has(event.documentCategory.documentId)) {
                return;
            }

            setDocuments(
                produce((draft) => {
                    const action = `${event.action}-category` as const;
                    const handler = actionHandlers[action] || actionHandlers.default;
                    return handler(draft, event.documentCategory);
                }),
            );
        };

        window.emitter.on('AppBridge:GuidelineDocument:Action', refetch);
        window.emitter.on('AppBridge:GuidelineDocumentTargets:Action', refetch);
        window.emitter.on('AppBridge:GuidelineDocument:DocumentPageAction', handleDocumentPageEvent);
        window.emitter.on('AppBridge:GuidelineDocument:DocumentCategoryAction', handleDocumentCategoryEvent);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocument:Action', refetch);
            window.emitter.off('AppBridge:GuidelineDocumentTargets:Action', refetch);
            window.emitter.off('AppBridge:GuidelineDocument:DocumentPageAction', handleDocumentPageEvent);
            window.emitter.off('AppBridge:GuidelineDocument:DocumentCategoryAction', handleDocumentCategoryEvent);
        };
    }, [documents, options.enabled, refetch]);

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

const addDocumentPage = (documents: Map<number, Document>, documentPageToAdd: DocumentPageEvent['documentPage']) => {
    const document = documents.get(documentPageToAdd.documentId);
    if (!document) {
        return documents;
    }

    document.numberOfUncategorizedDocumentPages += 1;

    return documents.set(document.id, document);
};

const deleteDocumentPage = (
    documents: Map<number, Document>,
    documentPageToDelete: DocumentPageEvent['documentPage'],
) => {
    const document = documents.get(documentPageToDelete.documentId);
    if (!document) {
        return documents;
    }

    document.numberOfUncategorizedDocumentPages -= 1;

    return documents.set(document.id, document);
};

const addDocumentCategory = (
    documents: Map<number, Document>,
    documentCategoryToAdd: DocumentCategoryEvent['documentCategory'],
) => {
    const document = documents.get(documentCategoryToAdd.documentId);
    if (!document) {
        return documents;
    }

    document.numberOfDocumentPageCategories += 1;

    return documents.set(document.id, document);
};

const deleteDocumentCategory = (
    documents: Map<number, Document>,
    documentCategoryToDelete: DocumentCategoryEvent['documentCategory'],
) => {
    const document = documents.get(documentCategoryToDelete.documentId);
    if (!document) {
        return documents;
    }

    document.numberOfDocumentPageCategories -= 1;

    return documents.set(document.id, document);
};

const actionHandlers = {
    'add-page': addDocumentPage,
    'delete-page': deleteDocumentPage,
    'add-category': addDocumentCategory,
    'delete-category': deleteDocumentCategory,
    default: (documents: Map<number, Document>) => documents,
};

const fetchDocuments = async (appBridge: AppBridgeBlock | AppBridgeTheme) => {
    const documents = await appBridge.getAllDocuments();
    return new Map(documents.map((document) => [document.id, document]));
};
