/* (c) Copyright Frontify Ltd., all rights reserved. */

import mitt from 'mitt';
import { SinonStubbedInstance, createStubInstance, spy } from 'sinon';
import { AppBridgeBlock } from '../AppBridgeBlock';
import { User } from '../types';
import { Emitter } from '../types/Emitter';
import type { Asset } from '../types/Asset';
import { AssetDummy } from './AssetDummy';
import { UserDummy } from './UserDummy';
import { ColorPaletteDummy } from './ColorPaletteDummy';
import { ColorDummy } from './ColorDummy';

const BLOCK_ID = 3452;
const SECTION_ID = 2341;
const USER_ID = 4561;

export type getAppBridgeBlockStubProps = {
    blockSettings?: Record<string, unknown>;
    blockAssets?: Record<string, Asset[]>;
    editorState?: boolean;
    openAssetChooser?: () => void;
    closeAssetChooser?: () => void;
    blockId?: number;
    sectionId?: number;
    user?: User;
};

export const getAppBridgeBlockStub = ({
    blockSettings = {},
    blockAssets = {},
    editorState = false,
    openAssetChooser = () => null,
    closeAssetChooser = () => null,
    blockId = BLOCK_ID,
    sectionId = SECTION_ID,
    user = UserDummy.with(USER_ID),
}: getAppBridgeBlockStubProps = {}): SinonStubbedInstance<AppBridgeBlock> => {
    window.emitter = spy(mitt()) as unknown as Emitter;

    window.blockSettings ??= {};
    window.blockSettings[blockId] = blockSettings;

    const deletedAssetIds: Record<string, number[]> = {};
    const addedAssetIds: Record<string, number[]> = {};

    const appBridgeBlock = createStubInstance(AppBridgeBlock, {
        getBlockId: blockId,
        getSectionId: sectionId,
        getEditorState: editorState,
        getBlockSettings: Promise.resolve(window.blockSettings),
        getAvailablePalettes: Promise.resolve([
            ColorPaletteDummy.with(678, 'Palette 1'),
            ColorPaletteDummy.with(427, 'Palette 2'),
            ColorPaletteDummy.with(679, 'Palette 3'),
        ]),
        getColorPalettes: Promise.resolve([
            ColorPaletteDummy.with(678, 'Palette 1'),
            ColorPaletteDummy.with(427, 'Palette 2'),
            ColorPaletteDummy.with(679, 'Palette 3'),
        ]),
        getColorsByIds: Promise.resolve([ColorDummy.red(9834), ColorDummy.green(342), ColorDummy.yellow(9314)]),
        getColorsByColorPaletteId: Promise.resolve([
            ColorDummy.red(9834),
            ColorDummy.green(342),
            ColorDummy.yellow(9314),
        ]),
        getColorPalettesWithColors: Promise.resolve([
            ColorPaletteDummy.with(678, 'Palette 1'),
            ColorPaletteDummy.with(427, 'Palette 2'),
            ColorPaletteDummy.with(679, 'Palette 3'),
        ]),
        getAvailableColors: Promise.resolve([]),
        getCurrentLoggedUser: Promise.resolve(user),
        downloadColorKit: '/api/color/export/6/zip/678,427,679',
    });

    appBridgeBlock.getAssetById.callsFake((assetId) => Promise.resolve(AssetDummy.with(assetId)));
    appBridgeBlock.closeAssetChooser.callsFake(closeAssetChooser);
    appBridgeBlock.openAssetChooser.callsFake(openAssetChooser);
    appBridgeBlock.getBlockAssets.callsFake(async () => {
        return Object.entries(blockAssets).reduce<Record<string, Asset[]>>((assetsDiff, [key, assets]) => {
            const addedAssetIdsList = addedAssetIds[key] ?? [];
            const deletedAssetIdsList = deletedAssetIds[key] ?? [];
            assetsDiff[key] = [
                ...assets.filter((asset) => !deletedAssetIdsList.includes(asset.id)),
                ...addedAssetIdsList.map((id) => AssetDummy.with(id)),
            ];
            return assetsDiff;
        }, {});
    });
    appBridgeBlock.addAssetIdsToBlockAssetKey.callsFake(async (key, assetsIds) => {
        addedAssetIds[key] = [...(addedAssetIds[key] ?? []), ...assetsIds];
    });
    appBridgeBlock.deleteAssetIdsFromBlockAssetKey.callsFake(async (key, assetIds) => {
        deletedAssetIds[key] = [...(deletedAssetIds[key] ?? []), ...assetIds];
    });

    return appBridgeBlock;
};
