/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';
import cloneDeep from 'lodash-es/cloneDeep';

import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { DocumentCategory, DocumentPage, EmitterAction } from '../types';

export const useDocumentPages = (appBridge: AppBridgeTheme, documentId: number) => {
    const [documentPages, setDocumentPages] = useState<Nullable<(DocumentPage | DocumentCategory)[]>>(null);

    useEffect(() => {
        const fetchAllDocumentPages = async () => {
            const [allDocumentCategories, allDocumentsWithoutCategories] = await Promise.all([
                appBridge.getDocumentCategoriesByDocumentId(documentId),
                appBridge.getUncategorizedPagesByDocumentId(documentId),
            ]);

            allDocumentCategories.sort((a, b) => a.sort - b.sort);
            allDocumentsWithoutCategories.sort((a, b) => a.sort - b.sort);

            setDocumentPages([...allDocumentCategories, ...allDocumentsWithoutCategories]);
        };

        fetchAllDocumentPages();
    }, [appBridge, documentId]);

    useEffect(() => {
        const updateFromEvent = (event: {
            action: EmitterAction;
            documentPageOrDocumentCategory: DocumentPage | DocumentCategory | { id: number };
        }) => {
            setDocumentPages((previousState) => {
                const isInitial = previousState === null;

                const item = event.documentPageOrDocumentCategory as DocumentPage | DocumentCategory;

                if (isInitial) {
                    return event.action === 'update' || event.action === 'add' ? [item] : previousState;
                }

                if (event.action === 'delete') {
                    return deleteItem(previousState, event.documentPageOrDocumentCategory);
                }

                if (event.action === 'add') {
                    return addItem(previousState, item, documentId);
                }

                if (event.action === 'update') {
                    return updateItem(previousState, item);
                }

                return previousState;
            });
        };

        const updateDocumentPageFromEvent = ({
            action,
            documentPage,
        }: {
            action: EmitterAction;
            documentPage: DocumentPage | { id: number };
        }) => updateFromEvent({ action, documentPageOrDocumentCategory: documentPage });

        const updateDocumentCategoryFromEvent = ({
            action,
            documentCategory,
        }: {
            action: EmitterAction;
            documentCategory: DocumentCategory | { id: number };
        }) => updateFromEvent({ action, documentPageOrDocumentCategory: documentCategory });

        window.emitter.on('AppBridge:GuidelineDocumentPageAction', updateDocumentPageFromEvent);
        window.emitter.on('AppBridge:GuidelineDocumentCategoryAction', updateDocumentCategoryFromEvent);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentPageAction', updateDocumentPageFromEvent);
            window.emitter.off('AppBridge:GuidelineDocumentCategoryAction', updateDocumentCategoryFromEvent);
        };
    }, [appBridge, documentId]);

    return [documentPages];
};

const addItem = (
    items: (DocumentPage | DocumentCategory)[],
    itemToAdd: DocumentPage | DocumentCategory,
    currentDocument: number,
) => {
    if (itemToAdd.documentId !== currentDocument) {
        return items;
    }

    const itemsClone = cloneDeep(items);

    const isPageInCategory =
        'categoryId' in itemToAdd && itemToAdd.categoryId !== null && itemToAdd.categoryId !== undefined;

    const addPageToCategory = () => {
        for (const item of itemsClone) {
            const isCategory = 'documentPages' in item;
            const itShouldAdd =
                item.id === (itemToAdd as DocumentPage).categoryId && item.documentId === itemToAdd.documentId;

            if (isCategory && itShouldAdd) {
                if (item.documentPages) {
                    item.documentPages.push(itemToAdd as DocumentPage);
                } else {
                    item.documentPages = [itemToAdd as DocumentPage];
                }

                break;
            }
        }
    };

    isPageInCategory ? addPageToCategory() : itemsClone.push(itemToAdd);

    return itemsClone;
};

const updateItem = (items: (DocumentPage | DocumentCategory)[], itemToUpdate: DocumentPage | DocumentCategory) => {
    const itemsClone = cloneDeep(items);

    const isPageInCategory =
        'categoryId' in itemToUpdate && itemToUpdate.categoryId !== null && itemToUpdate.categoryId !== undefined;

    const updatePageInCategory = () => {
        for (const page of itemsClone) {
            const isCategory = 'documentPages' in page;

            const itShouldUpdate =
                page.id === (itemToUpdate as DocumentPage).categoryId && page.documentId === itemToUpdate.documentId;

            if (isCategory && itShouldUpdate) {
                const pageToUpdateIndex = page.documentPages.findIndex((page) => page.id === itemToUpdate.id);

                page.documentPages[pageToUpdateIndex] = {
                    ...page.documentPages[pageToUpdateIndex],
                    ...(itemToUpdate as DocumentPage),
                };

                break;
            }
        }
    };

    if (isPageInCategory) {
        updatePageInCategory();

        return itemsClone;
    }

    const pageToUpdateIndex = itemsClone.findIndex((document) => document.id === itemToUpdate.id);

    if (pageToUpdateIndex !== -1) {
        itemsClone[pageToUpdateIndex] = itemToUpdate;
    }

    return itemsClone;
};

const deleteItem = (items: (DocumentPage | DocumentCategory)[], itemToDelete: { id: number }) => {
    const filteredItems = items.filter((item) => item.id !== itemToDelete.id);

    return filteredItems.map((item) => {
        if ('documentPages' in item) {
            item.documentPages = item.documentPages.filter((page) => page.id !== itemToDelete.id);
        }

        return item;
    });
};
