/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Mock, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { AppBridgeTheme } from './AppBridgeTheme';
import {
    ColorDummy,
    ColorPaletteDummy,
    CoverPageApiDummy,
    CoverPageDummy,
    DocumentApiDummy,
    DocumentCategoryApiDummy,
    DocumentCategoryDummy,
    DocumentDummy,
    DocumentGroupApiDummy,
    DocumentGroupDummy,
    DocumentPageApiDummy,
    DocumentPageDummy,
    DocumentPageTargetsApiDummy,
    DocumentPageTargetsDummy,
    DocumentSectionApiDummy,
    DocumentSectionDummy,
    DocumentTargetsApiDummy,
    DocumentTargetsDummy,
    HttpUtilResponseDummy,
    UpdateTargetsApiDummy,
} from './tests';
import { HttpClient } from './utilities';
import { getColorPalettesByProjectId, getColorsByColorPaletteId, getHub, updateHub } from './repositories';
import { Emitter } from './types';

const PORTAL_ID = 652;
const PROJECT_ID = 453;
const DOCUMENT_PAGE_ID = 4562;
const PAGE_ID = 12312;
const DOCUMENT_ID = 35345;
const COLOR_PALETTE_ID = 500;
const TARGET_IDS = [2341, 6642, 2213];

describe('AppBridgeThemeTest', () => {
    const createEditButton = (enabled: boolean) => {
        const domElement = document.createElement('button');
        domElement.classList.add('js-co-powerbar__sg-edit');
        enabled && domElement.classList.add('state-active');
        document.body.appendChild(domElement);
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

        vi.mock('./repositories/ColorPaletteRepository', async (originalImplementation) => {
            const mod = await originalImplementation();

            return { ...(mod as object), getColorPalettesByProjectId: vi.fn() };
        });

        vi.mock('./repositories/ColorRepository', async (originalImplementation) => {
            const mod = await originalImplementation();

            return { ...(mod as object), getColorsByColorPaletteId: vi.fn() };
        });

        vi.mock('./repositories/HubRepository', async (originalImplementation) => {
            const mod = await originalImplementation();

            return {
                ...(mod as object),
                getHub: vi.fn(),
                updateHub: vi.fn(),
            };
        });

        setTranslationLanguage('');
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.restoreAllMocks();
    });

    it('should be instantiable', () => {
        expect(new AppBridgeTheme(PORTAL_ID)).toBeInstanceOf(AppBridgeTheme);
    });

    it('returns the hub id', () => {
        const appBridge = new AppBridgeTheme(PORTAL_ID);
        expect(appBridge.getPortalId()).toBe(PORTAL_ID);
    });

    it('returns the project id', () => {
        const appBridge = new AppBridgeTheme(PORTAL_ID);
        expect(appBridge.getProjectId()).toBe(PROJECT_ID);
    });

    it('returns true if document is in edit mode', () => {
        createEditButton(true);

        const appBridge = new AppBridgeTheme(PORTAL_ID);
        expect(appBridge.getEditorState()).toBeTruthy();
    });

    it('returns false if document is in view mode', () => {
        createEditButton(false);

        const appBridge = new AppBridgeTheme(PORTAL_ID);
        expect(appBridge.getEditorState()).toBeFalsy();
    });

    it('open the navigation manager', () => {
        const emitterEmitStub = vi.fn();
        window.emitter = { emit: emitterEmitStub } as unknown as Emitter;

        const appBridge = new AppBridgeTheme(PORTAL_ID);
        appBridge.openNavigationManager();

        expect(emitterEmitStub).toHaveBeenCalledWith('AppBridge:OpenNavigationManager');
    });

    it('return cover page', async () => {
        const coverPageFromApi = CoverPageApiDummy.with(123);
        const mappedCoverPage = CoverPageDummy.with(123);

        const mockHttpClientGet = vi.fn().mockReturnValue({ result: coverPageFromApi });

        HttpClient.get = mockHttpClientGet;

        const appBridge = new AppBridgeTheme(PORTAL_ID);
        const result = await appBridge.getCoverPage();

        expect(result).toEqual(mappedCoverPage);
    });

    it('return all documents without document groups', async () => {
        const documentsFromApi = [DocumentApiDummy.with(123), DocumentApiDummy.with(456)];
        const mappedDocuments = [DocumentDummy.with(123), DocumentDummy.with(456)];

        const mockHttpClientGet = vi.fn().mockReturnValue(HttpUtilResponseDummy.successWith(documentsFromApi));

        HttpClient.get = mockHttpClientGet;

        const appBridge = new AppBridgeTheme(PORTAL_ID);
        const result = await appBridge.getUngroupedDocuments();

        expect(result).toEqual(mappedDocuments);
    });

    it('returns all document groups', async () => {
        const documentGroupsFromApi = [
            DocumentGroupApiDummy.with(123, [123, 456]),
            DocumentGroupApiDummy.with(456, [123, 456]),
        ];

        const mockHttpClientGet = vi.fn().mockReturnValue(HttpUtilResponseDummy.successWith(documentGroupsFromApi));

        HttpClient.get = mockHttpClientGet;

        const mappedDocumentGroups = [
            DocumentGroupDummy.with(123, [123, 456]),
            DocumentGroupDummy.with(456, [123, 456]),
        ];

        const appBridge = new AppBridgeTheme(PORTAL_ID);
        const result = await appBridge.getDocumentGroups();

        expect(result).toEqual(mappedDocumentGroups);
    });

    it('returns all documents pages by document id', async () => {
        const documentPagesFromApi = [DocumentPageApiDummy.with(123), DocumentPageApiDummy.with(456)];
        const mappedDocumentPages = [DocumentPageDummy.with(123), DocumentPageDummy.with(456)];

        const mockHttpClientGet = vi.fn().mockReturnValue(HttpUtilResponseDummy.successWith(documentPagesFromApi));

        HttpClient.get = mockHttpClientGet;

        const appBridge = new AppBridgeTheme(PORTAL_ID);
        const result = await appBridge.getDocumentPagesByDocumentId(DOCUMENT_ID);

        expect(result).toEqual(mappedDocumentPages);
    });

    it('returns document categories by document id', async () => {
        const documentCategoriesFromApi = [DocumentCategoryApiDummy.with(123, [100, 200])];
        const mappedDocumentCategories = [DocumentCategoryDummy.with(123, [100, 200])];

        const mockHttpClientGet = vi.fn().mockReturnValue(HttpUtilResponseDummy.successWith(documentCategoriesFromApi));

        HttpClient.get = mockHttpClientGet;

        const appBridge = new AppBridgeTheme(PORTAL_ID);
        const result = await appBridge.getDocumentCategoriesByDocumentId(DOCUMENT_ID);

        expect(result).toEqual(mappedDocumentCategories);
    });

    it('returns uncategorized document pages by document id', async () => {
        const uncategorizedDocumentPagesFromApi = [DocumentPageApiDummy.with(123), DocumentPageApiDummy.with(456)];
        const mappedDocumentPages = [DocumentPageDummy.with(123), DocumentPageDummy.with(456)];

        const mockHttpClientGet = vi
            .fn()
            .mockReturnValue(HttpUtilResponseDummy.successWith(uncategorizedDocumentPagesFromApi));

        HttpClient.get = mockHttpClientGet;

        const appBridge = new AppBridgeTheme(PORTAL_ID);
        const result = await appBridge.getUncategorizedPagesByDocumentId(DOCUMENT_ID);

        expect(result).toEqual(mappedDocumentPages);
    });

    it('returns document section by document page id', async () => {
        const documentSectionsFromApi = [DocumentSectionApiDummy.with(123), DocumentSectionApiDummy.with(456)];
        const mappedDocumentSections = [DocumentSectionDummy.with(123), DocumentSectionDummy.with(456)];

        const mockHttpClientGet = vi.fn().mockReturnValue(HttpUtilResponseDummy.successWith(documentSectionsFromApi));

        HttpClient.get = mockHttpClientGet;

        const appBridge = new AppBridgeTheme(PORTAL_ID);
        const result = await appBridge.getDocumentSectionsByDocumentPageId(DOCUMENT_PAGE_ID);

        expect(result).toEqual(mappedDocumentSections);
    });

    it('getColorPalettes with success', () => {
        const colorPalettes = [ColorPaletteDummy.with(1)];

        (getColorPalettesByProjectId as Mock).mockReturnValue(colorPalettes);

        const appBridge = new AppBridgeTheme(PORTAL_ID);
        const result = appBridge.getColorPalettes();

        expect(getColorPalettesByProjectId).toHaveBeenCalledTimes(1);
        expect(result).resolves.toEqual(colorPalettes);
    });

    it('getColorsByColorPaletteId with success', () => {
        const colors = [ColorDummy.red()];

        (getColorsByColorPaletteId as Mock).mockReturnValue(colors);

        const appBridge = new AppBridgeTheme(PORTAL_ID);
        const result = appBridge.getColorsByColorPaletteId(COLOR_PALETTE_ID);

        expect(getColorsByColorPaletteId).toHaveBeenCalledTimes(1);
        expect(result).resolves.toEqual(colors);
    });

    it('returns document targets', async () => {
        const documentTargetsFromApi = DocumentTargetsApiDummy.with(DOCUMENT_ID);
        const mappedDocumentTargets = DocumentTargetsDummy.with(DOCUMENT_ID);

        const mockHttpClientGet = vi.fn().mockReturnValue({ result: documentTargetsFromApi });

        HttpClient.get = mockHttpClientGet;

        const appBridge = new AppBridgeTheme(PORTAL_ID);
        const result = await appBridge.getDocumentTargets(DOCUMENT_ID);

        expect(result).toEqual(mappedDocumentTargets);
    });

    it('returns updated document targets', async () => {
        const apiUpdateDocumentTargets = UpdateTargetsApiDummy.with(TARGET_IDS);
        const mockHttpClientPost = vi.fn().mockReturnValue(HttpUtilResponseDummy.successWith(apiUpdateDocumentTargets));

        HttpClient.post = mockHttpClientPost;

        const appBridge = new AppBridgeTheme(PORTAL_ID);
        const result = await appBridge.updateDocumentTargets([PAGE_ID], [DOCUMENT_ID]);

        expect(result).toEqual(apiUpdateDocumentTargets);
    });

    it('returns document page targets', async () => {
        const documentPageTargetsFromApi = DocumentPageTargetsApiDummy.with(DOCUMENT_PAGE_ID);
        const mappedDocumentPageTargets = DocumentPageTargetsDummy.with(DOCUMENT_PAGE_ID);

        const mockHttpClientGet = vi.fn().mockReturnValue({ result: documentPageTargetsFromApi });

        HttpClient.get = mockHttpClientGet;

        const appBridge = new AppBridgeTheme(PORTAL_ID);
        const result = await appBridge.getDocumentPageTargets(DOCUMENT_PAGE_ID);

        expect(result).toEqual(mappedDocumentPageTargets);
    });

    it('returns updated document page targets', async () => {
        const apiUpdateDocumentPageTargets = UpdateTargetsApiDummy.with(TARGET_IDS);
        const mockHttpClientPost = vi
            .fn()
            .mockReturnValue(HttpUtilResponseDummy.successWith(apiUpdateDocumentPageTargets));

        HttpClient.post = mockHttpClientPost;

        const appBridge = new AppBridgeTheme(PORTAL_ID);
        const result = await appBridge.updateDocumentPageTargets([PAGE_ID], [DOCUMENT_ID]);

        expect(result).toEqual(apiUpdateDocumentPageTargets);
    });

    it('returns the translation language', () => {
        setTranslationLanguage('de');

        const appBridge = new AppBridgeTheme(PROJECT_ID);
        expect(appBridge.getTranslationLanguage()).toBe('de');
    });

    it('return the cover page settings', async () => {
        const appBridge = new AppBridgeTheme(PORTAL_ID);
        await appBridge.getCoverPageSettings();

        expect(getHub).toHaveBeenCalledOnce();
        expect(getHub).toHaveBeenCalledWith(PORTAL_ID);
    });

    it('update the cover page settings', async () => {
        const appBridge = new AppBridgeTheme(PORTAL_ID);
        await appBridge.updateCoverPageSettings({ foo: 'bar' });

        expect(updateHub).toHaveBeenCalledOnce();
        expect(updateHub).toHaveBeenCalledWith(PORTAL_ID, { foo: 'bar' });
    });
});
