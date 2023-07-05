/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AppBridgeBase } from './AppBridgeBase';
import type {
    Asset,
    AssetChooserOptions,
    BlockCommandPayload,
    BlockCommandResponse,
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
import { PrivacySettings } from './types';

export interface AppBridgeBlock extends AppBridgeBase {
    getBlockId(): number;

    getSectionId(): number | undefined;

    getBlockAssets(): Promise<Record<string, Asset[]>>;

    getAssetById(assetId: number): Promise<Asset>;

    deleteAssetIdsFromBlockAssetKey(key: string, assetIds: number[]): Promise<void>;

    addAssetIdsToBlockAssetKey(key: string, assetIds: number[]): Promise<void>;

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
     * @deprecated Use appBridge.dispatch(`AssetChooser.Open`) instead
     * This will be removed in version 4.0.0 of @frontify/app-bridge
     */
    openAssetChooser(callback: (selectedAssets: Asset[]) => void, options?: AssetChooserOptions): void;

    /**
     * @deprecated Use appBridge.dispatch(`AssetChooser.Open`).close() instead
     * This will be removed in version 4.0.0 of @frontify/app-bridge
     */
    closeAssetChooser(): void;

    openTemplateChooser(callback: (selectedTemplate: TemplateLegacy) => void): void;

    closeTemplateChooser(): void;

    getCurrentLoggedUser(): Promise<User>;

    getBulkDownloadToken(assetIds: number[], setIds?: number[]): Promise<string>;

    getBulkDownloadByToken(token: string): Promise<BulkDownload>;

    getBulkDownloadBySignature(signature: string): Promise<BulkDownload>;

    getPrivacySettings(): PrivacySettings;

    dispatch<Command extends keyof BlockCommandResponse>(
        command: Command,
        payload?: BlockCommandPayload[Command],
    ): BlockCommandResponse[Command];
}
