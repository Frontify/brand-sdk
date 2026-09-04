/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DispatchHandlerParameter } from '../../AppBridge';

import { type CommandRegistry } from './CommandRegistry';

export const openBrandCheck = (
    payload?: CommandRegistry['openBrandCheck'],
): DispatchHandlerParameter<'openBrandCheck', CommandRegistry> => ({
    name: 'openBrandCheck',
    payload,
});
