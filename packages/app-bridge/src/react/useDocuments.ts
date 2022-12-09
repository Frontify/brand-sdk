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
                const isInitial = previousState === null;

                if (isInitial) {
                    return event.action === 'update' || event.action === 'add' ? [event.document] : previousState;
                }

                if (event.action === 'delete') {
                    return deleteDocument(previousState, event.document);
                }

                if (event.action === 'add') {
                    return addDocument(previousState, event.document);
                }

                if (event.action === 'update') {
                    return updateDocument(previousState, event.document);
                }

                return previousState;
            });
        };

        window.emitter.on('AppBridge:GuidelineDocumentUpdate', updateDocumentsFromEvent);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentUpdate', updateDocumentsFromEvent);
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
