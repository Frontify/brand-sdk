/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DispatchHandlerParameter } from '../../AppBridge';

import { type CommandRegistry } from './CommandRegistry';

export const openLinkChooser = (
    options: CommandRegistry['openLinkChooser'],
): DispatchHandlerParameter<'openLinkChooser', CommandRegistry> => ({
    name: 'openLinkChooser',
    payload: options,
});

export const closeLinkChooser = (): DispatchHandlerParameter<'closeLinkChooser', CommandRegistry> => ({
    name: 'closeLinkChooser',
});
