/* (c) Copyright Frontify Ltd., all rights reserved. */

import cloneDeep from 'lodash-es/cloneDeep';
import { useCallback, useEffect, useState } from 'react';

import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { DocumentGroup, EmitterAction } from '../types';

type Event = {
    action: EmitterAction;
    documentGroup: DocumentGroup | { id: number };
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
        const handleEventUpdates = (event: Event) => {
            setDocumentGroups((previousState) => {
                const handler = actionHandlers[event.action] || actionHandlers.default;

                return handler(previousState, event.documentGroup as DocumentGroup);
            });
        };

        window.emitter.on('AppBridge:GuidelineDocumentGroupAction', handleEventUpdates);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentGroupAction', handleEventUpdates);
        };
    }, []);

    return { documentGroups, refetch };
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
