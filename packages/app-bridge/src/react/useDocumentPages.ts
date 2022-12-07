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
        const updatePageFromEvent = (event: { page: DocumentPage | DocumentCategory; action: EmitterAction }) => {
            setDocumentPages((previousState) => {
                const isInitial = previousState === null;

                if (isInitial) {
                    return event.action === 'update' || event.action === 'add' ? [event.page] : previousState;
                }

                if (event.action === 'delete') {
                    return previousState.filter((document) => document.id !== event.page.id);
                }

                if (event.action === 'add') {
                    return addPage(previousState, event.page);
                }

                if (event.action === 'update') {
                    return updatePage(previousState, event.page);
                }

                return previousState;
            });
        };

        window.emitter.on('AppBridge:GuidelineDocumentPageUpdate', updatePageFromEvent);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentPageUpdate', updatePageFromEvent);
        };
    }, [appBridge]);

    return [documentPages];
};

const addPage = (pages: (DocumentPage | DocumentCategory)[], pageToAdd: DocumentPage | DocumentCategory) => {
    const pagesClone = cloneDeep(pages);

    const isPageInCategory = 'categoryId' in pageToAdd && pageToAdd.categoryId !== null;

    const addPageToCategory = () => {
        for (const page of pagesClone) {
            if (
                page.id === (pageToAdd as DocumentPage).categoryId &&
                page.documentId === pageToAdd.documentId &&
                'documentPages' in page
            ) {
                page.documentPages
                    ? page.documentPages.push(pageToAdd as DocumentPage)
                    : (page.documentPages = [pageToAdd as DocumentPage]);

                break;
            }
        }
    };

    isPageInCategory ? addPageToCategory() : pagesClone.push(pageToAdd);

    return pagesClone;
};

const updatePage = (
    documents: (DocumentPage | DocumentCategory)[],
    documentToUpdate: DocumentPage | DocumentCategory,
) => {
    const pagesClone = cloneDeep(documents);

    const documentToUpdateIndex = pagesClone.findIndex((document) => document.id === documentToUpdate.id);

    pagesClone[documentToUpdateIndex] = documentToUpdate;

    return pagesClone;
};
