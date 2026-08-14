/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type CommandNameValidator } from '../../AppBridge';
import {
    type AssetViewerOptions,
    type Asset,
    type AssetChooserOptions,
    type LinkChooserOptions,
    type OpenNewPublicationPayload,
    type TrackPayload,
} from '../../types';

type OpenAssetChooserPayload = AssetChooserOptions;
type CloseAssetChooserPayload = void;
type OpenAssetViewerPayload = AssetViewerOptions;
type OpenTemplateChooser = void;
type CloseTemplateChooser = void;
type OpenLinkChooserPayload = LinkChooserOptions;
type CloseLinkChooserPayload = void;
type DownloadAsset = Asset;
type OpenSearchDialog = void;
type CloseSearchDialog = void;
type OpenPlatformAppDirect = { marketplaceAppId: string };

export type CommandRegistry = CommandNameValidator<{
    openAssetChooser?: OpenAssetChooserPayload;
    closeAssetChooser: CloseAssetChooserPayload;
    openAssetViewer: OpenAssetViewerPayload;
    openTemplateChooser: OpenTemplateChooser;
    closeTemplateChooser: CloseTemplateChooser;
    openLinkChooser?: OpenLinkChooserPayload;
    closeLinkChooser: CloseLinkChooserPayload;
    downloadAsset: DownloadAsset;
    openNewPublication: OpenNewPublicationPayload;
    openSearchDialog: OpenSearchDialog;
    closeSearchDialog: CloseSearchDialog;
    openPlatformAppDirect: OpenPlatformAppDirect;
    trackEvent: TrackPayload;
}>;
