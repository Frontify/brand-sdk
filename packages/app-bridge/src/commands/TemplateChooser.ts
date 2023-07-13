/* (c) Copyright Frontify Ltd., all rights reserved. */

import { DispatchHandler } from '../types';

export const openTemplateChooser = (): DispatchHandler<'openTemplateChooser'> => ({
    commandName: 'openTemplateChooser',
});

export const closeTemplateChooser = (): DispatchHandler<'closeTemplateChooser'> => ({
    commandName: 'closeTemplateChooser',
});
