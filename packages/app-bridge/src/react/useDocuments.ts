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
        const updateDocumentsFromEvent = (event: { document: Document | DocumentGroup; action: EmitterAction }) => {
            setDocuments((previousState) => {
                if (event.action === 'add') {
                    return previousState ? [...cloneDeep(previousState), event.document] : [event.document];
                }

                if (event.action === 'delete') {
                    return previousState
                        ? cloneDeep(previousState).filter((document) => document.id !== event.document.id)
                        : previousState;
                }

                const documentToUpdateIndex = previousState?.findIndex((document) => document.id === event.document.id);

                if (!documentToUpdateIndex || previousState === null) {
                    return previousState;
                }

                const stateClone = cloneDeep(previousState);

                stateClone[documentToUpdateIndex] = event.document;

                return stateClone;
            });
        };

        window.emitter.on('AppBridge:GuidelineDocumentUpdate', updateDocumentsFromEvent);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentUpdate', updateDocumentsFromEvent);
        };
    }, [appBridge]);

    return { documents };
};
