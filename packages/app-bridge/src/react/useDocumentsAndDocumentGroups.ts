/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useState } from 'react';
import { cloneDeep } from 'lodash-es';

import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { Document, DocumentGroup, EmitterAction } from '../types';

type Event = {
    action: EmitterAction;
    documentOrDocumentGroup: Document | DocumentGroup | { id: number };
};

type DocumentsAndGroups = (Document | DocumentGroup)[];

export const useDocumentsAndDocumentGroups = (appBridge: AppBridgeTheme) => {
    const [documents, setDocuments] = useState<Nullable<DocumentsAndGroups>>(null);

    const refetch = useCallback(async () => {
        const data = await fetchAllDocuments(appBridge);

        setDocuments(data);
    }, [appBridge]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        const handleEventUpdates = (event: Event): void => {
            setDocuments((previousState) => {
                const isInitial = previousState === null;

                if (isInitial) {
                    return initialize(previousState, event);
                }

                const handler = actionHandlers[event.action] || actionHandlers.default;

                return handler(previousState, event);
            });
        };

        const handleStandardDocumentEventUpdates = ({
            action,
            standardDocument,
        }: {
            action: EmitterAction;
            standardDocument: Document | { id: number };
        }) => handleEventUpdates({ action, documentOrDocumentGroup: standardDocument });

        const handleLibraryDocumentEventUpdates = ({
            action,
            library,
        }: {
            action: EmitterAction;
            library: Document | { id: number };
        }) => handleEventUpdates({ action, documentOrDocumentGroup: library });

        const handleLinkDocumentEventUpdates = ({
            action,
            link,
        }: {
            action: EmitterAction;
            link: Document | { id: number };
        }) => handleEventUpdates({ action, documentOrDocumentGroup: link });

        const handleDocumentGroupEventUpdates = ({
            action,
            documentGroup,
        }: {
            action: EmitterAction;
            documentGroup: DocumentGroup | { id: number };
        }) => handleEventUpdates({ action, documentOrDocumentGroup: documentGroup });

        // const handleDocumentMoveEvent = ({ action, document }: { action: 'update'; document: Document }) =>
        //     handleEventUpdates({ action, documentOrDocumentGroup: document });

        // const handleDocumentGroupMoveEvent = ({
        //     action,
        //     documentGroup,
        // }: {
        //     action: 'update';
        //     documentGroup: DocumentGroup;
        // }) => handleEventUpdates({ action, documentOrDocumentGroup: documentGroup });

        window.emitter.on('AppBridge:GuidelineDocumentGroupAction', handleDocumentGroupEventUpdates);
        window.emitter.on('AppBridge:GuidelineStandardDocumentAction', handleStandardDocumentEventUpdates);
        window.emitter.on('AppBridge:GuidelineLibraryAction', handleLibraryDocumentEventUpdates);
        window.emitter.on('AppBridge:GuidelineLinkAction', handleLinkDocumentEventUpdates);
        // window.emitter.on('AppBridge:GuidelineDocumentMoveAction', handleDocumentMoveEvent);
        // window.emitter.on('AppBridge:GuidelineDocumentGroupMoveAction', handleDocumentGroupMoveEvent);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentGroupAction', handleDocumentGroupEventUpdates);
            window.emitter.off('AppBridge:GuidelineStandardDocumentAction', handleStandardDocumentEventUpdates);
            window.emitter.off('AppBridge:GuidelineLibraryAction', handleLibraryDocumentEventUpdates);
            window.emitter.off('AppBridge:GuidelineLinkAction', handleLinkDocumentEventUpdates);
            // window.emitter.on('AppBridge:GuidelineDocumentMoveAction', handleDocumentMoveEvent);
            // window.emitter.on('AppBridge:GuidelineDocumentGroupMoveAction', handleDocumentGroupMoveEvent);
        };
    }, [appBridge]);

    return { documents, refetch };
};

