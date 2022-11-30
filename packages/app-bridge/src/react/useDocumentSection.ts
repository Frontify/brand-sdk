/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { DocumentSection } from '../types';

export const useDocumentSection = (appBridge: AppBridgeTheme, documentPageId: number) => {
    const [documentSections, setDocumentSections] = useState<DocumentSection[]>([]);

    useEffect(() => {
        const fetchDocumentSection = async (documentPageId: number) => {
            setDocumentSections(await appBridge.getDocumentSectionsByDocumentPageId(documentPageId));
        };

        fetchDocumentSection(documentPageId);
    }, [appBridge, documentPageId]);

    return { documentSections };
};
