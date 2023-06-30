/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AppBridgeBlock, Document } from '@frontify/app-bridge';
import { LoadingCircle } from '@frontify/fondue';
import { ReactElement, useEffect, useState } from 'react';
import { InitiallyExpandedItems } from '../../LinkPlugin/FloatingLink/InsertLinkModal/types';
import { DocumentLink } from './DocumentLink';

type DocumentLinksProps = {
    appBridge: AppBridgeBlock;
    selectedUrl: string;
    onSelectUrl: (url: string) => void;
};

export const DocumentLinks = ({ appBridge, selectedUrl, onSelectUrl }: DocumentLinksProps): ReactElement => {
    const [isLoading, setIsLoading] = useState(true);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [itemsToExpandInitially, setItemsToExpandInitially] = useState<InitiallyExpandedItems>({
        documentId: undefined,
        pageId: undefined,
    });

    const documentArray = [...documents.values()];

    useEffect(() => {
        if (selectedUrl && documentArray.length > 0) {
            findLocationOfSelectedUrl().then((items) => {
                setItemsToExpandInitially(items);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [documentArray.length]);

    useEffect(() => {
        appBridge
            .getAllDocuments()
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
        const selectedUrlIsDocument = documentArray.find((document) => document.permanentLink === selectedUrl);
        if (selectedUrlIsDocument) {
            return itemsToExpand;
        }
        for (const document of documentArray) {
            const pages = await appBridge.getDocumentPagesByDocumentId(document.id);
            appBridge.getAllDocuments();
            const pagesArray = [...pages.values()];
            const selectedUrlIsPage = !!pagesArray.find((page) => page.permanentLink === selectedUrl);
            if (selectedUrlIsPage) {
                itemsToExpand.documentId = document.id;
                return itemsToExpand;
            }
            for (const page of pagesArray) {
                const sections = await appBridge.getDocumentSectionsByDocumentPageId(page.id);
                const sectionsArray = [...sections.values()];
                const selectedUrlIsSection = !!sectionsArray.find((section) => section.permanentLink === selectedUrl);
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
        <div className="tw-flex tw-justify-center tw-p-4">
            <LoadingCircle />
        </div>
    ) : (
        <>
            {documentArray.map((document) => {
                return (
                    <DocumentLink
                        key={document.id}
                        document={document}
                        appBridge={appBridge}
                        selectedUrl={selectedUrl}
                        onSelectUrl={onSelectUrl}
                        itemsToExpandInitially={itemsToExpandInitially}
                    />
                );
            })}
        </>
    );
};
