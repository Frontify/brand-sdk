/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Mock, afterEach, beforeAll, describe, expect, it, test, vi } from 'vitest';
import { AppBridgeBlock } from './AppBridgeBlock';
import * as ColorPaletteRepository from './repositories/ColorPaletteRepository';
import {
    createColorPalette,
    deleteColorPalette,
    getColorPalettesByProjectId,
    updateColorPalette,
} from './repositories/ColorPaletteRepository';
import { createColor, deleteColor, getColorsByColorPaletteId, updateColor } from './repositories/ColorRepository';
import {
    AssetApiDummy,
    AssetDummy,
    ColorApiPatchDummy,
    ColorCreateDummy,
    ColorDummy,
    ColorPaletteApiCreateDummy,
    ColorPaletteApiPatchDummy,
    ColorPaletteCreateDummy,
    ColorPaletteDummy,
    ColorPatchDummy,
} from './tests';
import { Emitter, TerrificEvent } from './types';
import { HttpClient } from './utilities/httpClient';

const BLOCK_ID = 352;
const SECTION_ID = 653;
const BLOCK_REFERENCE_TOKEN = 'block-reference-token';
const PROJECT_ID = 453;
const COLOR_PALETTE_ID = 500;
const COLOR_ID = 231;

describe('AppBridgeBlockTest', () => {
    const createEditButton = (enabled: boolean) => {
        const domElement = document.createElement('button');
        domElement.classList.add('js-co-powerbar__sg-edit');
        enabled && domElement.classList.add('state-active');
        document.body.appendChild(domElement);
    };

    const createBlockDiv = (blockId: number, isReferenced: boolean) => {
        const blockDomElement = document.createElement('div');
        blockDomElement.setAttribute('data-block', blockId.toString());
        if (isReferenced) {
            blockDomElement.dataset.referenceToken = BLOCK_REFERENCE_TOKEN;
            blockDomElement.setAttribute('data-reference-token', BLOCK_REFERENCE_TOKEN);
        }
        document.body.appendChild(blockDomElement);
    };

    const setTranslationLanguage = (translationLanguage: string) => {
        document.body.setAttribute('data-translation-language', translationLanguage);
    };

    beforeAll(() => {
        window.application = {
            ...window.application,
            sandbox: {
                ...window.application?.sandbox,
                config: {
                    ...window.application?.sandbox?.config,
                    tpl: {
                        ...window.application?.sandbox?.config?.tpl,
                        render: () => 'tpl-mock',
                    },
                    context: {
                        ...window.application?.sandbox?.config?.context,
                        project: {
                            ...window.application?.sandbox?.config?.context?.project,
                            id: PROJECT_ID,
                        },
                    },
                },
            },
        };
        window.blockSettings = {};

        vi.mock('./repositories/ColorPaletteRepository', async () => ({
            ...(await vi.importActual<typeof ColorPaletteRepository>('./repositories/ColorPaletteRepository')),
            createColorPalette: vi.fn(),
            deleteColorPalette: vi.fn(),
            getColorPalettesByProjectId: vi.fn(),
            updateColorPalette: vi.fn(),
        }));

        vi.mock('./repositories/ColorRepository', async () => ({
            ...(await vi.importActual<typeof ColorPaletteRepository>('./repositories/ColorRepository')),
            createColor: vi.fn(),
            deleteColor: vi.fn(),
            getColorsByColorPaletteId: vi.fn(),
            updateColor: vi.fn(),
        }));
    });

    beforeAll(() => {
        setTranslationLanguage('');
    });

    afterEach(() => {
        document.body.innerHTML = '';
        document.body.setAttribute('data-translation-language', '');
        vi.clearAllMocks();
    });

    it('should be instantiable', () => {
        expect(new AppBridgeBlock(BLOCK_ID, SECTION_ID)).toBeInstanceOf(AppBridgeBlock);
    });

    it('returns the block id', () => {
        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        expect(appBridge.getBlockId()).toBe(BLOCK_ID);
    });

    it('returns the section id', () => {
        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        expect(appBridge.getSectionId()).toBe(SECTION_ID);
    });

    it('returns undefined if no section id is provided', () => {
        const appBridge = new AppBridgeBlock(BLOCK_ID);
        expect(appBridge.getSectionId()).toBeUndefined();
    });

    it('returns the project id', () => {
        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        expect(appBridge.getProjectId()).toBe(PROJECT_ID);
    });

    it('returns empty string for default language', () => {
        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        expect(appBridge.getTranslationLanguage()).toBe('');
    });

    it('returns the translation language', () => {
        setTranslationLanguage('de');

        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        expect(appBridge.getTranslationLanguage()).toBe('de');
    });

    it('returns true if document is in edit mode', () => {
        createEditButton(true);
        createBlockDiv(BLOCK_ID, false);

        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        expect(appBridge.getEditorState()).toBeTruthy();
    });

    it('returns false if document is in view mode', () => {
        createEditButton(false);
        createBlockDiv(BLOCK_ID, false);

        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        expect(appBridge.getEditorState()).toBeFalsy();
    });

    it('returns false if document is in edit mode but block is referenced', () => {
        createEditButton(true);
        createBlockDiv(BLOCK_ID, true);

        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        expect(appBridge.getEditorState()).toBeFalsy();
    });

    it('returns false if document is in view mode but block is referenced', () => {
        createEditButton(false);
        createBlockDiv(BLOCK_ID, true);

        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        expect(appBridge.getEditorState()).toBeFalsy();
    });

    it('closes the asset chooser', () => {
        const notifyStub = vi.fn();

        window.application = {
            ...window.application,
            connectors: {
                ...window.application.connectors,
                events: {
                    ...window.application.connectors.events,
                    notify: notifyStub,
                },
            },
        };

        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        appBridge.closeAssetChooser();
        expect(notifyStub).toHaveBeenCalledWith(null, TerrificEvent.CloseModal, {});
    });

    test('unregisters onAssetChooserAssetChosen when closing asset chooser', () => {
        const onAssetChooserAssetChosen = () => {
            window.application.connectors.events.components.appBridge.component.onAssetChooserAssetChosen({
                screenData: [
                    {
                        ...AssetApiDummy.with(1),
                        project: 1,
                        filesize: 1,
                    },
                ],
            });
        };

        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        const callbackSpy = vi.fn();
        appBridge.openAssetChooser(callbackSpy);
        onAssetChooserAssetChosen();
        expect(callbackSpy.mock.calls).toHaveLength(1);
        callbackSpy.mockClear();

        appBridge.closeAssetChooser();
        onAssetChooserAssetChosen();
        expect(callbackSpy.mock.calls).toHaveLength(0);
    });

    it('closes the template chooser', () => {
        const notifyStub = vi.fn();

        window.application = {
            ...window.application,
            connectors: {
                ...window.application.connectors,
                events: {
                    ...window.application.connectors.events,
                    notify: notifyStub,
                },
            },
        };

        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        appBridge.closeTemplateChooser();
        expect(notifyStub).toHaveBeenCalledWith(null, TerrificEvent.CloseModal, {});
    });

    test('getColorPalettes with success', () => {
        const colorPalettes = [ColorPaletteDummy.with(1)];

        (getColorPalettesByProjectId as Mock).mockReturnValue(colorPalettes);

        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        const result = appBridge.getColorPalettes();

        expect(getColorPalettesByProjectId).toHaveBeenCalledTimes(1);
        expect(result).resolves.toEqual(colorPalettes);
    });

    test('getColorsByColorPaletteId with success', () => {
        const colors = [ColorDummy.red()];

        (getColorsByColorPaletteId as Mock).mockReturnValue(colors);

        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        const result = appBridge.getColorsByColorPaletteId(COLOR_PALETTE_ID);

        expect(getColorsByColorPaletteId).toHaveBeenCalledTimes(1);
        expect(result).resolves.toEqual(colors);
    });

    test('getColors with success', () => {
        const colorPalette1 = ColorPaletteDummy.with(100);
        const colorPalette2 = ColorPaletteDummy.with(200);

        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        appBridge.getColorPalettes = vi.fn().mockReturnValueOnce([colorPalette1, colorPalette2]);
        appBridge.getColorsByColorPaletteId = vi
            .fn()
            .mockReturnValueOnce(colorPalette1.colors)
            .mockReturnValueOnce(colorPalette2.colors);

        const result = appBridge.getColors();
        expect(result).resolves.toEqual([...colorPalette1.colors, ...colorPalette2.colors]);
    });

    test('getColors with no colors', () => {
        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        appBridge.getColorPalettes = vi.fn().mockReturnValueOnce([]);

        const result = appBridge.getColors();
        expect(result).resolves.toEqual([]);
    });

    test('getColorsByIds with success', () => {
        const expectedColors = [ColorDummy.red(700), ColorDummy.yellow(800)];

        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        appBridge.getColors = vi.fn().mockReturnValueOnce([ColorDummy.green(900)].concat(expectedColors));

        const result = appBridge.getColorsByIds([700, 800]);
        expect(result).resolves.toEqual(expectedColors);
    });

    test('getColorsByIds with no result', () => {
        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        appBridge.getColors = vi.fn().mockReturnValueOnce([ColorDummy.green(900)]);

        const result = appBridge.getColorsByIds([700]);
        expect(result).resolves.toEqual([]);
    });

    test('getAvailableColors', () => {
        const colors = [ColorDummy.green(900)];

        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        appBridge.getColors = vi.fn().mockReturnValueOnce(colors);

        const result = appBridge.getAvailableColors(); //NOSONAR
        expect(result).resolves.toEqual(colors);
    });

    test('getAvailablePalettes', () => {
        const colorPalettes = [ColorPaletteDummy.with(900)];

        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        appBridge.getColorPalettes = vi.fn().mockReturnValueOnce(colorPalettes);

        const result = appBridge.getAvailablePalettes(); //NOSONAR
        expect(result).resolves.toEqual(colorPalettes);
    });

    test('createColor with success', () => {
        const color = ColorDummy.red();
        (createColor as Mock).mockReturnValue(color);

        const colorCreate = ColorCreateDummy.red();
        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        const result = appBridge.createColor(colorCreate);

        expect(createColor).toHaveBeenCalledTimes(1);
        expect(result).resolves.toEqual(color);
    });

    test('createColorPalette with success', () => {
        const colorPalette = ColorPaletteDummy.with(COLOR_PALETTE_ID);
        (createColorPalette as Mock).mockReturnValue(colorPalette);

        const colorPaletteCreate = ColorPaletteCreateDummy.with();
        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        const result = appBridge.createColorPalette(colorPaletteCreate);

        const colorPaletteApiCreate = ColorPaletteApiCreateDummy.with(PROJECT_ID);

        expect(createColorPalette).toHaveBeenCalledTimes(1);
        expect(createColorPalette).toBeCalledWith(colorPaletteApiCreate);
        expect(result).resolves.toEqual(colorPalette);
    });

    test('getColorPalettesWithColors with no ids success', () => {
        const colorPalette1 = ColorPaletteDummy.with(1);
        const colorPalette2 = ColorPaletteDummy.with(2);

        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        appBridge.getColorPalettes = vi.fn().mockReturnValueOnce([colorPalette1, colorPalette2]);
        appBridge.getColorsByColorPaletteId = vi
            .fn()
            .mockReturnValueOnce(colorPalette1.colors)
            .mockReturnValueOnce(colorPalette2.colors);

        const result = appBridge.getColorPalettesWithColors();

        expect(result).resolves.toEqual([colorPalette1, colorPalette2]);
    });

    test('getColorPalettesWithColors with ids success', () => {
        const colorPalette = ColorPaletteDummy.with(1);

        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        appBridge.getColorPalettes = vi.fn().mockReturnValueOnce([colorPalette]);
        appBridge.getColorsByColorPaletteId = vi.fn().mockReturnValueOnce(colorPalette.colors);

        const result = appBridge.getColorPalettesWithColors([1]);

        expect(result).resolves.toEqual([colorPalette]);
    });

    test('updateColorPalette with default language', () => {
        const colorPalette = ColorPaletteDummy.with(COLOR_PALETTE_ID);
        (updateColorPalette as Mock).mockReturnValue(colorPalette);

        const colorPaletteApiPatch = ColorPaletteApiPatchDummy.with();

        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        const result = appBridge.updateColorPalette(COLOR_PALETTE_ID, colorPaletteApiPatch);

        expect(updateColorPalette).toHaveBeenCalledTimes(1);
        expect(updateColorPalette).toBeCalledWith(COLOR_PALETTE_ID, colorPaletteApiPatch);
        expect(result).resolves.toEqual(colorPalette);
    });

    test('updateColorPalette with language set', () => {
        setTranslationLanguage('de');

        const colorPalette = ColorPaletteDummy.with(COLOR_PALETTE_ID);
        (updateColorPalette as Mock).mockReturnValue(colorPalette);

        const colorPaletteApiPatch = ColorPaletteApiPatchDummy.with();

        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        const result = appBridge.updateColorPalette(COLOR_PALETTE_ID, colorPaletteApiPatch);

        expect(updateColorPalette).toHaveBeenCalledTimes(1);
        expect(updateColorPalette).toBeCalledWith(COLOR_PALETTE_ID, { ...colorPaletteApiPatch, language: 'de' });
        expect(result).resolves.toEqual(colorPalette);
    });

    test('deleteColorPalette with success', () => {
        (deleteColorPalette as Mock).mockReturnValue(true);

        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        const result = appBridge.deleteColorPalette(COLOR_PALETTE_ID);

        expect(deleteColorPalette).toHaveBeenCalledTimes(1);
        expect(result).resolves.toEqual(true);
    });

    test('updateColor with default language', () => {
        setTranslationLanguage('');

        const color = ColorDummy.red();
        (updateColor as Mock).mockReturnValue(color);

        const colorPatch = ColorPatchDummy.red();
        const colorApiPatch = ColorApiPatchDummy.red();

        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        const result = appBridge.updateColor(COLOR_ID, colorPatch);

        expect(updateColor).toHaveBeenCalledTimes(1);
        expect(updateColor).toBeCalledWith(COLOR_ID, colorApiPatch);
        expect(result).resolves.toEqual(color);
    });

    test('updateColor with language set', () => {
        setTranslationLanguage('de');

        const color = ColorPaletteDummy.with(COLOR_PALETTE_ID);
        (updateColor as Mock).mockReturnValue(color);

        const colorPatch = ColorPatchDummy.red();
        const colorApiPatch = ColorApiPatchDummy.red();

        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        const result = appBridge.updateColor(COLOR_PALETTE_ID, colorPatch);

        expect(updateColor).toHaveBeenCalledTimes(1);
        expect(updateColor).toBeCalledWith(COLOR_PALETTE_ID, { ...colorApiPatch, language: 'de' });
        expect(result).resolves.toEqual(color);
    });

    test('deleteColor with success', () => {
        (deleteColor as Mock).mockReturnValue(true);

        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        const result = appBridge.deleteColor(COLOR_ID);

        expect(deleteColor).toHaveBeenCalledTimes(1);
        expect(result).resolves.toEqual(true);
    });

    test('downloadColorKit with success', () => {
        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        const result = appBridge.downloadColorKit([COLOR_PALETTE_ID]);

        expect(result).toEqual(expect.stringContaining('api/color/export'));
    });

    const appendPageElement = (pageId: number | null = null) => {
        const element = document.createElement('div');
        element.setAttribute('class', 'page');
        (element as HTMLDivElement & { jQueryPage: { id: number | null } }).jQueryPage = { id: pageId };
        document.body.append(element);
    };

    test('throws when no page id available', async () => {
        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        const settings = { foo: 'bar' };

        appendPageElement();

        expect(async () => await appBridge.updateBlockSettings(settings)).rejects.toThrowError('Page ID not found');
    });

    test('throws when update call unsuccessful', async () => {
        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        const settings = { foo: 'bar' };

        appendPageElement(1);

        const mockHttpClientPost = vi.fn().mockReturnValue({ result: { success: false } });
        HttpClient.post = mockHttpClientPost;

        expect(async () => await appBridge.updateBlockSettings(settings)).rejects.toThrowError(
            'Could not update the block settings',
        );
    });

    test('updates window block settings on updateBlockSettings', async () => {
        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);
        const settings = { foo: 'bar' };

        appendPageElement(1);

        const mockHttpClientPost = vi.fn().mockReturnValue({ result: { success: true } });
        HttpClient.post = mockHttpClientPost;

        await appBridge.updateBlockSettings(settings);

        expect(window.blockSettings[BLOCK_ID]).toEqual(settings);
    });

    test('openAssetViewer emits AppBridge:ViewerOpened event', () => {
        const emitterEmitStub = vi.fn();
        window.emitter = { emit: emitterEmitStub } as unknown as Emitter;

        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);

        const asset = AssetDummy.with(1);
        appBridge.openAssetViewer(asset.token);

        expect(emitterEmitStub).toHaveBeenCalledWith('AppBridge:ViewerOpened', { token: asset.token });
    });
});
