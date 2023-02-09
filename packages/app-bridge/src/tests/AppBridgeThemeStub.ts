/* (c) Copyright Frontify Ltd., all rights reserved. */

import mitt from 'mitt';
import { SinonStubbedInstance, createStubInstance, spy } from 'sinon';

import { Emitter } from '../types/Emitter';
import { AppBridgeTheme } from '../AppBridgeTheme';

import {
    BrandportalLinkDummy,
    ColorDummy,
    ColorPaletteDummy,
    CoverPageDummy,
    DocumentCategoryDummy,
    DocumentDummy,
    DocumentGroupDummy,
    DocumentPageDummy,
    DocumentPageDuplicateDummy,
    DocumentSectionDummy,
    TargetsDummy,
} from '.';

const PROJECT_ID = 3452;
const PORTAL_ID = 7777;
const DOCUMENT_GROUP_ID_1 = 5332;
const DOCUMENT_GROUP_ID_2 = 95694;
const DOCUMENT_GROUP_ID_3 = 345882;
const DOCUMENT_ID_1 = 6456;
const DOCUMENT_ID_2 = 34532;
const DOCUMENT_ID_3 = 3455345;
const DOCUMENT_ID_4 = 2342;
const DOCUMENT_ID_5 = 2343445;
const GROUPED_DOCUMENT_ID_1 = 2434;
const GROUPED_DOCUMENT_ID_2 = 552;
const GROUPED_DOCUMENT_ID_3 = 1145;
const GROUPED_DOCUMENT_ID_4 = 32345;
const DOCUMENT_CATEGORY_ID_1 = 147;
const DOCUMENT_CATEGORY_ID_2 = 258;
const DOCUMENT_CATEGORY_ID_3 = 369;
const DOCUMENT_PAGE_ID_1 = 23442;
const DOCUMENT_PAGE_ID_2 = 235345;
const DOCUMENT_PAGE_ID_3 = 12352;
const DOCUMENT_PAGE_ID_4 = 55221;
const UNCATEGORIZED_DOCUMENT_PAGE_ID_1 = 24324;
const UNCATEGORIZED_DOCUMENT_PAGE_ID_2 = 3532;
const UNCATEGORIZED_DOCUMENT_PAGE_ID_3 = 98954;
const DOCUMENT_SECTION_ID_1 = 3421;
const DOCUMENT_SECTION_ID_2 = 65725;
const DOCUMENT_SECTION_ID_3 = 95934;
const DOCUMENT_PAGE_DUPLICATE_ID_1 = 2341;

export type getAppBridgeThemeStubProps = {
    editorState?: boolean;
    portalId?: number;
    projectId?: number;
};

