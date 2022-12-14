/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash-es';

import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { Document, DocumentGroup, EmitterAction } from '../types';

export const useDocuments = (appBridge: AppBridgeTheme) => {
    const [documents, setDocuments] = useState<Nullable<(Document | DocumentGroup)[]>>(null);

    useEffect(() => {
        const fetchAllDocuments = async () => {
            const [allDocumentGroups, allDocumentsWithoutGroup] = await Promise.all([
                appBridge.getDocumentGroups(),
                appBridge.getDocumentsWithoutDocumentGroups(),
            ]);

            setDocuments(
                [...allDocumentGroups, ...allDocumentsWithoutGroup].sort((a, b) =>
                    a.sort && b.sort ? a.sort - b.sort : 0,
                ),
            );
        };

        fetchAllDocuments();
    }, [appBridge]);

    useEffect(() => {
        const updateFromEvent = (event: {
            action: EmitterAction;
            documentOrDocumentGroup: Document | DocumentGroup | { id: number };
        }): void => {
            setDocuments((previousState) => {
                const isInitial = previousState === null;

                const item = event.documentOrDocumentGroup as Document | DocumentGroup;

                if (isInitial) {
                    return event.action === 'update' || event.action === 'add' ? [item] : previousState;
                }

                if (event.action === 'delete') {
                    return deleteItem(previousState, event.documentOrDocumentGroup satisfies { id: number });
                }

                if (event.action === 'add') {
                    return addItem(previousState, item);
                }

                if (event.action === 'update') {
                    return updateItem(previousState, item);
                }

                return previousState;
            });
        };

        const updateStandardDocumentFromEvent = ({
            action,
            standardDocument,
        }: {
            action: EmitterAction;
            standardDocument: Document | { id: number };
        }) => updateFromEvent({ action, documentOrDocumentGroup: standardDocument });

        const updateLibraryDocumentFromEvent = ({
            action,
            library,
        }: {
            action: EmitterAction;
            library: Document | { id: number };
        }) => updateFromEvent({ action, documentOrDocumentGroup: library });

        const updateLinkDocumentFromEvent = ({
            action,
            link,
        }: {
            action: EmitterAction;
            link: Document | { id: number };
        }) => updateFromEvent({ action, documentOrDocumentGroup: link });

        const updateDocumentGroupFromEvent = ({
            action,
            documentGroup,
        }: {
            action: EmitterAction;
            documentGroup: DocumentGroup | { id: number };
        }) => updateFromEvent({ action, documentOrDocumentGroup: documentGroup });

        window.emitter.on('AppBridge:GuidelineDocumentGroupAction', updateDocumentGroupFromEvent);
        window.emitter.on('AppBridge:GuidelineStandardDocumentAction', updateStandardDocumentFromEvent);
        window.emitter.on('AppBridge:GuidelineLibraryAction', updateLibraryDocumentFromEvent);
        window.emitter.on('AppBridge:GuidelineLinkAction', updateLinkDocumentFromEvent);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentGroupAction', updateDocumentGroupFromEvent);
            window.emitter.off('AppBridge:GuidelineStandardDocumentAction', updateStandardDocumentFromEvent);
            window.emitter.off('AppBridge:GuidelineLibraryAction', updateLibraryDocumentFromEvent);
            window.emitter.off('AppBridge:GuidelineLinkAction', updateLinkDocumentFromEvent);
        };
    }, [appBridge]);

    return { documents };
};

const addItem = (items: (Document | DocumentGroup)[], itemToAdd: Document | DocumentGroup) => {
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

const updateItem = (items: (Document | DocumentGroup)[], itemToUpdate: Document | DocumentGroup) => {
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
        itemsClone[itemToUpdateIndex] = itemToUpdate;
    }

    return itemsClone;
};

const deleteItem = (items: (Document | DocumentGroup)[], itemToDelete: { id: number }) => {
    const filteredItems = items.filter((item) => item.id !== itemToDelete.id);

    return filteredItems.map((item) => {
        if ('documents' in item && item.documents !== null) {
            item.documents = item.documents.filter((document) => document.id !== itemToDelete.id);
        }

        return item;
    });
};
