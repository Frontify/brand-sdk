/* (c) Copyright Frontify Ltd., all rights reserved. */

import { DispatchHandler } from '../types';

export const openAssetViewer = (): DispatchHandler<'openAssetViewer'> => ({
    commandName: 'openAssetViewer',
});