export const getAppBridgeThemeStub = ({
    editorState = false,
    portalId = PORTAL_ID,
    projectId = PROJECT_ID,
}: getAppBridgeThemeStubProps = {}): SinonStubbedInstance<AppBridgeTheme> => {
    window.emitter = spy(mitt()) as unknown as Emitter;

    return createStubInstance(AppBridgeTheme, {
        getPortalId: portalId,
        getProjectId: projectId,
        getEditorState: editorState,
        getCoverPage: Promise.resolve(CoverPageDummy.with(123)),
        getAllDocuments: Promise.resolve([
            DocumentDummy.with(DOCUMENT_ID_1),
            DocumentDummy.with(DOCUMENT_ID_2),
            DocumentDummy.with(GROUPED_DOCUMENT_ID_1),
            DocumentDummy.with(DOCUMENT_ID_3),
            DocumentDummy.with(GROUPED_DOCUMENT_ID_2),
            DocumentDummy.with(DOCUMENT_ID_4),
            DocumentDummy.with(GROUPED_DOCUMENT_ID_3),
            DocumentDummy.with(DOCUMENT_ID_5),
            DocumentDummy.with(GROUPED_DOCUMENT_ID_4),
        ]),
        getUngroupedDocuments: Promise.resolve([
            DocumentDummy.with(DOCUMENT_ID_1),
            DocumentDummy.with(DOCUMENT_ID_2),
            DocumentDummy.with(DOCUMENT_ID_3),
            DocumentDummy.with(DOCUMENT_ID_4),
            DocumentDummy.with(DOCUMENT_ID_5),
        ]),
        getDocumentGroups: Promise.resolve([
            DocumentGroupDummy.with(DOCUMENT_GROUP_ID_1, [
                DocumentDummy.with(DOCUMENT_ID_1),
                DocumentDummy.with(DOCUMENT_ID_2),
                DocumentDummy.with(DOCUMENT_ID_3),
            ]),
            DocumentGroupDummy.with(DOCUMENT_GROUP_ID_2, []),
            DocumentGroupDummy.with(DOCUMENT_GROUP_ID_3, [
                DocumentDummy.with(DOCUMENT_ID_4),
                DocumentDummy.with(DOCUMENT_ID_5),
            ]),
        ]),
        getDocumentPagesByDocumentId: Promise.resolve([
            DocumentPageDummy.with(DOCUMENT_PAGE_ID_1),
            DocumentPageDummy.with(DOCUMENT_PAGE_ID_2),
            DocumentPageDummy.with(UNCATEGORIZED_DOCUMENT_PAGE_ID_1),
            DocumentPageDummy.with(DOCUMENT_PAGE_ID_3),
            DocumentPageDummy.with(UNCATEGORIZED_DOCUMENT_PAGE_ID_2),
            DocumentPageDummy.with(DOCUMENT_PAGE_ID_4),
            DocumentPageDummy.with(UNCATEGORIZED_DOCUMENT_PAGE_ID_3),
        ]),
        getDocumentCategoriesByDocumentId: Promise.resolve([
            DocumentCategoryDummy.with(DOCUMENT_CATEGORY_ID_1, [
                DocumentPageDummy.with(DOCUMENT_PAGE_ID_1),
                DocumentPageDummy.with(DOCUMENT_PAGE_ID_2),
            ]),
            DocumentCategoryDummy.with(DOCUMENT_CATEGORY_ID_2, []),
            DocumentCategoryDummy.with(DOCUMENT_CATEGORY_ID_3, [
                DocumentPageDummy.with(DOCUMENT_PAGE_ID_3),
                DocumentPageDummy.with(DOCUMENT_PAGE_ID_4),
            ]),
        ]),
        getUncategorizedPagesByDocumentId: Promise.resolve([
            DocumentPageDummy.with(UNCATEGORIZED_DOCUMENT_PAGE_ID_1),
            DocumentPageDummy.with(UNCATEGORIZED_DOCUMENT_PAGE_ID_2),
            DocumentPageDummy.with(UNCATEGORIZED_DOCUMENT_PAGE_ID_3),
        ]),
        getDocumentSectionsByDocumentPageId: Promise.resolve([
            DocumentSectionDummy.with(DOCUMENT_SECTION_ID_1),
            DocumentSectionDummy.with(DOCUMENT_SECTION_ID_2),
            DocumentSectionDummy.with(DOCUMENT_SECTION_ID_3),
        ]),
        getColorPalettes: Promise.resolve([
            ColorPaletteDummy.with(678, 'Palette 1'),
            ColorPaletteDummy.with(427, 'Palette 2'),
            ColorPaletteDummy.with(679, 'Palette 3'),
        ]),
        getColorsByColorPaletteId: Promise.resolve([
            ColorDummy.red(9834),
            ColorDummy.green(342),
            ColorDummy.yellow(9314),
        ]),
        duplicateDocumentPage: Promise.resolve(DocumentPageDuplicateDummy.with(DOCUMENT_PAGE_DUPLICATE_ID_1)),
        getDocumentTargets: Promise.resolve(TargetsDummy.with()),
        getDocumentPageTargets: Promise.resolve(TargetsDummy.with()),
        createLink: Promise.resolve(DocumentDummy.with(1)),
        createLibrary: Promise.resolve(DocumentDummy.with(1)),
        createStandardDocument: Promise.resolve(DocumentDummy.with(1)),
        createDocumentPage: Promise.resolve(DocumentPageDummy.with(1)),
        createDocumentGroup: Promise.resolve(DocumentGroupDummy.with(1, [])),
        createDocumentCategory: Promise.resolve(DocumentCategoryDummy.with(1, [])),
        createCoverPage: Promise.resolve(CoverPageDummy.with(1)),
        updateLink: Promise.resolve(DocumentDummy.with(1)),
        updateLibrary: Promise.resolve(DocumentDummy.with(1)),
        updateStandardDocument: Promise.resolve(DocumentDummy.with(1)),
        updateDocumentPage: Promise.resolve(DocumentPageDummy.with(1)),
        updateDocumentGroup: Promise.resolve(DocumentGroupDummy.with(1, [])),
        updateDocumentCategory: Promise.resolve(DocumentCategoryDummy.with(1, [])),
        updateCoverPage: Promise.resolve(CoverPageDummy.with(1)),
        updateLegacyCoverPage: Promise.resolve(CoverPageDummy.withLegacy(1)),
        updateBrandportalLink: Promise.resolve(BrandportalLinkDummy.with()),
    });
};
