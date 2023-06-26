/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useState } from 'react';
import { current, produce } from 'immer';

import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { Document, EmitterEvents } from '../types';

type DocumentPageEvent = EmitterEvents['AppBridge:GuidelineDocument:DocumentPageAction'];
type DocumentCategoryEvent = EmitterEvents['AppBridge:GuidelineDocument:DocumentCategoryAction'];
type DocumentEvent = EmitterEvents['AppBridge:GuidelineDocumentGroup:Action'];
type DocumentMoveEvent = EmitterEvents['AppBridge:GuidelineDocument:MoveEvent'];
type DocumentGroupMoveEvent = EmitterEvents['AppBridge:GuidelineDocumentGroup:MoveEvent'];

type Options = {
    /**
     * Whether it should fetch on mount.
     */
    enabled?: boolean;
};

const sortDocuments = (a: Document, b: Document) => (a.sort && b.sort ? a.sort - b.sort : 0);

export const useUngroupedDocuments = (
    appBridge: AppBridgeBlock | AppBridgeTheme,
    options: Options = { enabled: true },
) => {
    const [documents, setDocuments] = useState<Map<number, Document>>(new Map([]));
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const refetch = useCallback(async () => {
        setIsLoading(true);
        setDocuments(await fetchUngroupedDocuments(appBridge));
        setIsLoading(false);
    }, [appBridge]);

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

        // handles when a document group is moved, refetches for updated positioning
        const handleDocumentGroupUpdateEvent = (event: DocumentEvent) => {
            if (event?.action === 'update' && documents.size > 0) {
                refetch();
            }
        };

        const handlerDocumentMoveEventPreview = (event: DocumentMoveEvent) => {
            setDocuments(
                produce((draft) => previewDocumentSort(draft, event?.document, event.position, event.newGroupId)),
            );
        };

        const handlerDocumentGroupMoveEventPreview = (event: DocumentGroupMoveEvent) => {
            setDocuments(produce((draft) => previewDocumentGroupSort(draft, event?.documentGroup, event.position)));
        };

        const handler = ({ action, document }: EmitterEvents['AppBridge:GuidelineDocument:Action']) => {
            if (
                ((action === 'update' || action === 'move') && documents.has(document.id)) ||
                (action === 'add' && !document.documentGroupId)
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
        window.emitter.on('AppBridge:GuidelineDocumentGroup:Action', handleDocumentGroupUpdateEvent);
        window.emitter.on('AppBridge:GuidelineDocument:MoveEvent', handlerDocumentMoveEventPreview);
        window.emitter.on('AppBridge:GuidelineDocumentGroup:MoveEvent', handlerDocumentGroupMoveEventPreview);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocument:Action', handler);
            window.emitter.off('AppBridge:GuidelineDocumentTargets:Action', refetch);
            window.emitter.off('AppBridge:GuidelineDocument:DocumentPageAction', handleDocumentPageEvent);
            window.emitter.off('AppBridge:GuidelineDocument:DocumentCategoryAction', handleDocumentCategoryEvent);
            window.emitter.off('AppBridge:GuidelineDocumentGroup:Action', handleDocumentGroupUpdateEvent);
            window.emitter.off('AppBridge:GuidelineDocument:MoveEvent', handlerDocumentMoveEventPreview);
            window.emitter.off('AppBridge:GuidelineDocumentGroup:MoveEvent', handlerDocumentGroupMoveEventPreview);
        };
    }, [documents, options.enabled, refetch]);

    return { documents: Array.from(documents.values()), refetch, isLoading };
};

const previewDocumentSort = (
    documents: Map<number, Document>,
    document: DocumentMoveEvent['document'],
    newPosition: DocumentMoveEvent['position'],
    newGroupId: DocumentMoveEvent['newGroupId'],
) => {
    console.log('documents previewDocumentSort - pre', document, current(documents), newPosition, newGroupId);
    if (newGroupId || !document.sort) {
        return documents;
    }

    const previousPosition = document.sort;
    const documentsAsArray: Document[] = [...documents.values()];

    documents.clear();

    for (const currentDocument of documentsAsArray) {
        if (currentDocument.id === document.id) {
            documents.set(currentDocument.id, { ...currentDocument, sort: newPosition });
            continue;
        }

        const oldPosition = currentDocument.sort ?? 0;
        let positionIncrease = 0;
        if (newPosition <= oldPosition) {
            positionIncrease = previousPosition > oldPosition ? 1 : 0;
        }

        documents.set(currentDocument.id, { ...currentDocument, sort: oldPosition + positionIncrease });
    }

    console.log('documents previewDocumentSort - post', current(documents), newPosition, newGroupId);
    return documents;
};

const previewDocumentGroupSort = (
    documents: Map<number, Document>,
    documentGroup: DocumentGroupMoveEvent['documentGroup'],
    newPosition: DocumentGroupMoveEvent['position'],
) => {
    console.log('documents previewDocumentGroupSort - pre', current(documents), newPosition, documentGroup);
    if (!documentGroup.sort) {
        return documents;
    }

    const previousPosition = documentGroup.sort;
    const documentsAsArray: Document[] = [...documents.values()];

    documents.clear();

    for (const currentDocument of documentsAsArray) {
        const oldPosition = currentDocument.sort ?? 0;
        let positionIncrease = 0;
        if (newPosition <= oldPosition) {
            positionIncrease = previousPosition > oldPosition ? 1 : 0;
        }

        documents.set(currentDocument.id, { ...currentDocument, sort: oldPosition + positionIncrease });
    }

    console.log('documents previewDocumentGroupSort - post', current(documents), newPosition, documentGroup);
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

const fetchUngroupedDocuments = async (appBridge: AppBridgeBlock | AppBridgeTheme) => {
    const documents = await appBridge.getUngroupedDocuments();
    return new Map([...documents].sort(sortDocuments).map((document) => [document.id, document]));
};
