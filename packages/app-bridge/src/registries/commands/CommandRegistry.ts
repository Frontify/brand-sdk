/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type CommandNameValidator } from '../../AppBridge';
import {
    type AssetViewerOptions,
    type Asset,
    type AssetChooserOptions,
    type OpenNewPublicationPayload,
} from '../../types';

type OpenAssetChooserPayload = AssetChooserOptions;
type CloseAssetChooserPayload = void;
type OpenAssetViewerPayload = AssetViewerOptions;
type OpenTemplateChooser = void;
type CloseTemplateChooser = void;
type DownloadAsset = Asset;
type OpenSearchDialog = void;
type CloseSearchDialog = void;

export type CommandRegistry = CommandNameValidator<{
    openAssetChooser?: OpenAssetChooserPayload;
    closeAssetChooser: CloseAssetChooserPayload;
    openAssetViewer: OpenAssetViewerPayload;
    openTemplateChooser: OpenTemplateChooser;
    closeTemplateChooser: CloseTemplateChooser;
    downloadAsset: DownloadAsset;
    openNewPublication: OpenNewPublicationPayload;
    openSearchDialog: OpenSearchDialog;
    closeSearchDialog: CloseSearchDialog;
}>;
