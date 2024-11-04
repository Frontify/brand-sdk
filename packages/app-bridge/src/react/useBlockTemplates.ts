/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { type Template } from '../types';
import { compareObjects } from '../utilities';

export const useBlockTemplates = (appBridge: AppBridgeBlock) => {
    const blockId = appBridge.context('blockId').get();

    const [blockTemplates, setBlockTemplates] = useState<Record<string, Template[]>>({});
    const [error, setError] = useState<string | null>(null);

    const updateBlockTemplatesFromEvent = (event: {
        blockId: number;
        blockTemplates: Record<string, Template[]>;
        prevBlockTemplates: Record<string, Template[]>;
    }) => {
        if (event.blockId === blockId && !compareObjects(event.blockTemplates, event.prevBlockTemplates)) {
            setBlockTemplates(event.blockTemplates);
        }
    };

    const handleErrorMessage = (error: unknown) => {
        let errorMessage;

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        } else {
            errorMessage = String(error);
        }

        setError(errorMessage);
    };

    // Fetch the block templates on mount.
    // And add listener for block template updates.
    useEffect(() => {
        let componentMounted = true;

        if (blockId) {
            const mountingFetch = async () => {
                try {
                    const result = await appBridge.getBlockTemplates();
                    if (componentMounted) {
                        setBlockTemplates(result);
                    }
                } catch (error) {
                    handleErrorMessage(error);
                }
            };

            mountingFetch();
            window.emitter.on('AppBridge:BlockTemplatesUpdated', updateBlockTemplatesFromEvent);
        }

        return () => {
            componentMounted = false;
            window.emitter.off('AppBridge:BlockTemplatesUpdated', updateBlockTemplatesFromEvent);
        };
    }, [appBridge]);

    const emitUpdatedBlockTemplates = async () => {
        let fetchedBlockTemplates;

        try {
            fetchedBlockTemplates = await appBridge.getBlockTemplates();
        } catch (error) {
            handleErrorMessage(error);
        }

        if (fetchedBlockTemplates) {
            window.emitter.emit('AppBridge:BlockTemplatesUpdated', {
                blockId,
                blockTemplates: fetchedBlockTemplates,
                prevBlockTemplates: { ...blockTemplates },
            });
        }
    };

    const updateTemplateIdsFromKey = async (key: string, newTemplateIds: number[]) => {
        const currentBlockTemplates = await appBridge.getBlockTemplates();
        const oldTemplateIds = currentBlockTemplates[key]?.map((template) => template.id) ?? [];

        try {
            if (oldTemplateIds.length > 0) {
                await appBridge.deleteTemplateIdsFromBlockTemplateKey(key, oldTemplateIds);
            }
            await appBridge.addTemplateIdsToBlockTemplateKey(key, newTemplateIds);
        } catch (error) {
            handleErrorMessage(error);
        }

        emitUpdatedBlockTemplates();
    };

    const deleteTemplateIdsFromKey = async (key: string, templateIds: number[]) => {
        try {
            await appBridge.deleteTemplateIdsFromBlockTemplateKey(key, templateIds);
        } catch (error) {
            handleErrorMessage(error);
        }

        emitUpdatedBlockTemplates();
    };

    const addTemplateIdsToKey = async (key: string, templateIds: number[]) => {
        try {
            await appBridge.addTemplateIdsToBlockTemplateKey(key, templateIds);
        } catch (error) {
            handleErrorMessage(error);
        }

        emitUpdatedBlockTemplates();
    };

    return {
        blockTemplates,
        addTemplateIdsToKey,
        deleteTemplateIdsFromKey,
        updateTemplateIdsFromKey,
        error,
    };
};
