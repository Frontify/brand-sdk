/* (c) Copyright Frontify Ltd., all rights reserved. */

import mitt, { type Emitter } from 'mitt';
import { type SinonStubbedInstance, spy, stub } from 'sinon';

import { type EventCallbackParameter } from '../AppBridge';
import { type AppBridgeBlock, type BlockEvent } from '../AppBridgeBlock';
import { type Template, type TemplateLegacy, type User } from '../types';
import { type Asset } from '../types/Asset';
import { type EmitterEvents } from '../types/Emitter';
import { type PrivacySettings } from '../types/PrivacySettings';

import { AssetDummy } from './AssetDummy';
import { BulkDownloadDummy } from './BulkDownloadDummy';
import { ColorDummy } from './ColorDummy';
import { ColorPaletteDummy } from './ColorPaletteDummy';
import { DocumentSectionApiDummy } from './DocumentSectionApiDummy';
import { TemplateDummy } from './TemplateDummy';
import { TemplateLegacyDummy } from './TemplateLegacyDummy';
import { UserDummy } from './UserDummy';

const BLOCK_ID = 3452;
const SECTION_ID = 2341;
const USER_ID = 4561;
const PROJECT_ID = 345214;

export type getAppBridgeBlockStubProps = {
    blockSettings?: Record<string, unknown>;
    blockAssets?: Record<string, Asset[]>;
    editorState?: boolean;
    openAssetChooser?: (callback: Parameters<AppBridgeBlock['openAssetChooser']>[0]) => void;
    closeAssetChooser?: () => void;
    blockId?: number;
    sectionId?: number;
    projectId?: number;
    isNewlyInserted?: boolean;
    isAuthenticated?: boolean;
    user?: User;
    language?: string;
    privacySettings?: PrivacySettings;
    blockTemplates?: Record<string, Template[]>;
    unsubscribe?: () => void;
};

