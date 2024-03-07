/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import type { AppBridgeTheme } from '../AppBridgeTheme';
import { DocumentPageUpdate } from 'src';

export const useDocumentPage = <DocumentPage>(appBridge: AppBridgeTheme, documentPageId: number) => {
    const [documentPage, setDocumentPage] = useState<DocumentPage | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const updateDocumentPage = async (documentPageUpdate: DocumentPageUpdate) => {
        setDocumentPage((await appBridge.updateDocumentPage(documentPageUpdate)) as DocumentPage);
    };

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            setDocumentPage((await appBridge.getDocumentPageById(documentPageId)) as DocumentPage);
            setIsLoading(false);
        })();
    }, [appBridge, documentPageId]);

    return {
        documentPage,
        updateDocumentPage,
        isLoading,
    };
};
