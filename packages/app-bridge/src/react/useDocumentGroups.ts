/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useState } from 'react';

import type { AppBridgeBase } from '../AppBridgeBase';
import type { DocumentGroup, EmitterAction } from '../types';

type DocumentEvent = {
    action: EmitterAction;
    document: { id: number; documentGroupId?: number | null };
};
const sortDocumentGroups = (a: DocumentGroup, b: DocumentGroup) => (a.sort && b.sort ? a.sort - b.sort : 0);

export const useDocumentGroups = (appBridge: AppBridgeBase) => {
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
     * Returns a sorted list of document groups.
     *
     * The returned list is sorted based on the `sortBy` option provided. By default, it uses the `sort` property to sort the list.
     *
     * @param options An object with the following properties:
     *   - sortBy: (optional) A function used to sort the list of document groups. It should take two document group objects as arguments and return a value that represents their sort order.
     *
     * @returns An array of sorted document groups.
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

const fetchDocumentGroups = async (appBridge: AppBridgeBase) => {
    const documentGroups = await appBridge.getDocumentGroups();

    return new Map(documentGroups.map((group) => [group.id, group]));
};
