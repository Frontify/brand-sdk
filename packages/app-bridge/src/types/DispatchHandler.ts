/* (c) Copyright Frontify Ltd., all rights reserved. */

import { TrackAssetDownload } from './Analytics';
import type { AssetChooserOptions } from './Terrific';

export type DispatchPayload = {
    openAssetChooser?: AssetChooserOptions;
    closeAssetChooser: void;
    trackPlatformAnalytics: TrackAssetDownload;
    openAssetViewer: { token: string };
    openTemplateChooser: void;
    closeTemplateChooser: void;
    openNavigationManager: void;
};

export type DispatchHandler<DispatchName extends keyof DispatchPayload> = DispatchPayload[DispatchName] extends void
    ? { name: DispatchName }
    : { name: DispatchName; payload: DispatchPayload[DispatchName] };
