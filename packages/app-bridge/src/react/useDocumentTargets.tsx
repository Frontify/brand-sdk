/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { type DocumentTargets } from '../types';

export type UseDocumentTargetsReturnType = {
    documentTargets: Nullable<DocumentTargets>;
    isLoading: boolean;
};

type DocumentTargetEvent = {
    action: 'update';
    payload: {
        targets: number[];
        documentIds: number[];
    };
};

export const useDocumentTargets = (appBridge: AppBridgeBlock, id: number): UseDocumentTargetsReturnType => {
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

    useEffect(() => {
        const handleTargetEventUpdates = (event: DocumentTargetEvent) => {
            if (event.payload.documentIds.includes(id)) {
                setDocumentTargets((previousState) => updateTargets(previousState, event.payload.targets));
            }
        };

        window.emitter.on('AppBridge:GuidelineDocumentTargets:Action', handleTargetEventUpdates);
        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentTargets:Action', handleTargetEventUpdates);
        };
    }, [id]);

    return { documentTargets, isLoading };
};

const updateTargets = (prevState: Nullable<DocumentTargets>, targetIds: number[]) => {
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
