/* (c) Copyright Frontify Ltd., all rights reserved. */

import { closeTemplateChooser, openTemplateChooser } from '../registries/commands/TemplateChooser';
import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { TemplateLegacy } from '../types/TemplateLegacy';
import { EventUnsubscribeFunction } from '../AppBridge';

type UseTemplateChooserType = {
    openTemplateChooser: (callback: (selectedTemplate: TemplateLegacy) => void) => void;
    closeTemplateChooser: () => void;
};

export const useTemplateChooser = (appBridge: AppBridgeBlock): UseTemplateChooserType => {
    let unsubscribe: EventUnsubscribeFunction;
    return {
        openTemplateChooser: (callback) => {
            appBridge.dispatch(openTemplateChooser());
            unsubscribe = appBridge.subscribe('templateChosen', (selectedTemplate) => {
                callback(selectedTemplate.template);
            });
        },
        closeTemplateChooser: () => {
            appBridge.dispatch(closeTemplateChooser());
            unsubscribe?.();
        },
    };
};
