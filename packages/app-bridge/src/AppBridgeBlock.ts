/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    type ApiHandlerParameter,
    type ApiMethodNameValidator,
    type ApiReturn,
    type AppBridge,
    type CommandNameValidator,
    type ContextAsEventName,
    type ContextReturn,
    type DispatchHandlerParameter,
    type EventCallbackParameter,
    type EventNameParameter,
    type EventNameValidator,
    type EventUnsubscribeFunction,
    type StateAsEventName,
    type StateReturn,
} from './AppBridge';
import { type ApiMethodRegistry } from './registries/api/ApiMethodRegistry';
import { type CommandRegistry } from './registries/commands/CommandRegistry';
import { type EventRegistry } from './registries/events/EventRegistry';
import {
    type Asset,
    type AssetChooserOptions,
    type BulkDownload,
    type Color,
    type ColorCreate,
    type ColorPalette,
    type ColorPaletteCreate,
    type ColorPalettePatch,
    type ColorPatch,
    type Document,
    type DocumentCategory,
    type DocumentGroup,
    type DocumentPage,
    type DocumentPageTargets,
    type DocumentSection,
    type DocumentTargets,
    type Template,
    type TemplateLegacy,
    type User,
} from './types';
import { type PrivacySettings } from './types/PrivacySettings';

export type BlockApiMethod = ApiMethodNameValidator<
    Pick<ApiMethodRegistry, 'getAssetBulkDownloadToken' | 'getCurrentUser' | 'setAssetIdsByBlockAssetKey'>
>;

export type BlockCommand = CommandNameValidator<
    Pick<
        CommandRegistry,
        | 'closeAssetChooser'
        | 'closeTemplateChooser'
        | 'downloadAsset'
        | 'openAssetChooser'
        | 'openAssetViewer'
        | 'openTemplateChooser'
        | 'openNewPublication'
    >
>;

export type BlockState = {
    settings: Record<string, unknown>;
    assets: Record<string, unknown>;
    templates: Record<string, unknown>;
};

export type BlockContext = {
    portalId: number;
    blockId: number;
    sectionId?: number;
    isAuthenticated: boolean;
    isNewlyInserted: boolean;
};

export type BlockEvent = EventNameValidator<
    Pick<EventRegistry, 'assetsChosen' | 'templateChosen'> &
        StateAsEventName<BlockState & { '*': BlockState }> &
        ContextAsEventName<BlockContext & { '*': BlockContext }>
>;

export interface AppBridgeBlock<
    State extends BlockState = BlockState,
    Context extends BlockContext = BlockContext,
    Event extends BlockEvent = BlockEvent,
