/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { AppBridgeBlock } from '../AppBridgeBlock';
import { closeTemplateChooser, openTemplateChooser } from '../dispatch';
import type { TemplateLegacy } from '../types/TemplateLegacy';

type UseTemplateChooserType = {
    openTemplateChooser: (callback: (selectedTemplate: TemplateLegacy) => void) => void;
    closeTemplateChooser: () => void;
};

export const useTemplateChooser = (appBridge: AppBridgeBlock): UseTemplateChooserType => {
    return {
        openTemplateChooser: (callback) => {
            appBridge.dispatch(openTemplateChooser());
            appBridge.subscribe('templateChosen', callback);
        },
        closeTemplateChooser: () => {
            appBridge.dispatch(closeTemplateChooser());
        },
    };
};
