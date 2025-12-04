/* (c) Copyright Frontify Ltd., all rights reserved. */

import { produce } from 'immer';
import { useCallback, useEffect, useState } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { type DocumentGroup, type EmitterEvents } from '../types';

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

export const useDocumentGroups = (appBridge: AppBridgeBlock, options: Options = { enabled: true }) => {
    const [documentGroups, setDocumentGroups] = useState<Map<number, DocumentGroup>>(new Map([]));
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const refetch = useCallback(async () => {
        setIsLoading(true);
        setDocumentGroups(await fetchDocumentGroups(appBridge));
        setIsLoading(false);
    }, [appBridge]);

    useEffect(() => {
        if (options.enabled) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
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

        // handles when a document is moved from/in a document group, refetches for updated positioning
        const handlerDocumentMoveEvent = (event: DocumentEvent) => {
            if ((event?.action === 'move' || event?.action === 'add') && documentGroups.size > 0) {
                refetch();
            }
        };

        const handlerDocumentMoveEventPreview = (event: DocumentMoveEvent) => {
            setDocumentGroups(
                produce((draft) => previewDocumentSort(draft, event.document, event.position, event.newGroupId)),
            );
        };

        const handleDocumentGroupMoveEventPreview = (event: DocumentGroupMoveEvent) => {
            setDocumentGroups(
                produce((draft) => previewDocumentGroupsSort(draft, event.documentGroup, event.position)),
            );
        };

        window.emitter.on('AppBridge:GuidelineDocumentGroup:Action', refetch);
        window.emitter.on('AppBridge:GuidelineDocumentGroup:DocumentAction', handleDocumentEventUpdates);
        window.emitter.on('AppBridge:GuidelineDocument:Action', handlerDocumentMoveEvent);
        window.emitter.on('AppBridge:GuidelineDocument:MoveEvent', handlerDocumentMoveEventPreview);
        window.emitter.on('AppBridge:GuidelineDocumentGroup:MoveEvent', handleDocumentGroupMoveEventPreview);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentGroup:Action', refetch);
            window.emitter.off('AppBridge:GuidelineDocumentGroup:DocumentAction', handleDocumentEventUpdates);
            window.emitter.off('AppBridge:GuidelineDocument:Action', handlerDocumentMoveEvent);
            window.emitter.off('AppBridge:GuidelineDocument:MoveEvent', handlerDocumentMoveEventPreview);
            window.emitter.off('AppBridge:GuidelineDocumentGroup:MoveEvent', handleDocumentGroupMoveEventPreview);
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
    const documentGroupsAsArray: DocumentGroup[] = [...documentGroups.values()].sort(sortDocumentGroups);
    const newDocumentGroups: DocumentGroup[] = [];

    documentGroups.clear();

    for (const currentDocumentGroup of documentGroupsAsArray) {
        const currentPosition = currentDocumentGroup.sort ?? 0;
        let positionIncrease = 0;
        if (newPosition < currentPosition) {
            positionIncrease = previousPosition > currentPosition || previousPosition === 0 ? 1 : 0;
        } else {
            positionIncrease = previousPosition <= currentPosition ? -1 : 0;
        }

        newDocumentGroups.push({
            ...currentDocumentGroup,
            sort: currentPosition + positionIncrease,
        });
    }

    const sortedNewDocumentGroups = [...newDocumentGroups].sort(sortDocumentGroups);
    for (const currentDocumentGroup of sortedNewDocumentGroups) {
        documentGroups.set(currentDocumentGroup.id, currentDocumentGroup);
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
    const documentGroupsAsArray: DocumentGroup[] = [...documentGroups.values()].sort(sortDocumentGroups);
    const newDocumentGroups: DocumentGroup[] = [];

    documentGroups.clear();

    for (const currentDocumentGroup of documentGroupsAsArray) {
        if (currentDocumentGroup.id === documentGroup.id) {
            newDocumentGroups.push({ ...currentDocumentGroup, sort: newPosition });
            continue;
        }

        const currentPosition = currentDocumentGroup.sort ?? 0;
        let positionIncrease = 0;
        if (newPosition <= currentPosition) {
            positionIncrease = previousPosition > currentPosition ? 1 : 0;
        }

        newDocumentGroups.push({
            ...currentDocumentGroup,
            sort: currentPosition + positionIncrease,
        });
    }

    const sortedNewDocumentGroups = [...newDocumentGroups].sort(sortDocumentGroups);
    for (const currentDocumentGroup of sortedNewDocumentGroups) {
        documentGroups.set(currentDocumentGroup.id, currentDocumentGroup);
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

const fetchDocumentGroups = async (appBridge: AppBridgeBlock) => {
    const documentGroups = await appBridge.getDocumentGroups();
    return new Map([...documentGroups].sort(sortDocumentGroups).map((group) => [group.id, group]));
};
