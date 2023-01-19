/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';
import { AppBridgeTheme } from '../AppBridgeTheme';
import { Targets } from '../types';

export type UseTargetsReturnType = {
    documentTargets: Targets;
    updateDocumentTargets: (data: string[], ids: number[]) => void;
    documentPageTargets: Targets;
    updateDocumentPageTargets: (data: string[], ids: number[]) => void;
};

export const useTargets = (appBridge: AppBridgeTheme, id: number): UseTargetsReturnType => {
    const [documentTargets, setDocumentTargets] = useState<Targets>([]);
    const [documentPageTargets, setDocumentPageTargets] = useState<Targets>([]);

    useEffect(() => {
        const fetchDocumentTargets = async () => {
            setDocumentTargets(await appBridge.getDocumentTargets(id));
        };

        const fetchDocumentPageTargets = async () => {
            setDocumentPageTargets(await appBridge.getDocumentPageTargets(id));
        };

        fetchDocumentTargets();
        fetchDocumentPageTargets();
    }, [appBridge, id]);

    const updateDocumentTargets = async (data: string[], ids: number[]) => {
        await appBridge.updateDocumentTargets(data, ids);
    };

    const updateDocumentPageTargets = async (data: string[], ids: number[]) => {
        await appBridge.updateDocumentPageTargets(data, ids);
    };

    return { documentTargets, updateDocumentTargets, documentPageTargets, updateDocumentPageTargets };
};
