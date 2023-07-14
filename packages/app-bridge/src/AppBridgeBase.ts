/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    Asset,
    AssetChooserOptions,
    Color,
    ColorPalette,
    DispatchHandler,
    DispatchOption,
    Document,
    DocumentCategory,
    DocumentGroup,
    DocumentPage,
    DocumentPageTargets,
    DocumentSection,
    DocumentTargets,
    Subscription,
    SubscriptionCallback,
} from './types';

export interface AppBridgeBase {
    getProjectId(): number;

    getEditorState(): boolean;

    getTranslationLanguage(): string;

    getColorPalettes(): Promise<ColorPalette[]>;

    getColorsByColorPaletteId(colorPaletteId: number): Promise<Color[]>;

    getAllDocuments(): Promise<Document[]>;

    getUngroupedDocuments(): Promise<Document[]>;

    getDocumentsByDocumentGroupId(documentGroupId: number): Promise<Document[]>;

    getDocumentGroups(): Promise<DocumentGroup[]>;

    getDocumentPagesByDocumentId(documentId: number): Promise<DocumentPage[]>;

    getDocumentPagesByDocumentCategoryId(documentCategoryId: number): Promise<DocumentPage[]>;

    getDocumentCategoriesByDocumentId(documentId: number): Promise<DocumentCategory[]>;

    getUncategorizedDocumentPagesByDocumentId(documentId: number): Promise<DocumentPage[]>;

    getDocumentSectionsByDocumentPageId(documentPageId: number): Promise<DocumentSection[]>;

    getDocumentTargets(documentId: number): Promise<DocumentTargets>;

    getDocumentPageTargets(documentPageId: number): Promise<DocumentPageTargets>;

    /**
     * @deprecated This will be removed in version 4.0.0 of @frontify/app-bridge
     * Use appBridge.dispatch(openAssetChooser(options)) to open the asset chooser
     * and appBridge.subscribe('assetsChosen', callback) to subscribe to the asset chosen event
     */
    openAssetChooser(callback: (selectedAssets: Asset[]) => void, options?: AssetChooserOptions): void;

    /**
     * @deprecated This will be removed in version 4.0.0 of @frontify/app-bridge
     * Use appBridge.dispatch(closeAssetChooser()) instead
     */
    closeAssetChooser(): void;

    subscribe<SubscriptionName extends Subscription>(
        eventName: SubscriptionName,
        callback: SubscriptionCallback[SubscriptionName],
    ): void;

    dispatch<CommandName extends keyof DispatchOption>(dispatchHandler: DispatchHandler<CommandName>): void;
}
