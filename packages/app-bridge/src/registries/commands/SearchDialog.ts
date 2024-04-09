/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DispatchHandlerParameter } from '../../AppBridge';

import { type CommandRegistry } from './CommandRegistry';

export const openSearchDialog = (): DispatchHandlerParameter<'openSearchDialog', CommandRegistry> => ({
    name: 'openSearchDialog',
});

export const closeSearchDialog = (): DispatchHandlerParameter<'closeSearchDialog', CommandRegistry> => ({
    name: 'closeSearchDialog',
});
