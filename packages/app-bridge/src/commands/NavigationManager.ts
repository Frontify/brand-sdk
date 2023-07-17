/* (c) Copyright Frontify Ltd., all rights reserved. */

import { DispatchHandler } from '../types';

export const openNavigationManager = (): DispatchHandler<'openNavigationManager'> => ({
    name: 'openNavigationManager',
});
