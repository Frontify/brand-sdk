/* (c) Copyright Frontify Ltd., all rights reserved. */

import { closeTemplateChooser, openTemplateChooser } from '..';
import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { TemplateLegacy } from '../types/TemplateLegacy';

type UseTemplateChooserType = {
    openTemplateChooser: (callback: (selectedTemplate: TemplateLegacy) => void) => void;
    closeTemplateChooser: () => void;
};

export const useTemplateChooser = (appBridge: AppBridgeBlock): UseTemplateChooserType => {
    return {
        openTemplateChooser: (callback) => {
            appBridge.dispatch(openTemplateChooser());
            appBridge.subscribe('templateChosen', (selectedTemplate) => {
                callback(selectedTemplate.template);
            });
        },
        closeTemplateChooser: () => {
            appBridge.dispatch(closeTemplateChooser());
        },
    };
};
