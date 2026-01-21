/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { type DocumentPageTargets } from '../types';

type UseDocumentPageTargetsReturnType = {
    documentPageTargets: Nullable<DocumentPageTargets>;
    isLoading: boolean;
};

export type DocumentPageTargetEvent = {
    action: 'update';
    payload: {
        targets: number[];
        pageIds: number[];
    };
};

export const useDocumentPageTargets = (appBridge: AppBridgeBlock, id: number): UseDocumentPageTargetsReturnType => {
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

    useEffect(() => {
        const handleTargetEventUpdates = (event: DocumentPageTargetEvent) => {
            if (event.payload.pageIds.includes(id)) {
                setDocumentPageTargets((previousState) => updateTargets(previousState, event.payload.targets));
            }
        };

        window.emitter.on('AppBridge:GuidelineDocumentPageTargets:Action', handleTargetEventUpdates);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentPageTargets:Action', handleTargetEventUpdates);
        };
    }, [id]);

    return { documentPageTargets, isLoading };
};

const updateTargets = (prevState: Nullable<DocumentPageTargets>, targetIds: number[]) => {
    if (!prevState) {
        return prevState;
    }
    return {
        ...prevState,
        hasSelectedTargets: targetIds.length > 0,
        targets: prevState.targets.map((target) => ({
            ...target,
            target: { ...target.target, checked: targetIds.includes(target.target.id) },
        })),
    };
};
