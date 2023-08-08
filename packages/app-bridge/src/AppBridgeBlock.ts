/* (c) Copyright Frontify Ltd., all rights reserved. */

import type {
    ApiHandlerParameter,
    ApiMethodNameValidator,
    ApiReturn,
    AppBridge,
    CommandNameValidator,
    ContextAsEventName,
    ContextReturn,
    DispatchHandlerParameter,
    EventCallbackParameter,
    EventNameParameter,
    EventNameValidator,
    EventUnsubscribeFunction,
    StateAsEventName,
    StateReturn,
} from './AppBridge';
import type { ApiMethodRegistry } from './registries/api/ApiMethodRegistry';
import type { CommandRegistry } from './registries/commands/CommandRegistry';
import type { EventRegistry } from './registries/events/EventRegistry';
import type { AppBridgeBase } from './AppBridgeBase';
import type {
    Asset,
    BulkDownload,
    Color,
    ColorCreate,
    ColorPalette,
    ColorPaletteCreate,
    ColorPalettePatch,
    ColorPatch,
    Template,
    TemplateLegacy,
    User,
} from './types';
import { PrivacySettings } from './types/PrivacySettings';

export type BlockApiMethod = ApiMethodNameValidator<
    ApiMethodRegistry & {
        // Insert block specific api methods here
        // createBlockSpecificApiMethod: { payload: void; response: void };
    }
>;

export type BlockCommand = CommandNameValidator<
    CommandRegistry & {
        // Insert block specific commands here
        // openBlockSpecificCommand: string;
    }
>;

export type BlockState = {
    settings: Record<string, unknown>;
    assets: Record<string, unknown>;
    // Insert block specific states here
};

export type BlockContext = {
    marketplaceServiceAppId: string;
    portalId: number;
    brandId: number;
    blockId: number;
    sectionId?: number;
    // Insert block specific context here
};

export type BlockEvent = EventNameValidator<
    Pick<EventRegistry, 'assetsChosen'> &
        StateAsEventName<BlockState & { '*': BlockState }> &
        ContextAsEventName<BlockContext & { '*': BlockContext }> & {
            // Insert block specific events here
            // blockSpecificEntityChosen: string;
        }
>;

export interface AppBridgeBlock<
    State extends BlockState = BlockState,
    Context extends BlockContext = BlockContext,
    Event extends BlockEvent = BlockEvent,
> extends AppBridge<BlockApiMethod, BlockCommand, State, Context, Event>,
        AppBridgeBase {
    api<ApiMethodName extends keyof BlockApiMethod>(
        apiHandler: ApiHandlerParameter<ApiMethodName, BlockApiMethod>,
    ): ApiReturn<ApiMethodName, BlockApiMethod>;

    dispatch<CommandName extends keyof BlockCommand>(
        dispatchHandler: DispatchHandlerParameter<CommandName, BlockCommand>,
    ): Promise<void>;

    state(): StateReturn<State, void>;
    state<Key extends keyof State>(key: Key): StateReturn<State, Key>;
    state<Key extends keyof State>(key?: Key | void): unknown;

    context(): ContextReturn<Context, void>;
    context<Key extends keyof Context>(key: Key): ContextReturn<Context, Key>;
    context<Key extends keyof Context>(key?: Key | void): unknown;

    subscribe<EventName extends keyof Event>(
        eventName: EventNameParameter<EventName, Event>,
        callback: EventCallbackParameter<EventName, Event>,
    ): EventUnsubscribeFunction;

    getBlockId(): number;

    getSectionId(): number | undefined;

    getBlockAssets(): Promise<Record<string, Asset[]>>;

    getAssetById(assetId: number): Promise<Asset>;

    deleteAssetIdsFromBlockAssetKey(key: string, assetIds: number[]): Promise<void>;

    addAssetIdsToBlockAssetKey(key: string, assetIds: number[]): Promise<void>;

    /**
     * @deprecated This will be removed in version 4.0.0 of @frontify/app-bridge
     * Use appBridge.dispatch(openAssetViewer(token)) instead
     */
    openAssetViewer(token: string): void;

    getBlockTemplates(): Promise<Record<string, Template[]>>;

    addTemplateIdsToBlockTemplateKey(key: string, templateIds: number[]): Promise<Record<string, Template[]>>;

    deleteTemplateIdsFromBlockTemplateKey(key: string, templateIds: number[]): Promise<void>;

    getTemplateById(templateId: number): Promise<TemplateLegacy>;

    getColorsByIds(colorIds: number[]): Promise<Color[]>;

    getColors(): Promise<Color[]>;

    /**
     * @deprecated Use `getColors` instead.
     */
    getAvailableColors(): Promise<Color[]>;

    /**
     * @deprecated Use `getColorPalettes` instead.
     */
    getAvailablePalettes(): Promise<ColorPalette[]>;

    getColorPalettesWithColors(colorPaletteIds?: number[]): Promise<ColorPalette[]>;

    createColorPalette(colorPaletteCreate: ColorPaletteCreate): Promise<ColorPalette>;

    updateColorPalette(colorPaletteId: number, colorPalettePatch: ColorPalettePatch): Promise<ColorPalette>;

    deleteColorPalette(colorPaletteId: number): Promise<void>;

    createColor(colorCreate: ColorCreate): Promise<Color>;

    updateColor(colorId: number, colorPatch: ColorPatch): Promise<Color>;

    deleteColor(colorId: number): Promise<void>;

    downloadColorKit(selectedColorPalettes: number[]): string;

    getBlockSettings<T = Record<string, unknown>>(): Promise<T>;

    updateBlockSettings<T = Record<string, unknown>>(newSettings: T): Promise<void>;

    /**
     * @deprecated This will be removed in version 4.0.0 of @frontify/app-bridge
     * Use appBridge.dispatch(openTemplateChooser()) instead
     */
    openTemplateChooser(callback: (selectedTemplate: TemplateLegacy) => void): void;

    /**
     * @deprecated This will be removed in version 4.0.0 of @frontify/app-bridge
     * Use appBridge.dispatch(closeTemplateChooser()) instead
     */
    closeTemplateChooser(): void;

    getCurrentLoggedUser(): Promise<User>;

    getBulkDownloadToken(assetIds: number[], setIds?: number[]): Promise<string>;

    getBulkDownloadByToken(token: string): Promise<BulkDownload>;

    getBulkDownloadBySignature(signature: string): Promise<BulkDownload>;

    getPrivacySettings(): PrivacySettings;
}
