/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { SnakeCasedPropertiesDeep } from 'type-fest';

import type {
    Asset,
    AssetApi,
    AssetChooserOptions,
    AssetChooserResult,
    Color,
    ColorApiPatch,
    ColorCreate,
    ColorPalette,
    ColorPaletteApiPatch,
    ColorPaletteCreate,
    ColorPalettePatch,
    ColorPatch,
    DocumentBlockAsset,
    Template,
    TemplateApi,
    User,
} from './types';
import { AssetChooserProjectType, TerrificEvent } from './types/Terrific';
import { HttpClient, getDatasetByClassName, getDatasetByElement, mergeDeep } from './utilities';
import {
    createColor,
    createColorPalette,
    deleteColor,
    deleteColorPalette,
    getColorPalettesByProjectId,
    getColorsByColorPaletteId,
    mapAssetApiToAsset,
    mapColorCreateToColorApiCreate,
    mapColorPaletteCreateToColorPaletteApiCreate,
    mapColorPalettePatchToColorPaletteApiPatch,
    mapColorPatchToColorApiPatch,
    updateColor,
    updateColorPalette,
} from './repositories';

type UserApi = SnakeCasedPropertiesDeep<User>;
type DocumentBlockAssetApi = Omit<SnakeCasedPropertiesDeep<DocumentBlockAsset>, 'asset'> & { asset: AssetApi };

export class AppBridgeBlock {
    constructor(private readonly blockId: number, private readonly sectionId?: number) {
        this.registerAppBridgeSubscriberInTerrificContext();
    }

    private registerAppBridgeSubscriberInTerrificContext() {
        if (!window.application?.connectors?.events?.components?.appBridge) {
            window.application.connectors.events.registerComponent({ id: 'appBridge' });
        }
    }

    public getBlockId(): number {
        return this.blockId;
    }

    public getSectionId(): number | undefined {
        return this.sectionId;
    }

    public getProjectId(): number {
        return window.application.sandbox.config.context.project.id;
    }

    public getTranslationLanguage(): string {
        return getDatasetByElement<{ translationLanguage?: string }>(document.body).translationLanguage ?? '';
    }

    public getEditorState(): boolean {
        return (
            document.querySelector('.js-co-powerbar__sg-edit.state-active') !== null &&
            this.getBlockReferenceToken() === null
        );
    }

    // TODO: add tests (https://app.clickup.com/t/2qagxm6)
    public async getBlockAssets(): Promise<Record<string, Asset[]>> {
        const { result } = await HttpClient.get<DocumentBlockAssetApi[]>(`/api/document-block/${this.blockId}/asset`);

        if (!result.success) {
            throw new Error("Couldn't fetch block assets");
        }

        return this.mapDocumentBlockAssetsApiToBlockAssets(result.data);
    }

    // TODO: add tests (https://app.clickup.com/t/2qagxm6)
    public async getAssetById(assetId: number): Promise<Asset> {
        const { result } = await HttpClient.get<AssetApi>(
            `/api/asset/${assetId}?include_urls=true&block_id=${this.blockId}`,
        );

        if (!result.success) {
            throw new Error(`Could not get the asset with id ${assetId}.`);
        }

        return { ...result.data, ...mapAssetApiToAsset(result.data) };
    }

    // TODO: add tests (https://app.clickup.com/t/2qagxm6)
    public async deleteAssetIdsFromBlockAssetKey(key: string, assetIds: number[]): Promise<void> {
        const { result } = await HttpClient.delete<Record<string, Asset[]>>(
            `/api/document-block/${this.blockId}/asset/${key}`,
            { asset_ids: assetIds },
        );

        if (!result.success) {
            throw new Error("Couldn't delete assets");
        }
    }

    // TODO: add tests (https://app.clickup.com/t/2qagxm6)
    public async addAssetIdsToBlockAssetKey(key: string, assetIds: number[]): Promise<void> {
        const { result } = await HttpClient.post<DocumentBlockAssetApi[]>(
            `/api/document-block/${this.blockId}/asset/${key}`,
            { asset_ids: assetIds },
        );

        if (!result.success) {
            throw new Error("Couldn't add assets");
        }

        await this.waitForFinishedProcessing(key);
    }

    public async openAssetInViewer(token: string): Promise<void> {
        window.emitter.emit('Viewer:Opened', token);
    }

