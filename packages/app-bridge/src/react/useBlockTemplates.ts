/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { Template } from '../types';
import { compareObjects } from '../utilities';

export const useBlockTemplates = (appBridge: AppBridgeBlock) => {
    const blockId = appBridge.getBlockId();

    const [blockTemplates, setBlockTemplates] = useState<Record<string, Template[]>>({});

    const updateBlockTemplatesFromEvent = (event: {
        blockId: number;
        blockTemplates: Record<string, Template[]>;
        prevBlockTemplates: Record<string, Template[]>;
    }) => {
        if (event.blockId === blockId && !compareObjects(event.blockTemplates, event.prevBlockTemplates)) {
            setBlockTemplates(event.blockTemplates);
        }
    };

    // Fetch the block templates on mount.
    // And add listener for block template updates.
    useEffect(() => {
        let componentMounted = true;

        if (blockId) {
            const mountingFetch = async () => {
                const allBlockTemplates = await appBridge.getBlockTemplates();
                if (componentMounted) {
                    setBlockTemplates(allBlockTemplates);
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
        window.emitter.emit('AppBridge:BlockTemplatesUpdated', {
            blockId,
            blockTemplates: await appBridge.getBlockTemplates(),
            prevBlockTemplates: { ...blockTemplates },
        });
    };

    const updateTemplateIdsFromKey = async (key: string, newTemplateIds: number[]) => {
        const currentBlockTemplates = await appBridge.getBlockTemplates();
        const oldTemplateIds = currentBlockTemplates[key]?.map((template) => template.id) ?? [];

        try {
            await appBridge.deleteTemplateIdsFromBlockTemplateKey(key, oldTemplateIds);
            await appBridge.addTemplateIdsToBlockTemplateKey(key, newTemplateIds);
        } catch (error) {
            console.error(error);
        }

        emitUpdatedBlockTemplates();
    };

    const deleteTemplateIdsFromKey = async (key: string, templateIds: number[]) => {
        await appBridge.deleteTemplateIdsFromBlockTemplateKey(key, templateIds);
        emitUpdatedBlockTemplates();
    };

    const addTemplateIdsToKey = async (key: string, templateIds: number[]) => {
        await appBridge.addTemplateIdsToBlockTemplateKey(key, templateIds);
        emitUpdatedBlockTemplates();
    };

    return {
        blockTemplates,
        addTemplateIdsToKey,
        deleteTemplateIdsFromKey,
        updateTemplateIdsFromKey,
    };
};
