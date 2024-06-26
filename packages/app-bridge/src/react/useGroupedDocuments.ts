/* (c) Copyright Frontify Ltd., all rights reserved. */

import { produce } from 'immer';
import { useCallback, useEffect, useState } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { type AppBridgeTheme } from '../AppBridgeTheme';
import { type Document, type EmitterEvents } from '../types';

type DocumentPageEvent = EmitterEvents['AppBridge:GuidelineDocument:DocumentPageAction'];
type DocumentCategoryEvent = EmitterEvents['AppBridge:GuidelineDocument:DocumentCategoryAction'];
type DocumentMoveEvent = EmitterEvents['AppBridge:GuidelineDocument:MoveEvent'];

type Options = {
    /**
     * Whether it should fetch on mount.
     */
    enabled?: boolean;
};

const sortDocuments = (a: Document, b: Document) => (a.sort && b.sort ? a.sort - b.sort : 0);

export const useGroupedDocuments = (
    appBridge: AppBridgeBlock | AppBridgeTheme,
    documentGroupId: number,
    options: Options = { enabled: true },
) => {
    const [documents, setDocuments] = useState<Map<number, Document>>(new Map([]));
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const refetch = useCallback(async () => {
        setIsLoading(true);
        setDocuments(await fetchGroupedDocuments(appBridge, documentGroupId));
        setIsLoading(false);
    }, [appBridge, documentGroupId]);

    useEffect(() => {
        if (options.enabled) {
            refetch();
        }
    }, [options.enabled, refetch]);

    useEffect(() => {
        const handleDocumentPageEvent = (event: DocumentPageEvent) => {
            if (!documents.has(event.documentPage.documentId)) {
                return;
            }

            setDocuments(
                produce((draft) => {
                    const action = `${event.action}-page` as const;
                    const handler = actionHandlers[action] || actionHandlers.default;
                    return handler(draft, event.documentPage);
                }),
            );
        };

        const handleDocumentCategoryEvent = (event: DocumentCategoryEvent) => {
            if (!documents.has(event.documentCategory.documentId)) {
                return;
            }

            setDocuments(
                produce((draft) => {
                    const action = `${event.action}-category` as const;
                    const handler = actionHandlers[action] || actionHandlers.default;
                    return handler(draft, event.documentCategory);
                }),
            );
        };

        const handlerDocumentMoveEventPreview = (event: DocumentMoveEvent) => {
            if (!documents.has(event.document.id) || event.newGroupId !== documentGroupId) {
                return;
            }

            setDocuments(
                produce((draft) => previewDocumentSort(draft, event.document, event.position, event.newGroupId)),
            );
        };

        const handler = ({ action, document }: EmitterEvents['AppBridge:GuidelineDocument:Action']) => {
            if (
                ((action === 'update' || action === 'move') && documents.has(document.id)) ||
                (action === 'add' && document.documentGroupId === documentGroupId)
            ) {
                refetch();
            } else if (action === 'delete' && documents.has(document.id)) {
                setDocuments(
                    produce((draft) => {
                        if (action === 'delete') {
                            draft.delete(document.id);
                        }
                    }),
                );
            }
        };

        window.emitter.on('AppBridge:GuidelineDocument:Action', handler);
        window.emitter.on('AppBridge:GuidelineDocumentTargets:Action', refetch);
        window.emitter.on('AppBridge:GuidelineDocument:DocumentPageAction', handleDocumentPageEvent);
        window.emitter.on('AppBridge:GuidelineDocument:DocumentCategoryAction', handleDocumentCategoryEvent);
        window.emitter.on('AppBridge:GuidelineDocument:MoveEvent', handlerDocumentMoveEventPreview);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocument:Action', handler);
            window.emitter.off('AppBridge:GuidelineDocumentTargets:Action', refetch);
            window.emitter.off('AppBridge:GuidelineDocument:DocumentPageAction', handleDocumentPageEvent);
            window.emitter.off('AppBridge:GuidelineDocument:DocumentCategoryAction', handleDocumentCategoryEvent);
            window.emitter.off('AppBridge:GuidelineDocument:MoveEvent', handlerDocumentMoveEventPreview);
        };
    }, [documentGroupId, documents, options.enabled, refetch]);

    return { documents: Array.from(documents.values()), refetch, isLoading };
};

const previewDocumentSort = (
    documents: Map<number, Document>,
    document: DocumentMoveEvent['document'],
    newPosition: DocumentMoveEvent['position'],
    newGroupId: DocumentMoveEvent['newGroupId'],
) => {
    if (!document.sort) {
        return documents;
    }

    const previousDocument = documents.get(document.id);
    const documentsAsArray: Document[] = [...documents.values()].sort(sortDocuments);

    documents.clear();

    let sort = 1;
    let isOnLastPosition = true;
    for (const currentDocument of documentsAsArray) {
        if (currentDocument.id === document.id || currentDocument.documentGroupId !== newGroupId) {
            continue;
        }

        if (previousDocument && sort === newPosition) {
            documents.set(document.id, { ...previousDocument, sort: newPosition });
            isOnLastPosition = false;
        }

        documents.set(currentDocument.id, {
            ...currentDocument,
            sort,
        });

        sort++;
    }

    if (previousDocument && isOnLastPosition) {
        documents.set(document.id, { ...previousDocument, sort });
    }

    return documents;
};

const addDocumentPage = (documents: Map<number, Document>, documentPageToAdd: DocumentPageEvent['documentPage']) => {
    const document = documents.get(documentPageToAdd.documentId);
    if (!document) {
        return documents;
    }

    const newDocument = {
        ...document,
        numberOfUncategorizedDocumentPages: document.numberOfUncategorizedDocumentPages + 1,
    };

    return documents.set(document.id, newDocument);
};

const deleteDocumentPage = (
    documents: Map<number, Document>,
    documentPageToDelete: DocumentPageEvent['documentPage'],
) => {
    const document = documents.get(documentPageToDelete.documentId);
    if (!document) {
        return documents;
    }

    const newDocument = {
        ...document,
        numberOfUncategorizedDocumentPages: document.numberOfUncategorizedDocumentPages - 1,
    };

    return documents.set(document.id, newDocument);
};

const addDocumentCategory = (
    documents: Map<number, Document>,
    documentCategoryToAdd: DocumentCategoryEvent['documentCategory'],
) => {
    const document = documents.get(documentCategoryToAdd.documentId);
    if (!document) {
        return documents;
    }

    const newDocument = {
        ...document,
        numberOfDocumentPageCategories: document.numberOfDocumentPageCategories + 1,
    };

    return documents.set(document.id, newDocument);
};

const deleteDocumentCategory = (
    documents: Map<number, Document>,
    documentCategoryToDelete: DocumentCategoryEvent['documentCategory'],
) => {
    const document = documents.get(documentCategoryToDelete.documentId);
    if (!document) {
        return documents;
    }

    const newDocument = {
        ...document,
        numberOfDocumentPageCategories: document.numberOfDocumentPageCategories - 1,
    };

    return documents.set(document.id, newDocument);
};

const actionHandlers = {
    'add-page': addDocumentPage,
    'delete-page': deleteDocumentPage,
    'add-category': addDocumentCategory,
    'delete-category': deleteDocumentCategory,
    default: (documents: Map<number, Document>) => documents,
};

const fetchGroupedDocuments = async (appBridge: AppBridgeBlock | AppBridgeTheme, documentGroupId: number) => {
    const documents = await appBridge.getDocumentsByDocumentGroupId(documentGroupId);
    return new Map([...documents].sort(sortDocuments).map((document) => [document.id, document]));
};
