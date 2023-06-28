/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { AssetViewerEvent, AssetViewerOnMethod } from '../types';

export interface AssetViewer {
    dispatch(command: AssetViewerEvent): void;
    on: AssetViewerOnMethod['AssetViewerOpen'];
    off: AssetViewerOnMethod['AssetViewerOpen'];
}
