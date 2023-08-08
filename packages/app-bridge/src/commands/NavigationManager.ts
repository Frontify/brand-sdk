/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { DispatchHandlerParameter } from '../AppBridge';
import type { CommandRegistry } from './CommandRegistry';

export const openNavigationManager = (): DispatchHandlerParameter<'openNavigationManager', CommandRegistry> => ({
    name: 'openNavigationManager',
});
