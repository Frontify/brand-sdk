/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useState } from 'react';
import { current, produce } from 'immer';

import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { DocumentGroup, EmitterEvents } from '../types';

type DocumentGroupDocumentEvent = EmitterEvents['AppBridge:GuidelineDocumentGroup:DocumentAction'];
type DocumentEvent = EmitterEvents['AppBridge:GuidelineDocument:Action'];
type DocumentMoveEvent = EmitterEvents['AppBridge:GuidelineDocument:MoveEvent'];

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
            setDocumentGroups(produce((draft) => previewDocumentGroupsSort(draft, event.position, event.newGroupId)));
        };

        window.emitter.on('AppBridge:GuidelineDocumentGroup:Action', refetch);
        window.emitter.on('AppBridge:GuidelineDocumentGroup:DocumentAction', handleDocumentEventUpdates);
        window.emitter.on('AppBridge:GuidelineDocument:Action', handlerDocumentMoveEvent);
        window.emitter.on('AppBridge:GuidelineDocument:MoveEvent', handlerDocumentMoveEventPreview);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentGroup:Action', refetch);
            window.emitter.off('AppBridge:GuidelineDocumentGroup:DocumentAction', handleDocumentEventUpdates);
            window.emitter.off('AppBridge:GuidelineDocument:Action', handlerDocumentMoveEvent);
            window.emitter.off('AppBridge:GuidelineDocument:MoveEvent', handlerDocumentMoveEventPreview);
        };
    }, [documentGroups.size, refetch]);

    return { documentGroups: Array.from(documentGroups.values()), refetch, isLoading };
};

const previewDocumentGroupsSort = (
    documentGroups: Map<number, DocumentGroup>,
    newPosition: DocumentMoveEvent['position'],
    newGroupId: DocumentMoveEvent['newGroupId'],
) => {
    console.log('previewDocumentGroupsSort - pre', current(documentGroups), newPosition, newGroupId);
    if (newGroupId) {
        return documentGroups;
    }

    const documentGroupsAsArray: DocumentGroup[] = [...documentGroups.values()];

    documentGroups.clear();

    for (const documentGroup of documentGroupsAsArray) {
        const oldPosition = documentGroup.sort ?? 0;
        let positionIncrease = 0;
        if (newPosition < oldPosition) {
            positionIncrease = 1;
        } else if (newPosition === oldPosition) {
            positionIncrease = -1;
        }

        const newDocumentGroup = { ...documentGroup, sort: oldPosition + positionIncrease };
        documentGroups.set(documentGroup.id, newDocumentGroup);
    }

    console.log('previewDocumentGroupsSort - post', current(documentGroups), newPosition, newGroupId);
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