    // TODO: add tests (https://app.clickup.com/t/2qagxm6)
    public async getTemplateById(templateId: number): Promise<Template> {
        const brandId = window.application.sandbox.config.context.brand.id;
        const response = await window.fetch(`/api/publishing/template/${brandId}?template_id=${templateId}`, {
            method: 'GET',
            headers: {
                'x-csrf-token': (document.getElementsByName('x-csrf-token')[0] as HTMLMetaElement).content,
                'Content-Type': 'application/json',
            },
        });

        const responseJson: { success: boolean; templates: TemplateApi[] } = await response.json();

        if (!responseJson.success) {
            throw new Error(`Could not get the template with id ${templateId}.`);
        }

        return this.mapTemplateApiToTemplate(responseJson.templates[0]);
    }

    public async getColorsByIds(colorIds: number[]): Promise<Color[]> {
        const colors = await this.getColors();
        return colors.filter((color) => colorIds.includes(color.id));
    }

    public async getColors(): Promise<Color[]> {
        const colorPalettes = await this.getColorPalettes();

        const colorsPerPalette = await Promise.all(
            colorPalettes.map((colorPalette) => this.getColorsByColorPaletteId(colorPalette.id)),
        );

        return colorsPerPalette.flat(1);
    }

    /**
     * @deprecated Use `getColors` instead.
     */
    public async getAvailableColors(): Promise<Color[]> {
        return this.getColors();
    }

    /**
     * @deprecated Use `getColorPalettes` instead.
     */
    public async getAvailablePalettes(): Promise<ColorPalette[]> {
        return this.getColorPalettes();
    }

    public async getColorPalettes(): Promise<ColorPalette[]> {
        return getColorPalettesByProjectId(this.getProjectId());
    }

    public async getColorPalettesWithColors(colorPaletteIds?: number[]): Promise<ColorPalette[]> {
        let colorPalettes = await this.getColorPalettes();

        if (colorPaletteIds) {
            colorPalettes = colorPalettes.filter((colorPalette) => colorPaletteIds.includes(colorPalette.id));
        }

        await Promise.all(
            colorPalettes.map(
                async (colorPalette) => (colorPalette.colors = await this.getColorsByColorPaletteId(colorPalette.id)),
            ),
        );

        return colorPalettes;
    }

    public async getColorsByColorPaletteId(colorPaletteId: number): Promise<Color[]> {
        return getColorsByColorPaletteId(colorPaletteId);
    }

    public async createColorPalette(colorPaletteCreate: ColorPaletteCreate): Promise<ColorPalette> {
        return createColorPalette(
            mapColorPaletteCreateToColorPaletteApiCreate(colorPaletteCreate, this.getProjectId()),
        );
    }

    public async updateColorPalette(
        colorPaletteId: number,
        colorPalettePatch: ColorPalettePatch,
    ): Promise<ColorPalette> {
        const colorPaletteApiPatch: ColorPaletteApiPatch =
            mapColorPalettePatchToColorPaletteApiPatch(colorPalettePatch);

        const translationLanguage = this.getTranslationLanguage();
        if (translationLanguage) {
            colorPaletteApiPatch.language = translationLanguage;
        }

        return updateColorPalette(colorPaletteId, colorPaletteApiPatch);
    }

    public async deleteColorPalette(colorPaletteId: number): Promise<void> {
        return deleteColorPalette(colorPaletteId);
    }

    public async createColor(colorCreate: ColorCreate): Promise<Color> {
        return createColor(mapColorCreateToColorApiCreate(colorCreate));
    }

    public async updateColor(colorId: number, colorPatch: ColorPatch): Promise<Color> {
        const colorApiPatch: ColorApiPatch = mapColorPatchToColorApiPatch(colorPatch);

        const translationLanguage = this.getTranslationLanguage();
        if (translationLanguage) {
            colorApiPatch.language = translationLanguage;
        }

        return updateColor(colorId, colorApiPatch);
    }

    public async deleteColor(colorId: number): Promise<void> {
        return deleteColor(colorId);
    }

    public downloadColorKit(selectedColorPalettes: number[]) {
        const blockReferenceToken = this.getProjectId();

        return `/api/color/export/${blockReferenceToken}/zip/${selectedColorPalettes.join(',')}`;
    }

    // TODO: add tests (https://app.clickup.com/t/2qagxm6)
    public async getBlockSettings<T = Record<string, unknown>>(): Promise<T> {
        const translationLanguage = this.getTranslationLanguage();
        const translationLanguageSuffix = translationLanguage ? `&lang=${translationLanguage}` : '';
        const response = await window.fetch(
            `/api/document/block/${this.blockId}?settings_only=true${translationLanguageSuffix}`,
            {
                headers: {
                    'x-csrf-token': (document.getElementsByName('x-csrf-token')[0] as HTMLMetaElement).content,
                    'Content-Type': 'application/json',
                },
            },
        );

        const responseJson = await response.json();

        if (!responseJson.success) {
            throw new Error('Could not get the block settings');
        }

        return responseJson.settings as T;
    }

