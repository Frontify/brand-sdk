/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';
import { AppBridgeTheme } from '../AppBridgeTheme';
import { Targets } from '../types';

export type UseDocumentPageTargetsReturnType = {
    documentPageTargets: Targets;
    updateDocumentPageTargets: (data: string[], ids: number[]) => void;
};

export const useDocumentPageTargets = (appBridge: AppBridgeTheme, id: number): UseDocumentPageTargetsReturnType => {
    const [documentPageTargets, setDocumentPageTargets] = useState<Targets>([]);

    useEffect(() => {
        const fetchDocumentPageTargets = async () => {
            setDocumentPageTargets(await appBridge.getDocumentPageTargets(id));
        };

        fetchDocumentPageTargets();
    }, [appBridge, id]);

    const updateDocumentPageTargets = async (data: string[], ids: number[]) => {
        await appBridge.updateDocumentPageTargets(data, ids);
    };

    return { documentPageTargets, updateDocumentPageTargets };
};