export const getAppBridgeBlockStub = ({
    blockSettings = {},
    blockAssets = {},
    editorState = false,
    openAssetChooser = () => null,
    closeAssetChooser = () => null,
    blockId = BLOCK_ID,
    sectionId = SECTION_ID,
    projectId = PROJECT_ID,
    isNewlyInserted = false,
    isAuthenticated = true,
    user = UserDummy.with(USER_ID),
    language = 'en',
    privacySettings = {
        assetViewerEnabled: false,
        assetDownloadEnabled: false,
    },
    blockTemplates = {},
    unsubscribe = () => null,
}: getAppBridgeBlockStubProps = {}): SinonStubbedInstance<AppBridgeBlock> => {
    window.emitter = spy(mitt()) as unknown as Emitter<EmitterEvents>;

    window.blockSettings ??= {};
    window.blockSettings[blockId] = blockSettings;

    const deletedAssetIds: Record<string, number[]> = {};
    const addedAssetIds: Record<string, number[]> = {};
    const deletedTemplateIds: Record<string, number[]> = {};
    const addedTemplateIds: Record<string, number[]> = {};

    return {
        getBlockId: stub<Parameters<AppBridgeBlock['getBlockId']>>().returns(blockId),
        getSectionId: stub<Parameters<AppBridgeBlock['getSectionId']>>().returns(sectionId),
        getProjectId: stub<Parameters<AppBridgeBlock['getProjectId']>>().returns(projectId),
        getEditorState: stub<Parameters<AppBridgeBlock['getEditorState']>>().returns(editorState),
        getBlockSettings: stub<Parameters<AppBridgeBlock['getBlockSettings']>>().resolves(window.blockSettings),
        getAvailablePalettes: stub<Parameters<AppBridgeBlock['getAvailablePalettes']>>().resolves([
            ColorPaletteDummy.with(678, 'Palette 1'),
            ColorPaletteDummy.with(427, 'Palette 2'),
            ColorPaletteDummy.with(679, 'Palette 3'),
        ]),
        getColorPalettes: stub<Parameters<AppBridgeBlock['getColorPalettes']>>().resolves([
            ColorPaletteDummy.with(678, 'Palette 1'),
            ColorPaletteDummy.with(427, 'Palette 2'),
            ColorPaletteDummy.with(679, 'Palette 3'),
        ]),
        createColorPalette: stub<Parameters<AppBridgeBlock['createColorPalette']>>().resolves(
            ColorPaletteDummy.with(678),
        ),
        updateColorPalette: stub<Parameters<AppBridgeBlock['updateColorPalette']>>().resolves(
            ColorPaletteDummy.with(678),
        ),
        getColorsByIds: stub<Parameters<AppBridgeBlock['getColorsByIds']>>().resolves([
            ColorDummy.red(9834),
            ColorDummy.green(342),
            ColorDummy.yellow(9314),
        ]),
        getColorsByColorPaletteId: stub<Parameters<AppBridgeBlock['getColorsByColorPaletteId']>>().resolves([
            ColorDummy.red(9834),
            ColorDummy.green(342),
            ColorDummy.yellow(9314),
        ]),
        getColorPalettesWithColors: stub<Parameters<AppBridgeBlock['getColorPalettesWithColors']>>().resolves([
            ColorPaletteDummy.with(678, 'Palette 1'),
            ColorPaletteDummy.with(427, 'Palette 2'),
            ColorPaletteDummy.with(679, 'Palette 3'),
        ]),
        deleteColorPalette: stub<Parameters<AppBridgeBlock['deleteColorPalette']>>().resolves(),
        getAvailableColors: stub<Parameters<AppBridgeBlock['getAvailableColors']>>().resolves([]),
        getCurrentLoggedUser: stub<Parameters<AppBridgeBlock['getCurrentLoggedUser']>>().resolves(user),
        downloadColorKit: stub<Parameters<AppBridgeBlock['downloadColorKit']>>().returns(
            `/api/color/export/${PROJECT_ID}/zip/500`,
        ),
        getAssetById: stub<Parameters<AppBridgeBlock['getAssetById']>>().callsFake((assetId) =>
            Promise.resolve(AssetDummy.with(assetId)),
        ),
        closeAssetChooser: stub<Parameters<AppBridgeBlock['closeAssetChooser']>>().callsFake(() => {
            closeAssetChooser();
        }),
        openAssetChooser: stub<Parameters<AppBridgeBlock['openAssetChooser']>>().callsFake((callback) => {
            openAssetChooser(callback);
        }),
        getBlockAssets: stub<Parameters<AppBridgeBlock['getBlockAssets']>>().callsFake(async () => {
            return Promise.resolve(
                Object.entries(blockAssets).reduce<Record<string, Asset[]>>((assetsDiff, [key, assets]) => {
                    const addedAssetIdsList = addedAssetIds[key] ?? [];
                    const deletedAssetIdsList = deletedAssetIds[key] ?? [];
                    assetsDiff[key] = [
                        ...assets.filter((asset) => !deletedAssetIdsList.includes(asset.id)),
                        ...addedAssetIdsList.map((id) => AssetDummy.with(id)),
                    ];
                    return assetsDiff;
                }, {}),
            );
        }),
        addAssetIdsToBlockAssetKey: stub<Parameters<AppBridgeBlock['addAssetIdsToBlockAssetKey']>>().callsFake(
            (key, assetsIds) => {
                addedAssetIds[key] = [...(addedAssetIds[key] ?? []), ...assetsIds];
            },
        ),
        deleteAssetIdsFromBlockAssetKey: stub<
            Parameters<AppBridgeBlock['deleteAssetIdsFromBlockAssetKey']>
        >().callsFake((key, assetIds) => {
            deletedAssetIds[key] = [...(deletedAssetIds[key] ?? []), ...assetIds];
        }),
        getBlockTemplates: stub<Parameters<AppBridgeBlock['getBlockTemplates']>>().callsFake(async () => {
            return Promise.resolve(
                Object.entries(blockTemplates).reduce<Record<string, Template[]>>((templatesDiff, [key, templates]) => {
                    const addedTemplateIdsList = addedTemplateIds[key] ?? [];
                    const deletedTemplateIdsList = deletedTemplateIds[key] ?? [];
                    templatesDiff[key] = [
                        ...templates.filter((template) => !deletedTemplateIdsList.includes(template.id)),
                        ...addedTemplateIdsList.map((id) => TemplateDummy.with(id)),
                    ];
                    return templatesDiff;
                }, {}),
            );
        }),
        addTemplateIdsToBlockTemplateKey: stub<
            Parameters<AppBridgeBlock['addTemplateIdsToBlockTemplateKey']>
        >().callsFake((key, templateIds) => {
            addedTemplateIds[key] = [...(addedTemplateIds[key] ?? []), ...templateIds];
        }),
        deleteTemplateIdsFromBlockTemplateKey: stub<
            Parameters<AppBridgeBlock['deleteTemplateIdsFromBlockTemplateKey']>
        >().callsFake((key, templateIds) => {
            deletedTemplateIds[key] = [...(deletedTemplateIds[key] ?? []), ...templateIds];
        }),
        getTranslationLanguage: stub<Parameters<AppBridgeBlock['getTranslationLanguage']>>().returns(language),
        getColors: stub<Parameters<AppBridgeBlock['getColors']>>().resolves([
            ColorDummy.red(9834),
            ColorDummy.green(342),
            ColorDummy.yellow(9314),
        ]),
        updateColor: stub<Parameters<AppBridgeBlock['updateColor']>>().callsFake((colorId) =>
            Promise.resolve(ColorDummy.red(colorId)),
        ),
        getBulkDownloadBySignature: stub<Parameters<AppBridgeBlock['getBulkDownloadBySignature']>>().resolves(
            BulkDownloadDummy.default(),
        ),
        getBulkDownloadByToken: stub<Parameters<AppBridgeBlock['getBulkDownloadByToken']>>().resolves(
            BulkDownloadDummy.default(),
        ),
        getPrivacySettings: stub<Parameters<AppBridgeBlock['getPrivacySettings']>>().returns(privacySettings),
        api: stub<Parameters<AppBridgeBlock['api']>>().callsFake((args) => {
            switch (args.name) {
                case 'getAssetBulkDownloadToken': {
                    return { assetBulkDownloadToken: 'token' };
                }
                case 'setAssetIdsByBlockAssetKey': {
                    blockAssets[args.payload.key] = args.payload.assetIds.map((id) => AssetDummy.with(id));
                    return Promise.resolve();
                }
            }

            throw new Error('Method is not stubbed');
        }),

        context: stub<Parameters<AppBridgeBlock['context']>>().callsFake((args) => {
            if (args === undefined) {
                return {
                    get: () => [blockId, sectionId, isAuthenticated],
                };
            } else {
                switch (args) {
                    case 'blockId':
                        return {
                            get: () => blockId,
                        };
                    case 'sectionId':
                        return {
                            get: () => sectionId,
                        };

                    case 'isAuthenticated':
                        return {
                            get: () => isAuthenticated,
                        };
                    case 'isNewlyInserted':
                        return {
                            get: () => isNewlyInserted,
                        };
                    default:
                        return {
                            get: () => {
                                throw new Error(`Unknown context key: ${args}`);
                            },
                        };
                }
            }
        }),

        subscribe: stub<Parameters<AppBridgeBlock['subscribe']>>().callsFake((eventName, callback) => {
            if (eventName === 'assetsChosen') {
                (callback as EventCallbackParameter<'assetsChosen', BlockEvent>)({ assets: [AssetDummy.with(123)] });
            } else if (eventName === 'templateChosen') {
                (callback as EventCallbackParameter<'templateChosen', BlockEvent>)({
                    template: TemplateLegacyDummy.with(234),
                });
            }
            return unsubscribe;
        }),

        getDocumentSectionsByDocumentPageId: stub<
            Parameters<AppBridgeBlock['getDocumentSectionsByDocumentPageId']>
        >().resolves([
            DocumentSectionApiDummy.withFields({ id: 1, title: 'Title 1' }),
            DocumentSectionApiDummy.withFields({ id: 2, title: 'Title 2' }),
            DocumentSectionApiDummy.withFields({ id: 3, title: '  ' }),
            DocumentSectionApiDummy.withFields({ id: 4, title: '' }),
        ]),

        // TODO: Stub the following methods
        closeTemplateChooser: stub<Parameters<AppBridgeBlock['closeTemplateChooser']>>(),
        openTemplateChooser: stub<Parameters<AppBridgeBlock['openTemplateChooser']>>(),
        createColor: stub<Parameters<AppBridgeBlock['createColor']>>().resolves(ColorDummy.red()),
        deleteColor: stub<Parameters<AppBridgeBlock['deleteColor']>>().resolves(),
        getTemplateById: stub<Parameters<AppBridgeBlock['getTemplateById']>>().resolves({} as TemplateLegacy),
        openAssetViewer: stub<Parameters<AppBridgeBlock['openAssetViewer']>>(),
        updateBlockSettings: stub<Parameters<AppBridgeBlock['updateBlockSettings']>>().resolves(),
        getAllDocuments: stub<Parameters<AppBridgeBlock['getAllDocuments']>>().resolves(),
        getUngroupedDocuments: stub<Parameters<AppBridgeBlock['getUngroupedDocuments']>>().resolves(),
        getDocumentsByDocumentGroupId: stub<Parameters<AppBridgeBlock['getDocumentsByDocumentGroupId']>>().resolves(),
        getDocumentGroups: stub<Parameters<AppBridgeBlock['getDocumentGroups']>>().resolves(),
        getDocumentPagesByDocumentId: stub<Parameters<AppBridgeBlock['getDocumentPagesByDocumentId']>>().resolves(),
        getDocumentPagesByDocumentCategoryId:
            stub<Parameters<AppBridgeBlock['getDocumentPagesByDocumentCategoryId']>>().resolves(),
        getDocumentCategoriesByDocumentId:
            stub<Parameters<AppBridgeBlock['getDocumentCategoriesByDocumentId']>>().resolves(),
        getUncategorizedDocumentPagesByDocumentId:
            stub<Parameters<AppBridgeBlock['getUncategorizedDocumentPagesByDocumentId']>>().resolves(),
        getDocumentTargets: stub<Parameters<AppBridgeBlock['getDocumentTargets']>>().resolves(),
        getDocumentPageTargets: stub<Parameters<AppBridgeBlock['getDocumentPageTargets']>>().resolves(),
        state: stub<Parameters<AppBridgeBlock['state']>>().resolves(),
        dispatch: stub<Parameters<AppBridgeBlock['dispatch']>>().resolves(),
    };
};
