/* (c) Copyright Frontify Ltd., all rights reserved. */

import { DocumentSection } from '@frontify/app-bridge';
import { useEffect, useState } from 'react';

export const useDocumentSection = (
    getDocumentSectionsByDocumentPageId: (documentPageId: number) => Promise<DocumentSection[]>,
    documentPageId: number,
) => {
    const [documentSections, setDocumentSections] = useState<DocumentSection[]>([]);

    useEffect(() => {
        const fetchDocumentSection = async (documentPageId: number) => {
            setDocumentSections(await getDocumentSectionsByDocumentPageId(documentPageId));
        };

        fetchDocumentSection(documentPageId);
    }, [getDocumentSectionsByDocumentPageId, documentPageId]);

    return { documentSections };
};
