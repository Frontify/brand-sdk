/* (c) Copyright Frontify Ltd., all rights reserved. */

import cloneDeep from 'lodash-es/cloneDeep';
import { useCallback, useEffect, useState } from 'react';

import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { DocumentGroup, EmitterAction } from '../types';

type DocumentGroupEvent = {
    action: EmitterAction;
    documentGroup: DocumentGroup | { id: number };
};

type DocumentEvent = {
    action: EmitterAction;
    document: { id: number; documentGroupId?: number | null };
};

export const useDocumentGroups = (appBridge: AppBridgeTheme) => {
    const [documentGroups, setDocumentGroups] = useState<Map<number, DocumentGroup>>(new Map([]));

    const refetch = useCallback(async () => {
        const pages = await fetchDocumentGroups(appBridge);

        setDocumentGroups(pages);
    }, [appBridge]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        const handleEventUpdates = (event: DocumentGroupEvent) => {
            setDocumentGroups((previousState) => {
                const handler = actionHandlers[event.action] || actionHandlers.default;

                return handler(previousState, event.documentGroup as DocumentGroup);
            });
        };

        const handleDocumentEventUpdates = (event: DocumentEvent) => {
            setDocumentGroups((previousState) => {
                const action: 'add-document' | 'delete-document' | 'update-document' = `${event.action}-document`;

                const handler = actionHandlers[action] || actionHandlers.default;

                return handler(previousState, event.document);
            });
        };

        window.emitter.on('AppBridge:GuidelineDocumentGroupAction', handleEventUpdates);
        window.emitter.on('AppBridge:GuidelineDocumentGroupDocumentAction', handleDocumentEventUpdates);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentGroupAction', handleEventUpdates);
            window.emitter.on('AppBridge:GuidelineDocumentGroupDocumentAction', handleDocumentEventUpdates);
        };
    }, []);

    return { documentGroups, refetch };
};

const getGroupWithDocument = (groups: Map<number, DocumentGroup>, documentId: number) =>
    Array.from(groups.values()).find((group) => group.documents?.includes(documentId as any));

const addDocument = (groups: Map<number, DocumentGroup>, documentToAdd: DocumentEvent['document']) => {
    const group = groups.get(documentToAdd.documentGroupId as number);

    if (!group) {
        console.error(
            `Can not add document to document group, document group with id ${documentToAdd.documentGroupId} does not exist`,
        );
        return groups;
    }

    group.documents = [...((group.documents ?? []) as any), documentToAdd.id];

    return new Map(groups.set(group.id, group));
};

const updateDocument = (groups: Map<number, DocumentGroup>, document: DocumentEvent['document']) => {
    const currentGroup = getGroupWithDocument(groups, document.id);
    let updatedGroups = new Map(groups);

    const shouldAddDocumentToGroup = !currentGroup && document.documentGroupId !== null;

    const documentMovedToDifferentGroup =
        currentGroup && document.documentGroupId !== null && currentGroup.id !== document.documentGroupId;

    const documentMovedToUngrouped = currentGroup && document.documentGroupId === null;

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

    group.documents =
        group.documents?.filter((documentId) => (documentId as unknown as any) !== documentToDelete.id) ?? [];

    return new Map(groups.set(group.id, group));
};

const actionHandlers = {
    add: (groups: Map<number, DocumentGroup>, groupToAdd: DocumentGroup) =>
        new Map(groups.set(groupToAdd.id, groupToAdd)),

    update: (groups: Map<number, DocumentGroup>, groupToUpdate: DocumentGroup) => {
        const group = groups.get(groupToUpdate.id);

        return new Map(groups.set(groupToUpdate.id, { ...group, ...groupToUpdate }));
    },

    delete: (groups: Map<number, DocumentGroup>, groupToDelete: DocumentGroup) => {
        const nextGroups = new Map(groups);
        nextGroups.delete(groupToDelete.id);
        return nextGroups;
    },

    'add-document': addDocument,

    'update-document': updateDocument,

    'delete-document': deleteDocument,

    default: (groups: Map<number, DocumentGroup>) => groups,
};

const fetchDocumentGroups = async (appBridge: AppBridgeTheme) => {
    const documentGroups = await appBridge.getDocumentGroups();

    return convertToGroupsMap(documentGroups);
};

const convertToGroupsMap = (documentGroups: DocumentGroup[]) => {
    const groupsClone: DocumentGroup[] = cloneDeep(documentGroups);

    for (const group of groupsClone) {
        if (!group.documents) {
            continue;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        group.documents = group.documents.map((document) => document.id) as any;
    }

    return new Map(groupsClone.map((group) => [group.id, group]));
};
