/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DispatchHandlerParameter } from '../../AppBridge';

import { type CommandRegistry } from './CommandRegistry';

export const openColorChooser = (
    options: CommandRegistry['openColorChooser'],
): DispatchHandlerParameter<'openColorChooser', CommandRegistry> => ({
    name: 'openColorChooser',
    payload: options,
});

export const closeColorChooser = (
    options: CommandRegistry['closeColorChooser'],
): DispatchHandlerParameter<'closeColorChooser', CommandRegistry> => ({
    name: 'closeColorChooser',
    payload: options,
});
