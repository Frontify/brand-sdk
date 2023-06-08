/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useState } from 'react';
import { produce } from 'immer';

import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { DocumentGroup, EmitterEvents } from '../types';

type DocumentEvent = EmitterEvents['AppBridge:GuidelineDocumentGroup:DocumentAction'];

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
        const handleDocumentEventUpdates = (event: DocumentEvent) => {
            setDocumentGroups(
                produce((draft) => {
                    const action = `${event.action}-document` as const;
                    const handler = actionHandlers[action] || actionHandlers.default;
                    return handler(draft, event.document);
                }),
            );
        };

        window.emitter.on('AppBridge:GuidelineDocumentGroup:Action', refetch);
        window.emitter.on('AppBridge:GuidelineDocumentGroup:DocumentAction', handleDocumentEventUpdates);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentGroup:Action', refetch);
            window.emitter.off('AppBridge:GuidelineDocumentGroup:DocumentAction', handleDocumentEventUpdates);
        };
    }, [refetch]);

    return { documentGroups: Array.from(documentGroups.values()), refetch, isLoading };
};

const addDocument = (documentGroups: Map<number, DocumentGroup>, documentToAdd: DocumentEvent['document']) => {
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

const deleteDocument = (documentGroups: Map<number, DocumentGroup>, documentToDelete: DocumentEvent['document']) => {
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
