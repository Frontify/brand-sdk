/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { DispatchHandlerParameter } from '../../AppBridge';
import type { CommandRegistry } from './CommandRegistry';

export const openNewPublication = (
    payload: CommandRegistry['openNewPublication'],
): DispatchHandlerParameter<'openNewPublication', CommandRegistry> => ({
    name: 'openNewPublication',
    payload,
});
