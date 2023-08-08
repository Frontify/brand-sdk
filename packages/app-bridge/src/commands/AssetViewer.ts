/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { DispatchHandlerParameter } from '../AppBridge';
import type { CommandRegistry } from './CommandRegistry';

export const openAssetViewer = ({
    token,
}: CommandRegistry['openAssetViewer']): DispatchHandlerParameter<'openAssetViewer', CommandRegistry> => ({
    name: 'openAssetViewer',
    payload: { token },
});
