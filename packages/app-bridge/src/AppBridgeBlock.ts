/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AppBridgeBase } from './AppBridgeBase';
import type {
    Asset,
    AssetChooserOptions,
    BulkDownload,
    Color,
    ColorCreate,
    ColorPalette,
    ColorPaletteCreate,
    ColorPalettePatch,
    ColorPatch,
    Template,
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

    /**
     * @deprecated Use dispatch(`openAssetViewer`) command instead
     * This will be removed in version 4.0.0 of @frontify/app-bridge
     */
    openAssetViewer(token: string): void;

    getTemplateById(templateId: number): Promise<Template>;

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

    openAssetChooser(callback: (selectedAssets: Asset[]) => void, options?: AssetChooserOptions): void;

    closeAssetChooser(): void;

    openTemplateChooser(callback: (selectedTemplate: Template) => void): void;

    closeTemplateChooser(): void;

    getCurrentLoggedUser(): Promise<User>;

    getBulkDownloadToken(assetIds: number[], setIds?: number[]): Promise<string>;

    getBulkDownloadByToken(token: string): Promise<BulkDownload>;

    getBulkDownloadBySignature(signature: string): Promise<BulkDownload>;

    getPrivacySettings(): PrivacySettings;
}
