/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import { AppBridgeTheme } from '../AppBridgeTheme';
import { DocumentTargets } from '../types';

export type UseDocumentTargetsReturnType = {
    documentTargets: Nullable<DocumentTargets>;
    isLoading: boolean;
};

type DocumentTargetEvent = {
    action: 'update';
    targets: number[];
    documentIds: number[];
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

    useEffect(() => {
        const handleTargetEventUpdates = (event: DocumentTargetEvent) => {
            setDocumentTargets((previousState) => {
                const action: 'update-targets' = `${event.action}-targets`;

                const handler = event.documentIds.includes(id) ? actionHandlers[action] : actionHandlers.default;

                return handler(previousState, event.targets);
            });
        };

        window.emitter.on('AppBridge:GuidelineDocumentTargetsAction', handleTargetEventUpdates);
        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentTargetsAction', handleTargetEventUpdates);
        };
    }, [id]);

    return { documentTargets, isLoading };
};

const updateTargets = (prevState: Nullable<DocumentTargets>, targetIds: number[]) =>
    prevState
        ? {
              ...prevState,
              hasSelectedTargets: targetIds.length > 0,
              targets: prevState.targets.map((target) => ({
                  ...target,
                  target: { ...target.target, checked: targetIds.includes(target.target.id) },
              })),
          }
        : null;

const actionHandlers = {
    'update-targets': updateTargets,
    default: (targets: Nullable<DocumentTargets>) => targets,
};
