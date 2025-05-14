/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DispatchHandlerParameter } from '../../types';
import { type CommandRegistry } from '../CommandRegistry';

export const openPlatformAppBrowser = (): DispatchHandlerParameter<'openPlatformAppBrowser', CommandRegistry> => ({
    name: 'openPlatformAppBrowser',
});

export const closePlatformAppBrowser = (): DispatchHandlerParameter<'closePlatformAppBrowser', CommandRegistry> => ({
    name: 'closePlatformAppBrowser',
});
