/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type CommandNameValidator } from '../../AppBridge';
import {
    type AssetViewerOptions,
    type Asset,
    type AssetChooserOptions,
    type CloseColorChooserOptions,
    type ColorChooserOptions,
    type LinkChooserOptions,
    type OpenBrandCheckerPayload,
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
type OpenColorChooserPayload = ColorChooserOptions;
type CloseColorChooserPayload = CloseColorChooserOptions;
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
    openColorChooser: OpenColorChooserPayload;
    closeColorChooser: CloseColorChooserPayload;
    downloadAsset: DownloadAsset;
    openNewPublication: OpenNewPublicationPayload;
    openSearchDialog: OpenSearchDialog;
    closeSearchDialog: CloseSearchDialog;
    openPlatformAppDirect: OpenPlatformAppDirect;
    openBrandChecker: OpenBrandCheckerPayload;
    trackEvent: TrackPayload;
}>;
