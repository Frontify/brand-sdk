/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { DocumentSection } from '../types';
import { AppBridgePlatformApp } from '../AppBridgePlatformApp';

export const useDocumentSection = (
    appBridge: AppBridgeBlock | AppBridgeTheme | AppBridgePlatformApp,
    documentPageId: number,
) => {
    const [documentSections, setDocumentSections] = useState<DocumentSection[]>([]);

    useEffect(() => {
        const fetchDocumentSection = async (documentPageId: number) => {
            setDocumentSections(await appBridge.getDocumentSectionsByDocumentPageId(documentPageId));
        };

        fetchDocumentSection(documentPageId);
    }, [appBridge, documentPageId]);

    return { documentSections };
};
