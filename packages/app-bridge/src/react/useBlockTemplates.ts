/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useState, useSyncExternalStore } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { type Template } from '../types';

// One shared object, so a host without templates in its context doesn't give `useSyncExternalStore` a new snapshot on every read.
const NO_BLOCK_TEMPLATES: Record<string, Template[]> = {};

export const useBlockTemplates = (appBridge: AppBridgeBlock) => {
    // `context()` returns a new object on every call, so keep `subscribe` stable to avoid resubscribing on every render.
    const subscribe = useCallback(
        (onStoreChange: () => void) => appBridge.context('templates').subscribe(onStoreChange),
        [appBridge],
    );
    const getSnapshot = useCallback(() => appBridge.context('templates').get() ?? NO_BLOCK_TEMPLATES, [appBridge]);
    const blockTemplates = useSyncExternalStore(subscribe, getSnapshot);

    const [error, setError] = useState<string | null>(null);

    const handleErrorMessage = useCallback((error: unknown) => {
        let errorMessage;

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        } else {
            errorMessage = String(error);
        }

        setError(errorMessage);
    }, []);

    // The host updates `context('templates')` once a change is saved, so the functions below don't refetch the templates.
    const updateTemplateIdsFromKey = useCallback(
        async (key: string, newTemplateIds: number[]) => {
            const oldTemplates = appBridge.context('templates').get()?.[key] ?? [];
            const oldTemplateIds = oldTemplates.map((template) => template.id);

            try {
                if (oldTemplateIds.length > 0) {
                    await appBridge.deleteTemplateIdsFromBlockTemplateKey(key, oldTemplateIds);
                }
                await appBridge.addTemplateIdsToBlockTemplateKey(key, newTemplateIds);
            } catch (error) {
                handleErrorMessage(error);
            }
        },
        [appBridge, handleErrorMessage],
    );

    const deleteTemplateIdsFromKey = useCallback(
        async (key: string, templateIds: number[]) => {
            try {
                await appBridge.deleteTemplateIdsFromBlockTemplateKey(key, templateIds);
            } catch (error) {
                handleErrorMessage(error);
            }
        },
        [appBridge, handleErrorMessage],
    );

    const addTemplateIdsToKey = useCallback(
        async (key: string, templateIds: number[]) => {
            try {
                await appBridge.addTemplateIdsToBlockTemplateKey(key, templateIds);
            } catch (error) {
                handleErrorMessage(error);
            }
        },
        [appBridge, handleErrorMessage],
    );

    return {
        blockTemplates,
        addTemplateIdsToKey,
        deleteTemplateIdsFromKey,
        updateTemplateIdsFromKey,
        error,
    };
};
