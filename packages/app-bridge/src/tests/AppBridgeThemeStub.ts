/* (c) Copyright Frontify Ltd., all rights reserved. */

import mitt from 'mitt';
import { SinonStubbedInstance, createStubInstance, spy } from 'sinon';

import { Emitter } from '../types/Emitter';
import { AppBridgeTheme } from '../AppBridgeTheme';

import {
    ColorDummy,
    ColorPaletteDummy,
    CoverPageDummy,
    DocumentCategoryDummy,
    DocumentDummy,
    DocumentGroupDummy,
    DocumentPageDummy,
    DocumentSectionDummy,
} from '.';

const PROJECT_ID = 3452;
const PORTAL_ID = 7777;

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
    window.emitter = spy(mitt()) as Emitter;

    return createStubInstance(AppBridgeTheme, {
        getPortalId: portalId,
        getProjectId: projectId,
        getEditorState: editorState,
        getCoverPage: Promise.resolve(CoverPageDummy.with(123)),
        getDocumentsWithoutDocumentGroups: Promise.resolve([
            DocumentDummy.with(411),
            DocumentDummy.with(455),
            DocumentDummy.with(499),
        ]),
        getDocumentGroups: Promise.resolve([
            DocumentGroupDummy.with(512, []),
            DocumentGroupDummy.with(532, []),
            DocumentGroupDummy.with(552, []),
        ]),
        getDocumentPagesByDocumentId: Promise.resolve([
            DocumentPageDummy.with(1111),
            DocumentPageDummy.with(2222),
            DocumentPageDummy.with(3333),
        ]),
        getDocumentCategoriesByDocumentId: Promise.resolve([
            DocumentCategoryDummy.with(147, []),
            DocumentCategoryDummy.with(258, []),
            DocumentCategoryDummy.with(369, []),
        ]),
        getUncategorizedPagesByDocumentId: Promise.resolve([
            DocumentPageDummy.with(4444),
            DocumentPageDummy.with(5555),
            DocumentPageDummy.with(6666),
        ]),
        getDocumentSectionsByDocumentPageId: Promise.resolve([
            DocumentSectionDummy.with(159),
            DocumentSectionDummy.with(148),
            DocumentSectionDummy.with(126),
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
    });
};
