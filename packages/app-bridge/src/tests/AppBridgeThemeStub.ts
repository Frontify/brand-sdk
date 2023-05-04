/* (c) Copyright Frontify Ltd., all rights reserved. */

import mitt, { Emitter } from 'mitt';
import { SinonStubbedInstance, spy, stub } from 'sinon';

import { EmitterEvents } from '../types/Emitter';
import { AppBridgeTheme } from '../AppBridgeTheme';
import { mergeDeep } from '../utilities';

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
    DocumentPageTargetsDummy,
    DocumentSectionDummy,
    DocumentTargetsDummy,
    UpdateTargetsDummy,
} from '.';
import { GuidelineSearchResultDummy } from './GuidelineSearchResultDummy';

const BRAND_ID = 234551;
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
const TARGET_ID_1 = 653543;
const TARGET_ID_2 = 23411;
const TARGET_ID_3 = 56657;

export type getAppBridgeThemeStubProps = {
    editorState?: boolean;
    brandId?: number;
    portalId?: number;
    projectId?: number;
    pageTemplateSettings?: Record<string, unknown>;
    language?: string;
};

export const getAppBridgeThemeStub = ({
    editorState = false,
    brandId = BRAND_ID,
    portalId = PORTAL_ID,
    projectId = PROJECT_ID,
    pageTemplateSettings = {},
    language = 'en',
}: getAppBridgeThemeStubProps = {}): SinonStubbedInstance<AppBridgeTheme> => {
    window.emitter = spy(mitt()) as unknown as Emitter<EmitterEvents>;

    let localPageTemplateSettings = pageTemplateSettings;

    return {
        getPortalId: stub<Parameters<AppBridgeTheme['getPortalId']>>().returns(portalId),
        getProjectId: stub<Parameters<AppBridgeTheme['getProjectId']>>().returns(projectId),
        getEditorState: stub<Parameters<AppBridgeTheme['getEditorState']>>().returns(editorState),
        getCoverPage: stub<Parameters<AppBridgeTheme['getCoverPage']>>().resolves(CoverPageDummy.with(PORTAL_ID)),
        getAllDocuments: stub<Parameters<AppBridgeTheme['getAllDocuments']>>().resolves([
            DocumentDummy.with(DOCUMENT_ID_1),
            DocumentDummy.with(DOCUMENT_ID_2),
            DocumentDummy.with(DOCUMENT_ID_3),
            DocumentDummy.with(DOCUMENT_ID_4),
            DocumentDummy.with(DOCUMENT_ID_5),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_1, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_2, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_3, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_4, DOCUMENT_GROUP_ID_1),
        ]),
        getUngroupedDocuments: stub<Parameters<AppBridgeTheme['getUngroupedDocuments']>>().resolves([
            DocumentDummy.with(DOCUMENT_ID_1),
            DocumentDummy.with(DOCUMENT_ID_2),
            DocumentDummy.with(DOCUMENT_ID_3),
            DocumentDummy.with(DOCUMENT_ID_4),
            DocumentDummy.with(DOCUMENT_ID_5),
        ]),
        getDocumentGroups: stub<Parameters<AppBridgeTheme['getDocumentGroups']>>().resolves([
            DocumentGroupDummy.with(DOCUMENT_GROUP_ID_1, [DOCUMENT_ID_1, DOCUMENT_ID_2, DOCUMENT_ID_3]),
            DocumentGroupDummy.with(DOCUMENT_GROUP_ID_2, []),
            DocumentGroupDummy.with(DOCUMENT_GROUP_ID_3, [DOCUMENT_ID_4, DOCUMENT_ID_5]),
        ]),
        getDocumentPagesByDocumentId: stub<Parameters<AppBridgeTheme['getDocumentPagesByDocumentId']>>().resolves([
            DocumentPageDummy.with(DOCUMENT_PAGE_ID_1),
            DocumentPageDummy.with(DOCUMENT_PAGE_ID_2),
            DocumentPageDummy.with(UNCATEGORIZED_DOCUMENT_PAGE_ID_1),
            DocumentPageDummy.with(DOCUMENT_PAGE_ID_3),
            DocumentPageDummy.with(UNCATEGORIZED_DOCUMENT_PAGE_ID_2),
            DocumentPageDummy.with(DOCUMENT_PAGE_ID_4),
            DocumentPageDummy.with(UNCATEGORIZED_DOCUMENT_PAGE_ID_3),
        ]),
        getDocumentCategoriesByDocumentId: stub<
            Parameters<AppBridgeTheme['getDocumentCategoriesByDocumentId']>
        >().resolves([
            DocumentCategoryDummy.with(DOCUMENT_CATEGORY_ID_1, [DOCUMENT_PAGE_ID_1, DOCUMENT_PAGE_ID_2]),
            DocumentCategoryDummy.with(DOCUMENT_CATEGORY_ID_2, []),
            DocumentCategoryDummy.with(DOCUMENT_CATEGORY_ID_3, [DOCUMENT_PAGE_ID_3, DOCUMENT_PAGE_ID_4]),
        ]),
        getUncategorizedPagesByDocumentId: stub<
            Parameters<AppBridgeTheme['getUncategorizedPagesByDocumentId']>
        >().resolves([
            DocumentPageDummy.with(UNCATEGORIZED_DOCUMENT_PAGE_ID_1),
            DocumentPageDummy.with(UNCATEGORIZED_DOCUMENT_PAGE_ID_2),
            DocumentPageDummy.with(UNCATEGORIZED_DOCUMENT_PAGE_ID_3),
        ]),
        getDocumentSectionsByDocumentPageId: stub<
            Parameters<AppBridgeTheme['getDocumentSectionsByDocumentPageId']>
        >().resolves([
            DocumentSectionDummy.with(DOCUMENT_SECTION_ID_1),
            DocumentSectionDummy.with(DOCUMENT_SECTION_ID_2),
            DocumentSectionDummy.with(DOCUMENT_SECTION_ID_3),
        ]),
        getColorPalettes: stub<Parameters<AppBridgeTheme['getColorPalettes']>>().resolves([
            ColorPaletteDummy.with(678, 'Palette 1'),
            ColorPaletteDummy.with(427, 'Palette 2'),
            ColorPaletteDummy.with(679, 'Palette 3'),
        ]),
        getColorsByColorPaletteId: stub<Parameters<AppBridgeTheme['getColorsByColorPaletteId']>>().resolves([
            ColorDummy.red(9834),
            ColorDummy.green(342),
            ColorDummy.yellow(9314),
        ]),
        duplicateDocumentPage: stub<Parameters<AppBridgeTheme['duplicateDocumentPage']>>().resolves(
            DocumentPageDuplicateDummy.with(DOCUMENT_PAGE_DUPLICATE_ID_1),
        ),
        getDocumentTargets: stub<Parameters<AppBridgeTheme['getDocumentTargets']>>().resolves(
            DocumentTargetsDummy.with(DOCUMENT_ID_1),
        ),
        getDocumentPageTargets: stub<Parameters<AppBridgeTheme['getDocumentPageTargets']>>().resolves(
            DocumentPageTargetsDummy.with(DOCUMENT_PAGE_ID_1),
        ),
        getCoverPageTemplateSettings:
            stub<Parameters<AppBridgeTheme['getCoverPageTemplateSettings']>>().resolves(localPageTemplateSettings),
        getDocumentPageTemplateSettings:
            stub<Parameters<AppBridgeTheme['getDocumentPageTemplateSettings']>>().resolves(localPageTemplateSettings),
        getLibraryPageTemplateSettings:
            stub<Parameters<AppBridgeTheme['getLibraryPageTemplateSettings']>>().resolves(localPageTemplateSettings),
        createLink: stub<Parameters<AppBridgeTheme['createLink']>>().resolves(DocumentDummy.with(1)),
        createLibrary: stub<Parameters<AppBridgeTheme['createLibrary']>>().resolves(DocumentDummy.with(1)),
        createStandardDocument: stub<Parameters<AppBridgeTheme['createStandardDocument']>>().resolves(
            DocumentDummy.with(1),
        ),
        createDocumentPage: stub<Parameters<AppBridgeTheme['createDocumentPage']>>().resolves(
            DocumentPageDummy.with(1),
        ),
        createDocumentGroup: stub<Parameters<AppBridgeTheme['createDocumentGroup']>>().resolves(
            DocumentGroupDummy.with(1, []),
        ),
        createDocumentCategory: stub<Parameters<AppBridgeTheme['createDocumentCategory']>>().resolves(
            DocumentCategoryDummy.with(1, []),
        ),
        createCoverPage: stub<Parameters<AppBridgeTheme['createCoverPage']>>().resolves(CoverPageDummy.with(1)),
        updateLink: stub<Parameters<AppBridgeTheme['updateLink']>>().resolves(DocumentDummy.with(1)),
        updateLibrary: stub<Parameters<AppBridgeTheme['updateLibrary']>>().resolves(DocumentDummy.with(1)),
        updateStandardDocument: stub<Parameters<AppBridgeTheme['updateStandardDocument']>>().resolves(
            DocumentDummy.with(1),
        ),
        updateDocumentPage: stub<Parameters<AppBridgeTheme['updateDocumentPage']>>().resolves(
            DocumentPageDummy.with(1),
        ),
        updateDocumentGroup: stub<Parameters<AppBridgeTheme['updateDocumentGroup']>>().resolves(
            DocumentGroupDummy.with(1, []),
        ),
        updateDocumentCategory: stub<Parameters<AppBridgeTheme['updateDocumentCategory']>>().resolves(
            DocumentCategoryDummy.with(1, []),
        ),
        updateCoverPage: stub<Parameters<AppBridgeTheme['updateCoverPage']>>().resolves(CoverPageDummy.with(1)),
        updateLegacyCoverPage: stub<Parameters<AppBridgeTheme['updateLegacyCoverPage']>>().resolves(
            CoverPageDummy.withLegacy(1),
        ),
        updateBrandportalLink: stub<Parameters<AppBridgeTheme['updateBrandportalLink']>>().resolves(
            BrandportalLinkDummy.with(),
        ),
        updateCoverPageTemplateSettings: stub<
            Parameters<AppBridgeTheme['updateCoverPageTemplateSettings']>
        >().callsFake(async (pageTemplateSettingsUpdate) => {
            localPageTemplateSettings = mergeDeep(localPageTemplateSettings, pageTemplateSettingsUpdate);
        }),
        updateDocumentPageTemplateSettings: stub<
            Parameters<AppBridgeTheme['updateDocumentPageTemplateSettings']>
        >().callsFake(async (pageTemplateSettingsUpdate) => {
            localPageTemplateSettings = mergeDeep(localPageTemplateSettings, pageTemplateSettingsUpdate);
        }),
        updateLibraryPageTemplateSettings: stub<
            Parameters<AppBridgeTheme['updateLibraryPageTemplateSettings']>
        >().callsFake(async (pageTemplateSettingsUpdate) => {
            localPageTemplateSettings = mergeDeep(localPageTemplateSettings, pageTemplateSettingsUpdate);
        }),
        deleteCoverPage: stub<Parameters<AppBridgeTheme['deleteCoverPage']>>().resolves(),
        deleteDocumentCategory: stub<Parameters<AppBridgeTheme['deleteDocumentCategory']>>().resolves(),
        deleteDocumentGroup: stub<Parameters<AppBridgeTheme['deleteDocumentGroup']>>().resolves(),
        deleteDocumentPage: stub<Parameters<AppBridgeTheme['deleteDocumentPage']>>().resolves(),
        deleteLibrary: stub<Parameters<AppBridgeTheme['deleteLibrary']>>().resolves(),
        deleteLink: stub<Parameters<AppBridgeTheme['deleteLink']>>().resolves(),
        deleteStandardDocument: stub<Parameters<AppBridgeTheme['deleteStandardDocument']>>().resolves(),
        getBrandId: stub<Parameters<AppBridgeTheme['getBrandId']>>().returns(brandId),
        getBrandportalLink: stub<Parameters<AppBridgeTheme['getBrandportalLink']>>().resolves(
            BrandportalLinkDummy.with(),
        ),
        getTranslationLanguage: stub<Parameters<AppBridgeTheme['getTranslationLanguage']>>().returns(language),
        moveDocument: stub<Parameters<AppBridgeTheme['moveDocument']>>().resolves(DocumentDummy.with(DOCUMENT_ID_1)),
        moveDocumentCategory: stub<Parameters<AppBridgeTheme['moveDocumentCategory']>>().resolves(
            DocumentCategoryDummy.with(DOCUMENT_CATEGORY_ID_1, []),
        ),
        moveDocumentGroup: stub<Parameters<AppBridgeTheme['moveDocumentGroup']>>().resolves(
            DocumentGroupDummy.with(DOCUMENT_CATEGORY_ID_1, []),
        ),
        moveDocumentPage: stub<Parameters<AppBridgeTheme['moveDocumentPage']>>().resolves(),
        moveDocumentPageBetweenDocuments:
            stub<Parameters<AppBridgeTheme['moveDocumentPageBetweenDocuments']>>().resolves(),
        openNavigationManager: stub<Parameters<AppBridgeTheme['openNavigationManager']>>(),
        updateDocumentPageTargets: stub<Parameters<AppBridgeTheme['updateDocumentPageTargets']>>().resolves(
            UpdateTargetsDummy.with([TARGET_ID_1, TARGET_ID_2, TARGET_ID_3]),
        ),
        updateDocumentTargets: stub<Parameters<AppBridgeTheme['updateDocumentTargets']>>().resolves(
            UpdateTargetsDummy.with([TARGET_ID_1, TARGET_ID_2, TARGET_ID_3]),
        ),
        searchInGuideline: stub<Parameters<AppBridgeTheme['searchInGuideline']>>().callsFake(async (query) => {
            return Promise.resolve([
                GuidelineSearchResultDummy.with(`${query}-1`),
                GuidelineSearchResultDummy.with(`${query}-1`),
                GuidelineSearchResultDummy.with(`${query}-3`),
            ]);
        }),
    };
};
