/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Document, type DocumentPage, type DocumentSection } from '@frontify/app-bridge';
import { type ReactElement, useEffect, useState } from 'react';

import { filterDocumentSectionsWithUnreadableTitles } from '../helpers/filterDocumentSectionsWithUnreadableTitles';
import { type InitiallyExpandedItems } from '../types';

import { DocumentLink } from './DocumentLink';
import { LoadingIndicator } from './LoadingIndicator';

type DocumentLinksProps = {
    selectedUrl: string;
    onSelectUrl: (url: string) => void;
    getAllDocuments: () => Promise<Document[]>;
    getDocumentSectionsByDocumentPageId: (documentPageId: number) => Promise<DocumentSection[]>;
    getDocumentPagesByDocumentId: (documentId: number) => Promise<DocumentPage[]>;
};

export const DocumentLinks = ({
    selectedUrl,
    onSelectUrl,
    getAllDocuments,
    getDocumentPagesByDocumentId,
    getDocumentSectionsByDocumentPageId,
}: DocumentLinksProps): ReactElement => {
    const [isLoading, setIsLoading] = useState(true);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [itemsToExpandInitially, setItemsToExpandInitially] = useState<InitiallyExpandedItems>({
        documentId: undefined,
        pageId: undefined,
    });

    useEffect(() => {
        if (selectedUrl && documents.length > 0) {
            findLocationOfSelectedUrl().then((items) => {
                setItemsToExpandInitially(items);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [documents.length]);

    useEffect(() => {
        getAllDocuments()
            .then((_documents) => {
                setDocuments(_documents);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const findLocationOfSelectedUrl = async () => {
        const itemsToExpand: InitiallyExpandedItems = {
            documentId: undefined,
            pageId: undefined,
        };
        const selectedUrlIsDocument = documents.find((document) => document.permanentLink === selectedUrl);
        if (selectedUrlIsDocument) {
            return itemsToExpand;
        }
        for (const document of documents) {
            const pages = await getDocumentPagesByDocumentId(document.id);
            const selectedUrlIsPage = !!pages.find((page) => page.permanentLink === selectedUrl);
            if (selectedUrlIsPage) {
                itemsToExpand.documentId = document.id;
                return itemsToExpand;
            }
            for (const page of pages) {
                const sections = await getDocumentSectionsByDocumentPageId(page.id);
                const sectionsWithReadableTitles = filterDocumentSectionsWithUnreadableTitles(sections);
                const selectedUrlIsSection = !!sectionsWithReadableTitles.find(
                    (section) => section.permanentLink === selectedUrl,
                );
                if (selectedUrlIsSection) {
                    itemsToExpand.documentId = document.id;
                    itemsToExpand.pageId = page.id;
                    return itemsToExpand;
                }
            }
        }
        return itemsToExpand;
    };

    return isLoading ? (
        <LoadingIndicator />
    ) : (
        <>
            {documents.map((document) => {
                return (
                    <DocumentLink
                        key={document.id}
                        document={document}
                        selectedUrl={selectedUrl}
                        onSelectUrl={onSelectUrl}
                        itemsToExpandInitially={itemsToExpandInitially}
                        getDocumentSectionsByDocumentPageId={getDocumentSectionsByDocumentPageId}
                        getDocumentPagesByDocumentId={getDocumentPagesByDocumentId}
                    />
                );
            })}
        </>
    );
};
