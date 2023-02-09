/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useState } from 'react';

import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { DocumentGroup, EmitterAction } from '../types';

type DocumentEvent = {
    action: EmitterAction;
    document: { id: number; documentGroupId?: number | null };
};
const sortDocumentGroups = (a: DocumentGroup, b: DocumentGroup) => (a.sort && b.sort ? a.sort - b.sort : 0);

export const useDocumentGroups = (appBridge: AppBridgeTheme) => {
    const [documentGroups, setDocumentGroups] = useState<Map<number, DocumentGroup>>(new Map([]));
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const refetch = useCallback(async () => {
        setIsLoading(true);
        const pages = await fetchDocumentGroups(appBridge);

        setDocumentGroups(pages);
        setIsLoading(false);
    }, [appBridge]);

    useEffect(() => {
        refetch();

        window.emitter.on('AppBridge:GuidelineDocumentGroupAction', refetch);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentGroupAction', refetch);
        };
    }, [refetch]);

    useEffect(() => {
        const handleDocumentEventUpdates = (event: DocumentEvent) => {
            setDocumentGroups((previousState) => {
                const action: 'add-document' | 'delete-document' | 'update-document' = `${event.action}-document`;

                const handler = actionHandlers[action] || actionHandlers.default;

                return handler(previousState, event.document);
            });
        };

        window.emitter.on('AppBridge:GuidelineDocumentGroupDocumentAction', handleDocumentEventUpdates);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentGroupDocumentAction', handleDocumentEventUpdates);
        };
    }, []);

    /**
     * returns list of document groups,
     *  as default sorted by sort value
     */
    const getSortedDocumentGroups = useCallback(
        (
            options: { sortBy?: (a: DocumentGroup, b: DocumentGroup) => any } = {
                sortBy: sortDocumentGroups,
            },
        ) => Array.from(documentGroups.values()).sort(options.sortBy),
        [documentGroups],
    );

    return { documentGroups, getSortedDocumentGroups, refetch, isLoading };
};

const getGroupWithDocument = (groups: Map<number, DocumentGroup>, documentId: number) =>
    Array.from(groups.values()).find((group) => group.documents?.includes(documentId));

const addDocument = (groups: Map<number, DocumentGroup>, documentToAdd: DocumentEvent['document']) => {
    const group = groups.get(documentToAdd.documentGroupId as number);

    if (!group) {
        console.error(
            `Can not add document to document group, document group with id ${documentToAdd.documentGroupId} does not exist`,
        );
        return groups;
    }

    group.documents = [documentToAdd.id, ...group.documents];

    return new Map(groups.set(group.id, group));
};

const updateDocument = (groups: Map<number, DocumentGroup>, document: DocumentEvent['document']) => {
    const currentGroup = getGroupWithDocument(groups, document.id);
    let updatedGroups = new Map(groups);

    const shouldAddDocumentToGroup =
        !currentGroup && document.documentGroupId !== null && document.documentGroupId !== undefined;

    const documentMovedToDifferentGroup =
        currentGroup &&
        document.documentGroupId !== null &&
        document.documentGroupId !== undefined &&
        currentGroup.id !== document.documentGroupId;

    const documentMovedToUngrouped =
        currentGroup && (document.documentGroupId === null || document.documentGroupId === undefined);

    if (documentMovedToDifferentGroup || documentMovedToUngrouped) {
        updatedGroups = deleteDocument(groups, document);
    }

    if (documentMovedToDifferentGroup || shouldAddDocumentToGroup) {
        updatedGroups = addDocument(groups, document);
    }

    return updatedGroups;
};

const deleteDocument = (groups: Map<number, DocumentGroup>, documentToDelete: DocumentEvent['document']) => {
    const group = getGroupWithDocument(groups, documentToDelete.id);

    if (!group) {
        console.error(
            `Can not delete document from document group, document group that has document with id ${documentToDelete.id} does not exist`,
        );
        return groups;
    }

    group.documents = group.documents.filter((documentId) => documentId !== documentToDelete.id);

    return new Map(groups.set(group.id, group));
};

const actionHandlers = {
    'add-document': addDocument,

    'update-document': updateDocument,

    'delete-document': deleteDocument,

    default: (groups: Map<number, DocumentGroup>) => groups,
};

const fetchDocumentGroups = async (appBridge: AppBridgeTheme) => {
    const documentGroups = await appBridge.getDocumentGroups();

    return new Map(documentGroups.map((group) => [group.id, group]));
};
