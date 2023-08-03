/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { AssetChooserOptions, CreateNewPublicationOptions } from './Terrific';

export type DispatchPayload = {
    openAssetChooser?: AssetChooserOptions;
    closeAssetChooser: void;
    openAssetViewer: { token: string };
    openTemplateChooser: void;
    closeTemplateChooser: void;
    openNavigationManager: void;
    createNewPublication: CreateNewPublicationOptions;
};

export type DispatchHandler<DispatchName extends keyof DispatchPayload> = DispatchPayload[DispatchName] extends void
    ? { name: DispatchName }
    : { name: DispatchName; payload: DispatchPayload[DispatchName] };