    // TODO: add tests (https://app.clickup.com/t/2qagxm6)
    public async updateBlockSettings<T = Record<string, unknown>>(newSettings: T): Promise<void> {
        const pageId = getDatasetByClassName('page').id;
        if (!pageId) {
            throw new Error('Page ID not found');
        }

        const translationLanguage = this.getTranslationLanguage();

        const { result } = await HttpClient.post(`/api/document/block/${pageId}/${this.sectionId}/${this.blockId}`, {
            settings: newSettings,
            ...(translationLanguage ? { language: translationLanguage } : {}),
        });

        if (!result.success) {
            throw new Error('Could not update the block settings');
        }

        window.blockSettings[this.blockId] = mergeDeep(window.blockSettings[this.blockId] || {}, newSettings);
    }

    // TODO: add tests (https://app.clickup.com/t/2qagxm6)
    public openAssetChooser(callback: (selectedAssets: Asset[]) => void, options?: AssetChooserOptions): void {
        window.application.connectors.events.components.appBridge.component.onAssetChooserAssetChosen = (
            assetChooserResult,
        ) => {
            const formattedAssets = assetChooserResult.screenData.map((asset) => ({
                ...asset,
                ...this.mapAssetChooserResultToAsset(asset),
            }));

            callback({
                ...assetChooserResult,
                ...formattedAssets,
                // TODO: Remove iterator when `...assetChooserResult` is deleted (when app bridge v3 is out)
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                [Symbol.iterator]() {
                    let iteratorIndex = 0;

                    return {
                        next() {
                            if (iteratorIndex === formattedAssets.length) {
                                return { done: true };
                            }

                            return {
                                done: false,
                                value: formattedAssets[iteratorIndex++],
                            };
                        },
                    };
                },
            });
        };

        const projectTypesMap: Record<AssetChooserProjectType, string> = {
            [AssetChooserProjectType.MediaLibrary]: 'MEDIALIBRARY',
            [AssetChooserProjectType.LogoLibrary]: 'LOGOLIBRARY',
            [AssetChooserProjectType.IconLibrary]: 'ICONLIBRARY',
            [AssetChooserProjectType.DocumentLibrary]: 'DOCUMENTLIBRARY',
            [AssetChooserProjectType.TemplateLibrary]: 'TEMPLATELIBRARY',
            [AssetChooserProjectType.PatternLibrary]: 'PATTERNLIBRARY',
            [AssetChooserProjectType.Styleguide]: 'STYLEGUIDE',
            [AssetChooserProjectType.Workspace]: 'WORKSPACE',
        };

        const assetChooserOptions = options
            ? {
                  brandId: window.application.sandbox.config.context.brand.id,
                  projectTypes: options.projectTypes?.map((value) => projectTypesMap[value]),
                  multiSelectionAllowed: options.multiSelection,
                  filters: [
                      ...('selectedValueId' in options
                          ? [{ key: 'id', values: [options.selectedValueId], inverted: true }]
                          : []),
                      ...('selectedValueIds' in options
                          ? [{ key: 'id', values: options.selectedValueIds, inverted: true }]
                          : []),
                      ...(options.extensions ? [{ key: 'ext', values: options.extensions }] : []),
                      ...(options.objectTypes ? [{ key: 'object_type', values: options.objectTypes }] : []),
                      ...(options.urlContains ? [{ key: 'external_url', containsText: options.urlContains }] : []),
                  ],
              }
            : {};
        const $assetChooser = window.application.sandbox.config.tpl.render('c-assetchooser', assetChooserOptions);

        window.application.connectors.events.notify(null, TerrificEvent.OpenModal, {
            modifier: 'flex',
            $content: $assetChooser,
        });
    }

