/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { Template } from '../types/Template';

type UseTemplateChooserType = {
    openTemplateChooser: (callback: (selectedTemplate: Template) => void) => void;
    closeTemplateChooser: () => void;
};

export const useTemplateChooser = (appBridge: AppBridgeBlock): UseTemplateChooserType => {
    return {
        openTemplateChooser: appBridge.openTemplateChooser.bind(appBridge),
        closeTemplateChooser: appBridge.closeTemplateChooser.bind(appBridge),
    };
};
