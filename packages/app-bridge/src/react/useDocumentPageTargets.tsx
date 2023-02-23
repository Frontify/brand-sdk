/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import { AppBridgeTheme } from '../AppBridgeTheme';
import { DocumentPageTargets } from '../types';

export type UseDocumentPageTargetsReturnType = {
    documentPageTargets: Nullable<DocumentPageTargets>;
    updateDocumentPageTargets: (targetIds: number[], documentIds: number[]) => void;
    isLoading: boolean;
};

export const useDocumentPageTargets = (appBridge: AppBridgeTheme, id: number): UseDocumentPageTargetsReturnType => {
    const [documentPageTargets, setDocumentPageTargets] = useState<Nullable<DocumentPageTargets>>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchDocumentPageTargets = async () => {
            setIsLoading(true);
            setDocumentPageTargets(await appBridge.getDocumentPageTargets(id));
            setIsLoading(false);
        };

        fetchDocumentPageTargets();
    }, [appBridge, id]);

    const updateDocumentPageTargets = async (targetIds: number[], documentIds: number[]) => {
        await appBridge.updateDocumentPageTargets(targetIds, documentIds);
    };

    return { documentPageTargets, updateDocumentPageTargets, isLoading };
};
