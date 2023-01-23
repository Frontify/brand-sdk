/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';
import { AppBridgeTheme } from '../AppBridgeTheme';
import { Targets } from '../types';

export type UseDocumentTargetsReturnType = {
    documentTargets: Targets;
    updateDocumentTargets: (targetIds: number[], documentIds: number[]) => void;
};

export const useDocumentTargets = (appBridge: AppBridgeTheme, id: number): UseDocumentTargetsReturnType => {
    const [documentTargets, setDocumentTargets] = useState<Targets>([]);

    useEffect(() => {
        const fetchDocumentTargets = async () => {
            setDocumentTargets(await appBridge.getDocumentTargets(id));
        };

        fetchDocumentTargets();
    }, [appBridge, id]);

    const updateDocumentTargets = async (targetIds: number[], documentIds: number[]) => {
        await appBridge.updateDocumentTargets(targetIds, documentIds);
    };

    return { documentTargets, updateDocumentTargets };
};
