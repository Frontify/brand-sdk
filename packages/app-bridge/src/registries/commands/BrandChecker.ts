/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DispatchHandlerParameter } from '../../AppBridge';

import { type CommandRegistry } from './CommandRegistry';

export const openBrandChecker = (
    payload: CommandRegistry['openBrandChecker'],
): DispatchHandlerParameter<'openBrandChecker', CommandRegistry> => ({
    name: 'openBrandChecker',
    payload,
});
