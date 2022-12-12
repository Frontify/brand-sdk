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

                if (isInitial) {
                    return event.action === 'update' || event.action === 'add'
                        ? [event.documentOrDocumentGroup as Document | DocumentGroup]
                        : previousState;
                }

                if (event.action === 'delete') {
                    return deleteDocument(previousState, event.documentOrDocumentGroup as { id: number });
                }

                if (event.action === 'add') {
                    return addDocument(previousState, event.documentOrDocumentGroup as Document | DocumentGroup);
                }

                if (event.action === 'update') {
                    return updateDocument(previousState, event.documentOrDocumentGroup as Document | DocumentGroup);
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

const addDocument = (documents: (Document | DocumentGroup)[], documentToAdd: Document | DocumentGroup) => {
    const documentsClone = cloneDeep(documents);

    const isDocumentInGroup =
        'documentGroupId' in documentToAdd &&
        documentToAdd.documentGroupId !== null &&
        documentToAdd.documentGroupId !== undefined;

    const addDocumentToGroup = () => {
        for (const document of documentsClone) {
            if (document.id === (documentToAdd as Document).documentGroupId && 'documents' in document) {
                document.documents
                    ? document.documents.push(documentToAdd as Document)
                    : (document.documents = [documentToAdd as Document]);

                break;
            }
        }
    };

    isDocumentInGroup ? addDocumentToGroup() : documentsClone.push(documentToAdd);

    return documentsClone;
};

const updateDocument = (documents: (Document | DocumentGroup)[], documentToUpdate: Document | DocumentGroup) => {
    const documentsClone = cloneDeep(documents);

    const documentToUpdateIndex = documentsClone.findIndex((document) => document.id === documentToUpdate.id);

    documentsClone[documentToUpdateIndex] = documentToUpdate;

    return documentsClone;
};

const deleteDocument = (documents: (Document | DocumentGroup)[], documentToDelete: { id: number }) => {
    const filteredDocuments = documents.filter((document) => document.id !== documentToDelete.id);

    return filteredDocuments.map((document) => {
        if ('documents' in document && document.documents !== null) {
            document.documents = document.documents.filter((document) => document.id !== documentToDelete.id);
        }

        return document;
    });
};
