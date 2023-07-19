/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { DispatchHandler } from '../types';

export const openTemplateChooser = (): DispatchHandler<'openTemplateChooser'> => ({
    name: 'openTemplateChooser',
    options: undefined,
});

export const closeTemplateChooser = (): DispatchHandler<'closeTemplateChooser'> => ({
    name: 'closeTemplateChooser',
    options: undefined,
});
