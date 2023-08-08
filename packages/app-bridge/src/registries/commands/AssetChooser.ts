/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { DispatchHandlerParameter } from '../../AppBridge';
import type { CommandRegistry } from './CommandRegistry';

export const openAssetChooser = (
    options?: CommandRegistry['openAssetChooser'],
): DispatchHandlerParameter<'openAssetChooser', CommandRegistry> => ({
    name: 'openAssetChooser',
    payload: options,
});

export const closeAssetChooser = (): DispatchHandlerParameter<'closeAssetChooser', CommandRegistry> => ({
    name: 'closeAssetChooser',
});