const addItem = (items: DocumentsAndGroups, itemToAdd: Document | DocumentGroup) => {
    const itemsClone = cloneDeep(items);

    const isDocumentInGroup =
        'documentGroupId' in itemToAdd && itemToAdd.documentGroupId !== null && itemToAdd.documentGroupId !== undefined;

    const addDocumentToGroup = () => {
        for (const item of itemsClone) {
            const isDocumentGroup = 'documents' in item;
            const itShouldAdd = item.id === (itemToAdd as Document).documentGroupId;

            if (isDocumentGroup && itShouldAdd) {
                if (item.documents) {
                    item.documents.push(itemToAdd as Document);
                } else {
                    item.documents = [itemToAdd as Document];
                }

                break;
            }
        }
    };

    isDocumentInGroup ? addDocumentToGroup() : itemsClone.push(itemToAdd);

    return itemsClone;
};

const updateItem = (items: DocumentsAndGroups, itemToUpdate: Document | DocumentGroup) => {
    const itemsClone = cloneDeep(items);

    const isDocumentInGroup =
        'documentGroupId' in itemToUpdate &&
        itemToUpdate.documentGroupId !== null &&
        itemToUpdate.documentGroupId !== undefined;

    const updateDocumentInDocumentGroup = () => {
        for (const item of itemsClone) {
            const isDocumentGroup = 'documents' in item;

            const itShouldUpdate = item.id === (itemToUpdate as Document).documentGroupId;

            if (isDocumentGroup && itShouldUpdate && item.documents) {
                const documentToUpdateIndex = item.documents.findIndex((document) => document.id === itemToUpdate.id);

                item.documents[documentToUpdateIndex] = {
                    ...item.documents[documentToUpdateIndex],
                    ...(itemToUpdate as Document),
                };

                break;
            }
        }
    };

    if (isDocumentInGroup) {
        updateDocumentInDocumentGroup();

        return itemsClone;
    }

    const itemToUpdateIndex = itemsClone.findIndex((item) => item.id === itemToUpdate.id);

    if (itemToUpdateIndex !== -1) {
        itemsClone[itemToUpdateIndex] = { ...itemsClone[itemToUpdateIndex], ...itemToUpdate };
    }

    return itemsClone;
};

const deleteItem = (items: DocumentsAndGroups, itemToDelete: { id: number }) => {
    const filteredItems = items.filter((item) => item.id !== itemToDelete.id);

    return filteredItems.map((item) => {
        if ('documents' in item && item.documents !== null) {
            item.documents = item.documents.filter((document) => document.id !== itemToDelete.id);
        }

        return item;
    });
};

const actionHandlers = {
    add: (items: DocumentsAndGroups, event: Event) =>
        addItem(items, event.documentOrDocumentGroup as Document | DocumentGroup),

    update: (items: DocumentsAndGroups, event: Event) =>
        updateItem(items, event.documentOrDocumentGroup as Document | DocumentGroup),

    delete: (items: DocumentsAndGroups, event: Event) =>
        deleteItem(items, event.documentOrDocumentGroup as { id: number }),

    default: (items: DocumentsAndGroups) => items,
};

const initialize = (previousState: Nullable<DocumentsAndGroups>, event: Event) => {
    if (event.action === 'update' || event.action === 'add') {
        return [event.documentOrDocumentGroup as Document | DocumentGroup];
    }

    return previousState;
};

const fetchAllDocuments = async (appBridge: AppBridgeTheme) => {
    const [groups, documents] = await Promise.all([appBridge.getDocumentGroups(), appBridge.getUngroupedDocuments()]);

    const sortDocuments = (a: Document, b: Document) => (a.sort && b.sort ? a.sort - b.sort : 0);

    for (const group of groups) {
        if (group.documents) {
            group.documents = group.documents
                .sort(sortDocuments)
                .map((document) => ({ ...document, documentGroupId: group.id }));
        }
    }

    return [...groups, ...documents].sort((a, b) => (a.sort && b.sort ? a.sort - b.sort : 0));
};
