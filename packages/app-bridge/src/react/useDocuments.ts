/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useState } from 'react';

import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { Document, EmitterAction } from '../types';

type Event = {
    action: EmitterAction;
    document: Document | { id: number };
};

const sortDocuments = (a: Document, b: Document) => (a.sort && b.sort ? a.sort - b.sort : 0);

export const useDocuments = (appBridge: AppBridgeTheme) => {
    const [documents, setDocuments] = useState<Map<number, Document>>(new Map([]));
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const refetch = useCallback(async () => {
        setIsLoading(true);
        const documents = await fetchDocuments(appBridge);

        setDocuments(documents);
        setIsLoading(false);
    }, [appBridge]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        const handleEventUpdates = (event: Event) => {
            setDocuments((previousState) => {
                const handler = actionHandlers[event.action] || actionHandlers.default;

                return handler(previousState, event.document as Document);
            });
        };

        window.emitter.on('AppBridge:GuidelineDocumentAction', handleEventUpdates);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentAction', handleEventUpdates);
        };
    }, []);

    /**
     * returns list of documents that do not belong to any document group
     */
    const getUngroupedDocuments = useCallback(
        () => Array.from(documents.values()).filter((document) => !document.documentGroupId),
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
            options: { sortBy?: (a: Document, b: Document) => any } = { sortBy: sortDocuments },
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

const actionHandlers = {
    add: (documents: Map<number, Document>, documentToAdd: Document) =>
        new Map(documents.set(documentToAdd.id, documentToAdd)),

    update: (documents: Map<number, Document>, documentToUpdate: Document) => {
        const document = documents.get(documentToUpdate.id);

        return new Map(documents.set(documentToUpdate.id, { ...document, ...documentToUpdate }));
    },

    delete: (documents: Map<number, Document>, documentToDelete: Document) => {
        const nextDocuments = new Map(documents);
        nextDocuments.delete(documentToDelete.id);
        return nextDocuments;
    },

    default: (documents: Map<number, Document>) => documents,
};

const fetchDocuments = async (appBridge: AppBridgeTheme) => {
    const [groups, documents] = await Promise.all([appBridge.getDocumentGroups(), appBridge.getAllDocuments()]);

    // TODO: has to be done like this as BE does not support returning documentGroupId in documents. Remove it once it is supported
    for (const document of documents) {
        for (const group of groups) {
            if (group.documents && group.documents.includes(document.id)) {
                document.documentGroupId = group.id;
            }
        }
    }

    return new Map(documents.map((document) => [document.id, document]));
};
