/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useState } from 'react';
import { produce } from 'immer';

import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { DocumentGroup, EmitterEvents } from '../types';

type DocumentGroupDocumentEvent = EmitterEvents['AppBridge:GuidelineDocumentGroup:DocumentAction'];
type DocumentEvent = EmitterEvents['AppBridge:GuidelineDocument:Action'];
type DocumentMoveEvent = EmitterEvents['AppBridge:GuidelineDocument:MoveEvent'];
type DocumentGroupMoveEvent = EmitterEvents['AppBridge:GuidelineDocumentGroup:MoveEvent'];

type Options = {
    /**
     * Whether it should fetch on mount.
     */
    enabled?: boolean;
};

const sortDocumentGroups = (a: DocumentGroup, b: DocumentGroup) => (a.sort && b.sort ? a.sort - b.sort : 0);

export const useDocumentGroups = (appBridge: AppBridgeBlock | AppBridgeTheme, options: Options = { enabled: true }) => {
    const [documentGroups, setDocumentGroups] = useState<Map<number, DocumentGroup>>(new Map([]));
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const refetch = useCallback(async () => {
        setIsLoading(true);
        setDocumentGroups(await fetchDocumentGroups(appBridge));
        setIsLoading(false);
    }, [appBridge]);

    useEffect(() => {
        if (options.enabled) {
            refetch();
        }
    }, [options.enabled, refetch]);

    useEffect(() => {
        const handleDocumentEventUpdates = (event: DocumentGroupDocumentEvent) => {
            setDocumentGroups(
                produce((draft) => {
                    const action = `${event.action}-document` as const;
                    const handler = actionHandlers[action] || actionHandlers.default;
                    return handler(draft, event.document);
                }),
            );
        };

        // handles when a document is moved from/outside a document group, refetches for updated positioning
        const handlerDocumentMoveEvent = (event: DocumentEvent) => {
            if (
                (event?.action === 'move' || event?.action === 'add') &&
                documentGroups.size > 0 &&
                event?.document?.documentGroupId === null
            ) {
                refetch();
            }
        };

        const handlerDocumentMoveEventPreview = (event: DocumentMoveEvent) => {
            setDocumentGroups(
                produce((draft) => previewDocumentSort(draft, event.document, event.position, event.newGroupId)),
            );
        };

        const handlerDocumentGroupMoveEventPreview = (event: DocumentGroupMoveEvent) => {
            setDocumentGroups(
                produce((draft) => previewDocumentGroupsSort(draft, event.documentGroup, event.position)),
            );
        };

        window.emitter.on('AppBridge:GuidelineDocumentGroup:Action', refetch);
        window.emitter.on('AppBridge:GuidelineDocumentGroup:DocumentAction', handleDocumentEventUpdates);
        window.emitter.on('AppBridge:GuidelineDocument:Action', handlerDocumentMoveEvent);
        window.emitter.on('AppBridge:GuidelineDocument:MoveEvent', handlerDocumentMoveEventPreview);
        window.emitter.on('AppBridge:GuidelineDocumentGroup:MoveEvent', handlerDocumentGroupMoveEventPreview);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentGroup:Action', refetch);
            window.emitter.off('AppBridge:GuidelineDocumentGroup:DocumentAction', handleDocumentEventUpdates);
            window.emitter.off('AppBridge:GuidelineDocument:Action', handlerDocumentMoveEvent);
            window.emitter.off('AppBridge:GuidelineDocument:MoveEvent', handlerDocumentMoveEventPreview);
            window.emitter.off('AppBridge:GuidelineDocumentGroup:MoveEvent', handlerDocumentGroupMoveEventPreview);
        };
    }, [documentGroups.size, refetch]);

    return { documentGroups: Array.from(documentGroups.values()), refetch, isLoading };
};

const previewDocumentSort = (
    documentGroups: Map<number, DocumentGroup>,
    document: DocumentMoveEvent['document'],
    newPosition: DocumentMoveEvent['position'],
    newGroupId: DocumentMoveEvent['newGroupId'],
) => {
    if (newGroupId || !document.sort) {
        return documentGroups;
    }

    const previousPosition = document.sort;
    const documentGroupsAsArray: DocumentGroup[] = [...documentGroups.values()];

    documentGroups.clear();

    for (const currentDocumentGroup of documentGroupsAsArray) {
        const currentPosition = currentDocumentGroup.sort ?? 0;
        let positionIncrease = 0;
        if (newPosition < currentPosition) {
            positionIncrease = previousPosition > currentPosition ? 1 : 0;
        } else if (newPosition === currentPosition) {
            positionIncrease = previousPosition > currentPosition ? 1 : -1;
        }

        documentGroups.set(currentDocumentGroup.id, {
            ...currentDocumentGroup,
            sort: currentPosition + positionIncrease,
        });
    }

    return documentGroups;
};

const previewDocumentGroupsSort = (
    documentGroups: Map<number, DocumentGroup>,
    documentGroup: DocumentGroupMoveEvent['documentGroup'],
    newPosition: DocumentGroupMoveEvent['position'],
) => {
    if (!documentGroup.sort) {
        return documentGroups;
    }

    const previousPosition = documentGroup.sort;
    const documentGroupsAsArray: DocumentGroup[] = [...documentGroups.values()];

    documentGroups.clear();

    for (const currentDocumentGroup of documentGroupsAsArray) {
        if (currentDocumentGroup.id === documentGroup.id) {
            documentGroups.set(currentDocumentGroup.id, { ...currentDocumentGroup, sort: newPosition });
            continue;
        }

        const currentPosition = currentDocumentGroup.sort ?? 0;
        let positionIncrease = 0;
        if (newPosition <= currentPosition) {
            positionIncrease = previousPosition > currentPosition ? 1 : 0;
        }

        documentGroups.set(currentDocumentGroup.id, {
            ...currentDocumentGroup,
            sort: currentPosition + positionIncrease,
        });
    }

    return documentGroups;
};

const addDocument = (
    documentGroups: Map<number, DocumentGroup>,
    documentToAdd: DocumentGroupDocumentEvent['document'],
) => {
    if (!documentToAdd.documentGroupId) {
        return documentGroups;
    }

    const documentGroup = documentGroups.get(documentToAdd.documentGroupId);
    if (!documentGroup) {
        return documentGroups;
    }

    const newDocumentGroup = {
        ...documentGroup,
        numberOfDocuments: documentGroup.numberOfDocuments + 1,
    };

    return documentGroups.set(documentGroup.id, newDocumentGroup);
};

const deleteDocument = (
    documentGroups: Map<number, DocumentGroup>,
    documentToDelete: DocumentGroupDocumentEvent['document'],
) => {
    if (!documentToDelete.documentGroupId) {
        return documentGroups;
    }

    const documentGroup = documentGroups.get(documentToDelete.documentGroupId);
    if (!documentGroup) {
        return documentGroups;
    }

    const newDocumentGroup = {
        ...documentGroup,
        numberOfDocuments: documentGroup.numberOfDocuments - 1,
    };

    return documentGroups.set(documentGroup.id, newDocumentGroup);
};

const actionHandlers = {
    'add-document': addDocument,
    'delete-document': deleteDocument,
    default: (groups: Map<number, DocumentGroup>) => groups,
};

const fetchDocumentGroups = async (appBridge: AppBridgeBlock | AppBridgeTheme) => {
    const documentGroups = await appBridge.getDocumentGroups();
    return new Map([...documentGroups].sort(sortDocumentGroups).map((group) => [group.id, group]));
};
