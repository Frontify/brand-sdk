/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';
import { AppBridgeTheme } from '../AppBridgeTheme';
import { Targets } from '../types';

export type UseDocumentPageTargetsReturnType = {
    documentPageTargets: Targets;
    updateDocumentPageTargets: (targetIds: string[], documentIds: number[]) => void;
};

export const useDocumentPageTargets = (appBridge: AppBridgeTheme, id: number): UseDocumentPageTargetsReturnType => {
    const [documentPageTargets, setDocumentPageTargets] = useState<Targets>([]);

    useEffect(() => {
        const fetchDocumentPageTargets = async () => {
            setDocumentPageTargets(await appBridge.getDocumentPageTargets(id));
        };

        fetchDocumentPageTargets();
    }, [appBridge, id]);

    const updateDocumentPageTargets = async (targetIds: string[], documentIds: number[]) => {
        await appBridge.updateDocumentPageTargets(targetIds, documentIds);
    };

    return { documentPageTargets, updateDocumentPageTargets };
};