> extends AppBridge<BlockApiMethod, BlockCommand, State, Context, Event> {
    api<ApiMethodName extends keyof BlockApiMethod>(
        apiHandler: ApiHandlerParameter<ApiMethodName, BlockApiMethod>,
    ): ApiReturn<ApiMethodName, BlockApiMethod>;

    dispatch<CommandName extends keyof BlockCommand>(
        dispatchHandler: DispatchHandlerParameter<CommandName, BlockCommand>,
    ): Promise<void>;

    state(): StateReturn<State, void>;
    state<Key extends keyof State>(key: Key): StateReturn<State, Key>;
    state(key?: keyof State | void): unknown;

    context(): ContextReturn<Context, void>;
    context<Key extends keyof Context>(key: Key): ContextReturn<Context, Key>;
    context(key?: keyof Context | void): unknown;

    subscribe<EventName extends keyof Event>(
        eventName: EventNameParameter<EventName, Event>,
        callback: EventCallbackParameter<EventName, Event>,
    ): EventUnsubscribeFunction;

    /**
     * @deprecated This will be removed in version 4.0.0 of `@frontify/app-bridge`
     * Use `appBridge.context('blockId').get()` instead.
     */
    getBlockId(): number;

    /**
     * @deprecated This will be removed in version 4.0.0 of `@frontify/app-bridge`
     * Use `appBridge.context('sectionId').get()` instead.
     */
    getSectionId(): number | undefined;

    getBlockAssets(): Promise<Record<string, Asset[]>>;

    getAssetById(assetId: number): Promise<Asset>;

    deleteAssetIdsFromBlockAssetKey(key: string, assetIds: number[]): Promise<void>;

    addAssetIdsToBlockAssetKey(key: string, assetIds: number[]): Promise<void>;

    /**
     * @deprecated This will be removed in version 4.0.0 of `@frontify/app-bridge`
     * Use `appBridge.dispatch(openAssetViewer(token))` instead.
     */
    openAssetViewer(token: string): void;

    getBlockTemplates(): Promise<Record<string, Template[]>>;

    addTemplateIdsToBlockTemplateKey(key: string, templateIds: number[]): Promise<Record<string, Template[]>>;

    deleteTemplateIdsFromBlockTemplateKey(key: string, templateIds: number[]): Promise<void>;

    getTemplateById(templateId: number): Promise<TemplateLegacy>;

    /**
     * @deprecated will be removed in version 4.0.0 of `@frontify/app-bridge`
     * There won't be a replacement for this method.
     */
    getColorsByIds(colorIds: number[]): Promise<Color[]>;

    /**
     * @deprecated will be removed in version 4.0.0 of `@frontify/app-bridge`
     * There won't be a replacement for this method.
     */
    getColors(): Promise<Color[]>;

    /**
     * @deprecated Use `getColors` instead.
     */
    getAvailableColors(): Promise<Color[]>;

    /**
     * @deprecated Use `getColorPalettes` instead.
     */
    getAvailablePalettes(): Promise<ColorPalette[]>;

    /**
     * @deprecated will be removed in version 4.0.0 of `@frontify/app-bridge`
     * There will be a replacement for this method. But there will a new api to grab all colors and palettes.
     */
    getColorPalettesWithColors(colorPaletteIds?: number[]): Promise<ColorPalette[]>;

    /**
     * @deprecated will be removed in version 4.0.0 of `@frontify/app-bridge`
     * There won't be a replacement for this method.
     */
    createColorPalette(colorPaletteCreate: ColorPaletteCreate): Promise<ColorPalette>;

    /**
     * @deprecated will be removed in version 4.0.0 of `@frontify/app-bridge`
     * There won't be a replacement for this method.
     */
    updateColorPalette(colorPaletteId: number, colorPalettePatch: ColorPalettePatch): Promise<ColorPalette>;

    /**
     * @deprecated will be removed in version 4.0.0 of `@frontify/app-bridge`
     * There won't be a replacement for this method.
     */
    deleteColorPalette(colorPaletteId: number): Promise<void>;

    /**
     * @deprecated will be removed in version 4.0.0 of `@frontify/app-bridge`
     * There won't be a replacement for this method.
     */
    createColor(colorCreate: ColorCreate): Promise<Color>;

    /**
     * @deprecated will be removed in version 4.0.0 of `@frontify/app-bridge`
     * There won't be a replacement for this method.
     */
    updateColor(colorId: number, colorPatch: ColorPatch): Promise<Color>;

    /**
     * @deprecated will be removed in version 4.0.0 of `@frontify/app-bridge`
     * There won't be a replacement for this method.
     */
    deleteColor(colorId: number): Promise<void>;

    downloadColorKit(selectedColorPalettes: number[]): string;

    getBlockSettings<T = Record<string, unknown>>(): Promise<T>;

    updateBlockSettings<T = Record<string, unknown>>(newSettings: T): Promise<void>;

    /**
     * @deprecated This will be removed in version 4.0.0 of `@frontify/app-bridge`
     * Use `appBridge.dispatch(openTemplateChooser())` instead.
     */
    openTemplateChooser(callback: (selectedTemplate: TemplateLegacy) => void): void;

    /**
     * @deprecated This will be removed in version 4.0.0 of `@frontify/app-bridge`
     * Use `appBridge.dispatch(closeTemplateChooser())` instead.
     */
    closeTemplateChooser(): void;

    getCurrentLoggedUser(): Promise<User>;

    getBulkDownloadByToken(token: string): Promise<BulkDownload>;

    getBulkDownloadBySignature(signature: string): Promise<BulkDownload>;

    getPrivacySettings(): PrivacySettings;

    /**
     * @deprecated This will be removed in version 4.0.0 of `@frontify/app-bridge`
     * Use `appBridge.dispatch(openAssetChooser(options))` to open the asset chooser
     * and `appBridge.subscribe('assetsChosen', callback)` to subscribe to the asset chosen event
     */
    openAssetChooser(callback: (selectedAssets: Asset[]) => void, options?: AssetChooserOptions): void;

    /**
     * @deprecated This will be removed in version 4.0.0 of `@frontify/app-bridge`
     * Use `appBridge.dispatch(closeAssetChooser())` instead.
     */
    closeAssetChooser(): void;

    getProjectId(): number;

    getEditorState(): boolean;

    getTranslationLanguage(): string;

    /**
     * @deprecated will be removed in version 4.0.0 of `@frontify/app-bridge`
     * There won't be a replacement for this method. But there will a new api to grab all colors and palettes.
     */
    getColorPalettes(): Promise<ColorPalette[]>;

    /**
     * @deprecated will be removed in version 4.0.0 of `@frontify/app-bridge`
     * There won't be a replacement for this method. But there will a new api to grab all colors and palettes.
     */
    getColorsByColorPaletteId(colorPaletteId: number): Promise<Color[]>;

    /**
     * @deprecated will be removed in version 4.0.0 of `@frontify/app-bridge`
     * There won't be a replacement for this method. But Link Chooser will be in-sourced and there will be a command to open it.
     */
    getAllDocuments(): Promise<Document[]>;

    /**
     * @deprecated will be removed in version 4.0.0 of `@frontify/app-bridge`
     * There won't be a replacement for this method. But Link Chooser will be in-sourced and there will be a command to open it.
     */
    getUngroupedDocuments(): Promise<Document[]>;

    /**
     * @deprecated will be removed in version 4.0.0 of `@frontify/app-bridge`
     * There won't be a replacement for this method.  But Link Chooser will be in-sourced and there will be a command to open it.
     */
    getDocumentsByDocumentGroupId(documentGroupId: number): Promise<Document[]>;

    /**
     * @deprecated will be removed in version 4.0.0 of `@frontify/app-bridge`
     * There won't be a replacement for this method. But Link Chooser will be in-sourced and there will be a command to open it.
     */
    getDocumentGroups(): Promise<DocumentGroup[]>;

    /**
     * @deprecated will be removed in version 4.0.0 of `@frontify/app-bridge`
     * There won't be a replacement for this method. But Link Chooser will be in-sourced and there will be a command to open it.
     */
    getDocumentPagesByDocumentId(documentId: number): Promise<DocumentPage[]>;

    /**
     * @deprecated will be removed in version 4.0.0 of `@frontify/app-bridge`
     * There won't be a replacement for this method. But Link Chooser will be in-sourced and there will be a command to open it.
     */
    getDocumentPagesByDocumentCategoryId(documentCategoryId: number): Promise<DocumentPage[]>;

    /**
     * @deprecated will be removed in version 4.0.0 of `@frontify/app-bridge`
     * There won't be a replacement for this method. But Link Chooser will be in-sourced and there will be a command to open it.
     */
    getDocumentCategoriesByDocumentId(documentId: number): Promise<DocumentCategory[]>;

    /**
     * @deprecated will be removed in version 4.0.0 of `@frontify/app-bridge`
     * There won't be a replacement for this method. But Link Chooser will be in-sourced and there will be a command to open it.
     */
    getUncategorizedDocumentPagesByDocumentId(documentId: number): Promise<DocumentPage[]>;

    /**
     * @deprecated will be removed in version 4.0.0 of `@frontify/app-bridge`
     * There won't be a replacement for this method. But Link Chooser will be in-sourced and there will be a command to open it.
     */
    getDocumentSectionsByDocumentPageId(documentPageId: number): Promise<DocumentSection[]>;

    /**
     * @deprecated will be removed in version 4.0.0 of `@frontify/app-bridge`
     * There won't be a replacement for this method. But Link Chooser will be in-sourced and there will be a command to open it.
     */
    getDocumentTargets(documentId: number): Promise<DocumentTargets>;

    /**
     * @deprecated will be removed in version 4.0.0 of `@frontify/app-bridge`
     * There won't be a replacement for this method. But Link Chooser will be in-sourced and there will be a command to open it.
     */
    getDocumentPageTargets(documentPageId: number): Promise<DocumentPageTargets>;
}
