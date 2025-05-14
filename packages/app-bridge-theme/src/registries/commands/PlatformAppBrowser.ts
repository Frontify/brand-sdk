/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DispatchHandlerParameter } from '../../types';
import { type CommandRegistry } from '../CommandRegistry';

export const openPlatformAppsDialog = (): DispatchHandlerParameter<'openPlatformAppsDialog', CommandRegistry> => ({
    name: 'openPlatformAppsDialog',
});

export const closePlatformAppsDialog = (): DispatchHandlerParameter<'closePlatformAppsDialog', CommandRegistry> => ({
    name: 'closePlatformAppsDialog',
});
