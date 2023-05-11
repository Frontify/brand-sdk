/* (c) Copyright Frontify Ltd., all rights reserved. */

import mitt, { Emitter } from 'mitt';
import { SinonStubbedInstance, spy, stub } from 'sinon';
import { AppBridgeBlock } from '../AppBridgeBlock';
import type { Asset } from '../types';
import { EmitterEvents, PrivacySettings, Template, User } from '../types';
import { DispatchActions } from '../types/AppBridgeBlock';
import { AssetDummy } from './AssetDummy';
import { BulkDownloadDummy } from './BulkDownloadDummy';
import { ColorDummy } from './ColorDummy';
import { ColorPaletteDummy } from './ColorPaletteDummy';
import { UserDummy } from './UserDummy';

const BLOCK_ID = 3452;
const SECTION_ID = 2341;
const USER_ID = 4561;
const PROJECT_ID = 345214;
const DISPATCH_CALL_ACTIONS: DispatchActions[] = [
    'openAssetChooser',
    'closeAssetChooser',
    'getBlockAssets',
    'AppBridge:OnBlockSettingsUpdated',
    'AppBridge:OffBlockSettingsUpdated',
    'AppBridge:BlockSettingsUpdated',
];

export type getAppBridgeBlockStubProps = {
    blockSettings?: Record<string, unknown>;
    blockAssets?: Record<string, Asset[]>;
    editorState?: boolean;
    openAssetChooser?: (callback: Parameters<AppBridgeBlock['openAssetChooser']>[0]) => void;
    closeAssetChooser?: () => void;
    blockId?: number;
    sectionId?: number;
    projectId?: number;
    user?: User;
    language?: string;
    privacySettings?: PrivacySettings;
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
    user = UserDummy.with(USER_ID),
    language = 'en',
    privacySettings = {
        assetViewerEnabled: false,
        assetDownloadEnabled: false,
    },
}: getAppBridgeBlockStubProps = {}): SinonStubbedInstance<AppBridgeBlock> => {
    window.emitter = spy(mitt()) as unknown as Emitter<EmitterEvents>;

    window.blockSettings ??= {};
    window.blockSettings[blockId] = blockSettings;

    const deletedAssetIds: Record<string, number[]> = {};
    const addedAssetIds: Record<string, number[]> = {};

    const dispatchReturnStubs = {
        openAssetChooser: stub<Parameters<AppBridgeBlock['openAssetChooser']>>().callsFake((callback) => {
            openAssetChooser(callback);
        }),
        closeAssetChooser: stub<Parameters<AppBridgeBlock['closeAssetChooser']>>().callsFake(() => {
            closeAssetChooser();
        }),
        getBlockAssets: stub<Parameters<AppBridgeBlock['getBlockAssets']>>().callsFake(async () => {
            return Object.entries(blockAssets).reduce<Record<string, Asset[]>>((assetsDiff, [key, assets]) => {
                const addedAssetIdsList = addedAssetIds[key] ?? [];
                const deletedAssetIdsList = deletedAssetIds[key] ?? [];
                assetsDiff[key] = [
                    ...assets.filter((asset) => !deletedAssetIdsList.includes(asset.id)),
                    ...addedAssetIdsList.map((id) => AssetDummy.with(id)),
                ];
                return assetsDiff;
            }, {});
        }),
        'AppBridge:OnBlockSettingsUpdated': stub<Parameters<AppBridgeBlock['dispatch']>>(),
        'AppBridge:OffBlockSettingsUpdated': stub<Parameters<AppBridgeBlock['dispatch']>>(),
        'AppBridge:BlockSettingsUpdated': stub<Parameters<AppBridgeBlock['dispatch']>>(),
    };

    const dispatchCallStub = stub<Parameters<AppBridgeBlock['dispatch']>>();
    // for (const action of DISPATCH_CALL_ACTIONS) {
    //     dispatchCallStub.withArgs(action).set(dispatchReturnStubs[action]);
    // }

    return {
        dispatch: dispatchCallStub,
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
        closeAssetChooser: dispatchReturnStubs.closeAssetChooser,

        getBlockAssets: dispatchReturnStubs.getBlockAssets,
        addAssetIdsToBlockAssetKey: stub<Parameters<AppBridgeBlock['addAssetIdsToBlockAssetKey']>>().callsFake(
            async (key, assetsIds) => {
                addedAssetIds[key] = [...(addedAssetIds[key] ?? []), ...assetsIds];
            },
        ),
        deleteAssetIdsFromBlockAssetKey: stub<
            Parameters<AppBridgeBlock['deleteAssetIdsFromBlockAssetKey']>
        >().callsFake(async (key, assetIds) => {
            deletedAssetIds[key] = [...(deletedAssetIds[key] ?? []), ...assetIds];
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
        openAssetChooser: dispatchReturnStubs.openAssetChooser,
        getBulkDownloadToken: stub<Parameters<AppBridgeBlock['getBulkDownloadToken']>>().resolves('token'),
        getBulkDownloadBySignature: stub<Parameters<AppBridgeBlock['getBulkDownloadBySignature']>>().resolves(
            BulkDownloadDummy.default(),
        ),
        getBulkDownloadByToken: stub<Parameters<AppBridgeBlock['getBulkDownloadByToken']>>().resolves(
            BulkDownloadDummy.default(),
        ),
        getPrivacySettings: stub<Parameters<AppBridgeBlock['getPrivacySettings']>>().returns(privacySettings),

        // TODO: Stub the following methods
        closeTemplateChooser: stub<Parameters<AppBridgeBlock['closeTemplateChooser']>>(),
        openTemplateChooser: stub<Parameters<AppBridgeBlock['openTemplateChooser']>>(),
        createColor: stub<Parameters<AppBridgeBlock['createColor']>>().resolves(ColorDummy.red()),
        deleteColor: stub<Parameters<AppBridgeBlock['deleteColor']>>().resolves(),
        getTemplateById: stub<Parameters<AppBridgeBlock['getTemplateById']>>().resolves({} as Template),
        openAssetViewer: stub<Parameters<AppBridgeBlock['openAssetViewer']>>(),
        updateBlockSettings: stub<Parameters<AppBridgeBlock['updateBlockSettings']>>().resolves(),
        getAllDocuments: stub<Parameters<AppBridgeBlock['getAllDocuments']>>().resolves(),
        getDocumentGroups: stub<Parameters<AppBridgeBlock['getDocumentGroups']>>().resolves(),
        getDocumentPagesByDocumentId: stub<Parameters<AppBridgeBlock['getDocumentPagesByDocumentId']>>().resolves(),
        getDocumentCategoriesByDocumentId:
            stub<Parameters<AppBridgeBlock['getDocumentCategoriesByDocumentId']>>().resolves(),
        getUncategorizedPagesByDocumentId:
            stub<Parameters<AppBridgeBlock['getUncategorizedPagesByDocumentId']>>().resolves(),
        getDocumentSectionsByDocumentPageId:
            stub<Parameters<AppBridgeBlock['getDocumentSectionsByDocumentPageId']>>().resolves(),
        getDocumentTargets: stub<Parameters<AppBridgeBlock['getDocumentTargets']>>().resolves(),
        getDocumentPageTargets: stub<Parameters<AppBridgeBlock['getDocumentPageTargets']>>().resolves(),
    };
};
