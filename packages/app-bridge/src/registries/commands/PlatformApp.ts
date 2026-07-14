/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DispatchHandlerParameter } from '../../AppBridge';

import { type CommandRegistry } from './CommandRegistry';

export const openPlatformAppDirect = (
    payload: CommandRegistry['openPlatformAppDirect'],
): DispatchHandlerParameter<'openPlatformAppDirect', CommandRegistry> => ({
    name: 'openPlatformAppDirect',
    payload,
});
