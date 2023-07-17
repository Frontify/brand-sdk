/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { DispatchHandler } from '../types';

export const openTemplateChooser = (): DispatchHandler<'openTemplateChooser'> => ({
    name: 'openTemplateChooser',
});

export const closeTemplateChooser = (): DispatchHandler<'closeTemplateChooser'> => ({
    name: 'closeTemplateChooser',
});
