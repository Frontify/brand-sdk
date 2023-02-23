/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import { AppBridgeTheme } from '../AppBridgeTheme';
import { DocumentTargets } from '../types';

export type UseDocumentTargetsReturnType = {
    documentTargets: Nullable<DocumentTargets>;
    updateDocumentTargets: (targetIds: number[], documentIds: number[]) => void;
    isLoading: boolean;
};

export const useDocumentTargets = (appBridge: AppBridgeTheme, id: number): UseDocumentTargetsReturnType => {
    const [documentTargets, setDocumentTargets] = useState<Nullable<DocumentTargets>>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchDocumentTargets = async () => {
            setIsLoading(true);
            setDocumentTargets(await appBridge.getDocumentTargets(id));
            setIsLoading(false);
        };

        fetchDocumentTargets();
    }, [appBridge, id]);

    const updateDocumentTargets = async (targetIds: number[], documentIds: number[]) => {
        await appBridge.updateDocumentTargets(targetIds, documentIds);
    };

    return { documentTargets, updateDocumentTargets, isLoading };
};
