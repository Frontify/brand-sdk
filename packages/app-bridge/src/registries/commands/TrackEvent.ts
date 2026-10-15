/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DispatchHandlerParameter } from '../../AppBridge';

import { type CommandRegistry } from './CommandRegistry';

export const trackEvent = (
    payload: CommandRegistry['trackEvent'],
): DispatchHandlerParameter<'trackEvent', CommandRegistry> => ({
    name: 'trackEvent',
    payload,
});