    public closeAssetChooser(): void {
        window.application.connectors.events.notify(null, TerrificEvent.CloseModal, {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        window.application.connectors.events.components.appBridge.component.onAssetChooserAssetChosen = () => {};
    }

    // TODO: add tests (https://app.clickup.com/t/2qagxm6)
    public openTemplateChooser(callback: (selectedTemplate: Template) => void) {
        window.application.connectors.events.components.appBridge.component.onTemplateChooserTemplateChosen = (
            templateChooserResult,
        ) => {
            const formattedTemplate = this.mapTemplateApiToTemplate(templateChooserResult.template);
            callback({ ...templateChooserResult, ...templateChooserResult.template, ...formattedTemplate });
        };

        const $templateChooser = window.application.sandbox.config.tpl.render('c-templatechooser', {});
        window.application.connectors.events.notify(null, TerrificEvent.OpenModal, {
            modifier: 'flex',
            $content: $templateChooser,
        });
    }

    public closeTemplateChooser() {
        window.application.connectors.events.notify(null, TerrificEvent.CloseModal, {});
    }

    // TODO: add tests (https://app.clickup.com/t/2qagxm6)
    public async getCurrentLoggedUser(): Promise<User> {
        const response = await window.fetch('/api/user/info', {
            headers: {
                'x-csrf-token': (document.getElementsByName('x-csrf-token')[0] as HTMLMetaElement).content,
                'Content-Type': 'application/json',
            },
        });

        const responseJson = await response.json();

        if (!responseJson.success) {
            throw new Error('Could not get the current logged user');
        }

        return { ...responseJson, ...this.mapUserApiToUser(responseJson) };
    }

    private getBlockReferenceToken(): Nullable<string> {
        const blockElement = document.querySelector<HTMLElement>(`[data-block="${this.blockId}"]`);
        return blockElement?.dataset?.referenceToken ?? null;
    }

    private mapUserApiToUser(userApi: UserApi): User {
        return {
            id: userApi.id,
            name: userApi.name,
            email: userApi.email,
            image: {
                image: userApi.image.image,
                original: userApi.image.original,
                x: userApi.image.x,
                y: userApi.image.y,
                width: userApi.image.width,
                height: userApi.image.height,
            },
            created: userApi.created,
            role: userApi.role,
            language: userApi.language,
            timezone: userApi.timezone,
            organization: userApi.organization,
        };
    }

    private mapAssetChooserResultToAsset(asset: AssetChooserResult): Asset {
        return {
            id: asset.id,
            objectType: asset.object_type,
            extension: asset.ext,
            creatorName: asset.creator_name,
            externalUrl: asset.external_url,
            genericUrl: asset.generic_url,
            previewUrl: asset.preview_url,
            originUrl: asset.file_origin_url,
            fileName: asset.file_name,
            fileSize: asset.filesize,
            fileSizeHumanReadable: asset.file_size_formatted,
            height: asset.height,
            width: asset.width,
            projectId: asset.project,
            status: asset.status,
            title: asset.title,
            fileId: asset.file_id,
        };
    }

    private mapTemplateApiToTemplate(template: TemplateApi): Template {
        return {
            id: template.id,
            title: template.name,
            description: template.description,
            previewUrl: template.preview,
            projectId: template.project,
            height: template.height,
            width: template.width,
            published: template.published === 1,
        };
    }

    private mapDocumentBlockAssetApiToAsset(documentBlockAsset: DocumentBlockAssetApi): Asset {
        return {
            creatorName: '', // TODO: implement enriching of the data (https://app.clickup.com/t/29ad2bj)
            extension: documentBlockAsset.asset.ext,
            fileName: documentBlockAsset.asset.file_name,
            genericUrl: documentBlockAsset.asset.generic_url,
            originUrl: documentBlockAsset.asset.file_origin_url,
            externalUrl: documentBlockAsset.asset.external_url,
            height: documentBlockAsset.asset.height,
            id: documentBlockAsset.asset.id,
            objectType: documentBlockAsset.asset.object_type,
            previewUrl: documentBlockAsset.asset.preview_url,
            projectId: documentBlockAsset.asset.project_id,
            fileSize: documentBlockAsset.asset.file_size,
            fileSizeHumanReadable: documentBlockAsset.asset.file_size_formatted,
            status: documentBlockAsset.asset.status,
            title: documentBlockAsset.asset.title,
            width: documentBlockAsset.asset.width,
            fileId: documentBlockAsset.asset.file_id,
        };
    }

    private mapDocumentBlockAssetsApiToBlockAssets(
        documentBlockAssets: DocumentBlockAssetApi[],
    ): Record<string, Asset[]> {
        return documentBlockAssets.reduce(
            (stack: Record<string, Asset[]>, documentBlockAsset: DocumentBlockAssetApi) => {
                stack[documentBlockAsset.setting_id] = stack[documentBlockAsset.setting_id] ?? [];
                stack[documentBlockAsset.setting_id].push({
                    ...documentBlockAsset.asset,
                    ...this.mapDocumentBlockAssetApiToAsset(documentBlockAsset),
                });

                return stack;
            },
            {},
        );
    }

    private async waitForFinishedProcessing(key: string): Promise<void> {
        return new Promise((resolve) => {
            const intervalId = window.setInterval(async () => {
                const currentBlockAssets = await this.getBlockAssets();

                if (currentBlockAssets[key] && currentBlockAssets[key].every((asset) => asset.status === 'FINISHED')) {
                    clearInterval(intervalId);
                    resolve();
                }
            }, 1200);
        });
    }
}
