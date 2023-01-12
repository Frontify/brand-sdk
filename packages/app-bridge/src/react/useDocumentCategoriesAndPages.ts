/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash-es';

import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { DocumentCategory, DocumentPage, EmitterAction } from '../types';

type Event = {
    action: EmitterAction;
    documentPageOrDocumentCategory: DocumentPage | DocumentCategory | { id: number };
};

type PagesAndCategories = (DocumentPage | DocumentCategory)[];

export const useDocumentCategoriesAndPages = (appBridge: AppBridgeTheme, documentId: number) => {
    const [documentCategoriesAndPages, setDocumentCategoriesAndPages] = useState<Nullable<PagesAndCategories>>(null);

    useEffect(() => {
        const fetchAllDocumentPages = async () => {
            const [categories = [], pages = []] = await Promise.all([
                appBridge.getDocumentCategoriesByDocumentId(documentId),
                appBridge.getUncategorizedPagesByDocumentId(documentId),
            ]);

            const pagesAndCategories = [...categories, ...pages].sort((a, b) => a.sort - b.sort);

            setDocumentCategoriesAndPages(pagesAndCategories);
        };

        fetchAllDocumentPages();
    }, [appBridge, documentId]);

    useEffect(() => {
        const handleEventUpdates = (event: Event) => {
            if (isInvalidDocument(event.documentPageOrDocumentCategory, documentId)) {
                return;
            }

            setDocumentCategoriesAndPages((previousState) => {
                const isInitial = previousState === null;

                if (isInitial) {
                    return initialize(previousState, event);
                }

                const handler = actionHandlers[event.action] || actionHandlers.default;

                return handler(previousState, event);
            });
        };

        const updateDocumentPageFromEvent = ({
            action,
            documentPage,
        }: {
            action: EmitterAction;
            documentPage: DocumentPage | { id: number };
        }) => handleEventUpdates({ action, documentPageOrDocumentCategory: documentPage });

        const updateDocumentCategoryFromEvent = ({
            action,
            documentCategory,
        }: {
            action: EmitterAction;
            documentCategory: DocumentCategory | { id: number };
        }) => handleEventUpdates({ action, documentPageOrDocumentCategory: documentCategory });

        window.emitter.on('AppBridge:GuidelineDocumentPageAction', updateDocumentPageFromEvent);
        window.emitter.on('AppBridge:GuidelineDocumentCategoryAction', updateDocumentCategoryFromEvent);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentPageAction', updateDocumentPageFromEvent);
            window.emitter.off('AppBridge:GuidelineDocumentCategoryAction', updateDocumentCategoryFromEvent);
        };
    }, [appBridge, documentId]);

    return { documentCategoriesAndPages };
};

const addItem = (items: PagesAndCategories, itemToAdd: DocumentPage | DocumentCategory) => {
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

const updateItem = (items: PagesAndCategories, itemToUpdate: DocumentPage | DocumentCategory) => {
    const itemsClone = cloneDeep(items);

    const isPageInCategory =
        'categoryId' in itemToUpdate && itemToUpdate.categoryId !== null && itemToUpdate.categoryId !== undefined;

    const updatePageInCategory = () => {
        for (const page of itemsClone) {
            const isCategory = 'documentPages' in page;

            const itShouldUpdate =
                page.id === (itemToUpdate as DocumentPage).categoryId && page.documentId === itemToUpdate.documentId;

            if (isCategory && itShouldUpdate && page.documentPages) {
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
        itemsClone[pageToUpdateIndex] = { ...itemsClone[pageToUpdateIndex], ...itemToUpdate };
    }

    return itemsClone;
};

const deleteItem = (items: PagesAndCategories, itemToDelete: { id: number }) => {
    const filteredItems = items.filter((item) => item.id !== itemToDelete.id);

    return filteredItems.map((item) => {
        if ('documentPages' in item && item.documentPages) {
            item.documentPages = deleteItem(item.documentPages, itemToDelete) as DocumentPage[];
        }

        return item;
    });
};

const isInvalidDocument = (eventItem: DocumentPage | DocumentCategory | { id: number }, sourceDocumentId: number) => {
    if ('documentId' in eventItem) {
        return eventItem.documentId !== sourceDocumentId;
    }

    return false;
};

const actionHandlers = {
    add: (items: PagesAndCategories, event: Event) =>
        addItem(items, event.documentPageOrDocumentCategory as DocumentPage | DocumentCategory),

    update: (items: PagesAndCategories, event: Event) =>
        updateItem(items, event.documentPageOrDocumentCategory as DocumentPage | DocumentCategory),

    delete: (items: PagesAndCategories, event: Event) =>
        deleteItem(items, event.documentPageOrDocumentCategory as { id: number }),

    default: (items: PagesAndCategories) => items,
};

const initialize = (previousState: Nullable<PagesAndCategories>, event: Event) => {
    if (event.action === 'update' || event.action === 'add') {
        return [event.documentPageOrDocumentCategory as DocumentPage | DocumentCategory];
    }

    return previousState;
};
