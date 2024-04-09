/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DispatchHandlerParameter } from '../../AppBridge';

import { type CommandRegistry } from './CommandRegistry';

export const downloadAsset = (
    asset: CommandRegistry['downloadAsset'],
): DispatchHandlerParameter<'downloadAsset', CommandRegistry> => ({
    name: 'downloadAsset',
    payload: asset,
});
