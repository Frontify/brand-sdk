/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { DispatchHandler } from '../types';

export const openNavigationManager = (): DispatchHandler<'openNavigationManager'> => ({
    name: 'openNavigationManager',
    options: undefined,
});
