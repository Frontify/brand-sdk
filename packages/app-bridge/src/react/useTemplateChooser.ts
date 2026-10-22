/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useRef } from 'react';

import { type EventUnsubscribeFunction } from '../AppBridge';
import { type AppBridgeBlock } from '../AppBridgeBlock';
import { closeTemplateChooser, openTemplateChooser } from '../registries/commands/TemplateChooser';
import { type TemplateLegacy } from '../types/TemplateLegacy';

type UseTemplateChooserType = {
    openTemplateChooser: (callback: (selectedTemplate: TemplateLegacy) => void) => void;
    closeTemplateChooser: () => void;
};

export const useTemplateChooser = (appBridge: AppBridgeBlock): UseTemplateChooserType => {
    const unsubscribeRef = useRef<EventUnsubscribeFunction>();

    useEffect(() => {
        return () => {
            unsubscribeRef.current?.();
            unsubscribeRef.current = undefined;
        };
    }, []);

    const handleOpenTemplateChooser = useCallback(
        (callback: (selectedTemplate: TemplateLegacy) => void) => {
            unsubscribeRef.current?.();
            appBridge.dispatch(openTemplateChooser());
            unsubscribeRef.current = appBridge.subscribe('templateChosen', (selectedTemplate) => {
                callback(selectedTemplate.template);
            });
        },
        [appBridge],
    );

    const handleCloseTemplateChooser = useCallback(() => {
        appBridge.dispatch(closeTemplateChooser());
        unsubscribeRef.current?.();
        unsubscribeRef.current = undefined;
    }, [appBridge]);

    return {
        openTemplateChooser: handleOpenTemplateChooser,
        closeTemplateChooser: handleCloseTemplateChooser,
    };
};
