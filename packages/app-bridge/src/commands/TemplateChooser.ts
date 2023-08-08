/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { DispatchHandlerParameter } from '../AppBridge';
import type { CommandRegistry } from './CommandRegistry';

export const openTemplateChooser = (): DispatchHandlerParameter<'openTemplateChooser', CommandRegistry> => ({
    name: 'openTemplateChooser',
});

export const closeTemplateChooser = (): DispatchHandlerParameter<'closeTemplateChooser', CommandRegistry> => ({
    name: 'closeTemplateChooser',
});
