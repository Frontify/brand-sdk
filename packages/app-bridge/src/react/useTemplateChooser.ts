/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type EventUnsubscribeFunction } from '../AppBridge';
import { type AppBridgeBlock } from '../AppBridgeBlock';
import { closeTemplateChooser, openTemplateChooser } from '../registries/commands/TemplateChooser';
import { type TemplateLegacy } from '../types/TemplateLegacy';

type UseTemplateChooserType = {
    openTemplateChooser: (callback: (selectedTemplate: TemplateLegacy) => void) => void;
    closeTemplateChooser: () => void;
};

// eslint-disable-next-line @eslint-react/no-unnecessary-use-prefix
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
