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

    getBlockAssets(): Promise<Record<string, Asset[]>>;

    getAssetById(assetId: number): Promise<Asset>;

    deleteAssetIdsFromBlockAssetKey(key: string, assetIds: number[]): Promise<void>;

    addAssetIdsToBlockAssetKey(key: string, assetIds: number[]): Promise<void>;

    getBlockTemplates(): Promise<Record<string, Template[]>>;

    addTemplateIdsToBlockTemplateKey(key: string, templateIds: number[]): Promise<Record<string, Template[]>>;

    deleteTemplateIdsFromBlockTemplateKey(key: string, templateIds: number[]): Promise<void>;

    getTemplateById(templateId: number): Promise<TemplateLegacy>;

    getColorsByIds(colorIds: number[]): Promise<Color[]>;

    getColors(): Promise<Color[]>;

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

    getCurrentLoggedUser(): Promise<User>;

    getBulkDownloadByToken(token: string): Promise<BulkDownload>;

    getBulkDownloadBySignature(signature: string): Promise<BulkDownload>;

    getPrivacySettings(): PrivacySettings;

    getProjectId(): number;

    getEditorState(): boolean;

    getTranslationLanguage(): string;

    getColorPalettes(): Promise<ColorPalette[]>;

    getColorsByColorPaletteId(colorPaletteId: number): Promise<Color[]>;

    getAsset(assetId: number): Promise<Asset>;

    /**
     * @deprecated This method will be removed without a replacement. If you need this, please reach out through the
     * [Frontify Friends Slack channel](https://join.slack.com/t/frontify-friends/shared_invite/zt-1lhu6lump-s18oTGI4EhHt8BKWfBAN_A).
     * We're happy to discuss your use case!
     */
    getAllDocuments(): Promise<Document[]>;

    /**
     * @deprecated This method will be removed without a replacement. If you need this, please reach out through the
     * [Frontify Friends Slack channel](https://join.slack.com/t/frontify-friends/shared_invite/zt-1lhu6lump-s18oTGI4EhHt8BKWfBAN_A).
     * We're happy to discuss your use case!
     */
    getUngroupedDocuments(): Promise<Document[]>;

    /**
     * @deprecated This method will be removed without a replacement. If you need this, please reach out through the
     * [Frontify Friends Slack channel](https://join.slack.com/t/frontify-friends/shared_invite/zt-1lhu6lump-s18oTGI4EhHt8BKWfBAN_A).
     * We're happy to discuss your use case!
     */
    getDocumentsByDocumentGroupId(documentGroupId: number): Promise<Document[]>;

    /**
     * @deprecated This method will be removed without a replacement. If you need this, please reach out through the
     * [Frontify Friends Slack channel](https://join.slack.com/t/frontify-friends/shared_invite/zt-1lhu6lump-s18oTGI4EhHt8BKWfBAN_A).
     * We're happy to discuss your use case!
     */
    getDocumentGroups(): Promise<DocumentGroup[]>;

    /**
     * @deprecated This method will be removed without a replacement. If you need this, please reach out through the
     * [Frontify Friends Slack channel](https://join.slack.com/t/frontify-friends/shared_invite/zt-1lhu6lump-s18oTGI4EhHt8BKWfBAN_A).
     * We're happy to discuss your use case!
     */
    getDocumentPagesByDocumentId(documentId: number): Promise<DocumentPage[]>;

    /**
     * @deprecated This method will be removed without a replacement. If you need this, please reach out through the
     * [Frontify Friends Slack channel](https://join.slack.com/t/frontify-friends/shared_invite/zt-1lhu6lump-s18oTGI4EhHt8BKWfBAN_A).
     * We're happy to discuss your use case!
     */
    getDocumentPagesByDocumentCategoryId(documentCategoryId: number): Promise<DocumentPage[]>;

    /**
     * @deprecated This method will be removed without a replacement. If you need this, please reach out through the
     * [Frontify Friends Slack channel](https://join.slack.com/t/frontify-friends/shared_invite/zt-1lhu6lump-s18oTGI4EhHt8BKWfBAN_A).
     * We're happy to discuss your use case!
     */
    getDocumentCategoriesByDocumentId(documentId: number): Promise<DocumentCategory[]>;

    /**
     * @deprecated This method will be removed without a replacement. If you need this, please reach out through the
     * [Frontify Friends Slack channel](https://join.slack.com/t/frontify-friends/shared_invite/zt-1lhu6lump-s18oTGI4EhHt8BKWfBAN_A).
     * We're happy to discuss your use case!
     */
    getUncategorizedDocumentPagesByDocumentId(documentId: number): Promise<DocumentPage[]>;

    /**
     * @deprecated This method will be removed without a replacement. If you need this, please reach out through the
     * [Frontify Friends Slack channel](https://join.slack.com/t/frontify-friends/shared_invite/zt-1lhu6lump-s18oTGI4EhHt8BKWfBAN_A).
     * We're happy to discuss your use case!
     */
    getDocumentSectionsByDocumentPageId(documentPageId: number): Promise<DocumentSection[]>;

    /**
     * @deprecated This method will be removed without a replacement. If you need this, please reach out through the
     * [Frontify Friends Slack channel](https://join.slack.com/t/frontify-friends/shared_invite/zt-1lhu6lump-s18oTGI4EhHt8BKWfBAN_A).
     * We're happy to discuss your use case!
     */
    getDocumentTargets(documentId: number): Promise<DocumentTargets>;

    /**
     * @deprecated This method will be removed without a replacement. If you need this, please reach out through the
     * [Frontify Friends Slack channel](https://join.slack.com/t/frontify-friends/shared_invite/zt-1lhu6lump-s18oTGI4EhHt8BKWfBAN_A).
     * We're happy to discuss your use case!
     */
    getDocumentPageTargets(documentPageId: number): Promise<DocumentPageTargets>;
}
