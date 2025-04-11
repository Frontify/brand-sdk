/* (c) Copyright Frontify Ltd., all rights reserved. */

import { act, renderHook, waitFor } from '@testing-library/react';
import mitt from 'mitt';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    BrandportalLinkDummy,
    CoverPageDummy,
    DocumentCategoryDummy,
    DocumentDummy,
    DocumentGroupDummy,
    DocumentPageDummy,
    getAppBridgeThemeStub,
} from '../tests';
import {
    type BrandportalLink,
    type CoverPage,
    type CoverPageCreate,
    type CoverPageUpdate,
    type DocumentCategoryCreate,
    type DocumentCategoryUpdate,
    type DocumentGroupCreate,
    type DocumentGroupUpdate,
    type DocumentLibraryCreate,
    type DocumentLibraryUpdate,
    type DocumentLinkCreate,
    type DocumentLinkUpdate,
    type DocumentPageCreate,
    type DocumentPageUpdate,
    type DocumentStandardCreate,
    type DocumentStandardUpdate,
} from '../types';

import { useCategorizedDocumentPages } from './useCategorizedDocumentPages';
import { useDocumentCategories } from './useDocumentCategories';
import { useDocumentGroups } from './useDocumentGroups';
import { useGroupedDocuments } from './useGroupedDocuments';
import { useGuidelineActions } from './useGuidelineActions';
import { useUncategorizedDocumentPages } from './useUncategorizedDocumentPages';
import { useUngroupedDocuments } from './useUngroupedDocuments';

const DOCUMENT_ID_1 = 6456;
const DOCUMENT_ID_2 = 34532;
const DOCUMENT_ID_3 = 2414;
const DOCUMENT_ID_4 = 2342;
const DOCUMENT_ID_5 = 2343445;
const DOCUMENT_PAGE_ID_1 = 23442;
const DOCUMENT_PAGE_ID_2 = 235345;
const DOCUMENT_PAGE_ID_3 = 12352;
const DOCUMENT_PAGE_ID_4 = 55221;
const DOCUMENT_PAGE_ID_5 = 98324;
const UNCATEGORIZED_DOCUMENT_PAGE_ID_1 = 24324;
const UNCATEGORIZED_DOCUMENT_PAGE_ID_2 = 3532;
const UNCATEGORIZED_DOCUMENT_PAGE_ID_3 = 98954;
const UNCATEGORIZED_DOCUMENT_PAGE_ID_4 = 34563;
const DOCUMENT_CATEGORY_ID_1 = 147;
const DOCUMENT_CATEGORY_ID_2 = 258;
const DOCUMENT_CATEGORY_ID_3 = 678;
const DOCUMENT_GROUP_ID_1 = 345;
const DOCUMENT_GROUP_ID_2 = 95694;
const DOCUMENT_GROUP_ID_3 = 345882;

describe('useGuidelineActions hook', () => {
    let useGuidelineActionsStub: ReturnType<typeof useGuidelineActions>;
    let emitSpy: ReturnType<typeof vi.spyOn> | null = null;
    let appBridgeStub: ReturnType<typeof getAppBridgeThemeStub>;

    beforeEach(() => {
        appBridgeStub = getAppBridgeThemeStub();
        const { result } = renderHook(() => useGuidelineActions(appBridgeStub));

        useGuidelineActionsStub = result.current;
        window.emitter = mitt();
        emitSpy = vi.spyOn(window.emitter, 'emit');
    });

    afterEach(() => {
        vi.resetAllMocks();
        emitSpy = null;
    });

    it('should not throw createDocument', async () => {
        const createDocumentMock = vi.fn(useGuidelineActionsStub.createDocument);

        expect(createDocumentMock({ title: 'testDocument' })).resolves.not.toThrow();
    });

    it('should not throw createDocumentGroup', async () => {
        const createDocumentGroupMock = vi.fn(useGuidelineActionsStub.createDocumentGroup);

        expect(createDocumentGroupMock({ name: 'testDocumentGroup' })).resolves.not.toThrow();
    });

    it('should not throw createLibrary', async () => {
        const createLibraryMock = vi.fn(useGuidelineActionsStub.createLibrary);

        expect(
            createLibraryMock({ title: 'testLibrary', settings: { project: 4 }, mode: 'DOCUMENTLIBRARY' }),
        ).resolves.not.toThrow();
    });

    it('should not throw createLink', async () => {
        const createLinkMock = vi.fn(useGuidelineActionsStub.createLink);

        expect(
            createLinkMock({ title: 'testLink', linkUrl: '/test/url', linkSettings: { newTab: true } }),
        ).resolves.not.toThrow();
    });

    it('should not throw createDocumentCategory', async () => {
        const createDocumentCategoryMock = vi.fn(useGuidelineActionsStub.createDocumentCategory);

        expect(createDocumentCategoryMock({ title: 'testCategory', documentId: 4 })).resolves.not.toThrow();
    });

    it('should not throw createDocumentPage', async () => {
        const createDocumentPageMock = vi.fn(useGuidelineActionsStub.createDocumentPage);

        expect(createDocumentPageMock({ title: 'testPage', documentId: 5 })).resolves.not.toThrow();
    });

    it('should not throw createCoverPage', async () => {
        const createCoverPageMock = vi.fn(useGuidelineActionsStub.createCoverPage);

        expect(createCoverPageMock({ documentId: '5', template: 'cover' })).resolves.not.toThrow();
    });

    it('should not throw updateDocument', async () => {
        const updateDocumentMock = vi.fn(useGuidelineActionsStub.updateDocument);

        expect(updateDocumentMock({ id: 1, title: 'updateDocumentTest' })).resolves.not.toThrow();
    });

    it('should not throw updateDocumentGroup', async () => {
        const updateDocumentGroupMock = vi.fn(useGuidelineActionsStub.updateDocumentGroup);

        expect(updateDocumentGroupMock({ id: 1, name: 'updateDocumentGroupTest' })).resolves.not.toThrow();
    });

    it('should not throw updateLibrary', async () => {
        const updateLibraryMock = vi.fn(useGuidelineActionsStub.updateLibrary);

        expect(updateLibraryMock({ id: 1, title: 'updateTitleTest' })).resolves.not.toThrow();
    });

    it('should not throw updateLink', async () => {
        const updateLinkMock = vi.fn(useGuidelineActionsStub.updateLink);

        expect(updateLinkMock({ id: 1, title: 'updateLinkTest' })).resolves.not.toThrow();
    });

    it('should not throw updateDocumentCategory', async () => {
        const updateDocumentCategoryMock = vi.fn(useGuidelineActionsStub.updateDocumentCategory);

        expect(
            updateDocumentCategoryMock({ id: 1, title: 'updateDocumentCategoryTest', documentId: 20 }),
        ).resolves.not.toThrow();
    });

    it('should not throw updateDocumentPage', async () => {
        const updateDocumentPageMock = vi.fn(useGuidelineActionsStub.updateDocumentPage);

        expect(
            updateDocumentPageMock({ id: 1, title: 'updateDocumentPageTest', documentId: 20 }),
        ).resolves.not.toThrow();
    });

    it('should not throw updateLegacyCoverPage', async () => {
        const updateLegacyCoverPageMock = vi.fn(useGuidelineActionsStub.updateLegacyCoverPage);

        expect(updateLegacyCoverPageMock({})).resolves.not.toThrow();
    });

    it('should not throw updateCoverPage', async () => {
        const updateCoverPageMock = vi.fn(useGuidelineActionsStub.updateCoverPage);

        expect(updateCoverPageMock({ id: 1 })).resolves.not.toThrow();
    });

    it('should not throw updateBrandportalLink', async () => {
        const updateBrandportalLinkMock = vi.fn(useGuidelineActionsStub.updateBrandportalLink);

        expect(updateBrandportalLinkMock({})).resolves.not.toThrow();
    });

    it('should not throw deleteDocument', async () => {
        const deleteDocumentMock = vi.fn(useGuidelineActionsStub.deleteDocument);

        expect(deleteDocumentMock({ id: 1 })).resolves.not.toThrow();
    });

    it('should not throw deleteLibrary', async () => {
        const deleteLibraryMock = vi.fn(useGuidelineActionsStub.deleteLibrary);

        expect(deleteLibraryMock({ id: 1 })).resolves.not.toThrow();
    });

    it('should not throw deleteLink', async () => {
        const deleteLinkMock = vi.fn(useGuidelineActionsStub.deleteLink);

        expect(deleteLinkMock({ id: 1 })).resolves.not.toThrow();
    });

    it('should not throw deleteDocumentPage', async () => {
        const deleteDocumentPageMock = vi.fn(useGuidelineActionsStub.deleteDocumentPage);

        expect(deleteDocumentPageMock({ id: 1, documentId: 10, categoryId: null })).resolves.not.toThrow();
    });

    it('should not throw deleteDocumentGroup', async () => {
        const deleteDocumentGroupMock = vi.fn(useGuidelineActionsStub.deleteDocumentGroup);

        expect(deleteDocumentGroupMock({ id: 1 })).resolves.not.toThrow();
    });

    it('should not throw deleteDocumentCategory', async () => {
        const deleteDocumentCategoryMock = vi.fn(useGuidelineActionsStub.deleteDocumentCategory);

        expect(deleteDocumentCategoryMock({ id: 1, documentId: 10 })).resolves.not.toThrow();
    });

    it('should not throw deleteCoverPage', async () => {
        const deleteCoverPageMock = vi.fn(useGuidelineActionsStub.deleteCoverPage);

        expect(deleteCoverPageMock()).resolves.not.toThrow();
    });

    it('should not throw duplicateDocumentPage', async () => {
        const duplicateDocumentPageMock = vi.fn(useGuidelineActionsStub.duplicateDocumentPage);

        expect(duplicateDocumentPageMock({ id: 1, documentId: 5 })).resolves.not.toThrow();
    });

    it('should not throw updateDocumentTargets', async () => {
        const updateDocumentTargetsMock = vi.fn(useGuidelineActionsStub.updateDocumentTargets);

        expect(updateDocumentTargetsMock([1, 2, 3], [203])).resolves.not.toThrow();
    });

    it('should not throw updateDocumentPageTargets', async () => {
        const updateDocumentPageTargetsMock = vi.fn(useGuidelineActionsStub.updateDocumentPageTargets);

        expect(updateDocumentPageTargetsMock([1, 2, 3], [203])).resolves.not.toThrow();
    });

    it('should create a link and emit an event', async () => {
        const createLink = vi.spyOn(useGuidelineActionsStub, 'createLink');

        const link: DocumentLinkCreate = {
            title: 'Test Link',
            documentGroupId: 1,
            linkUrl: 'test/url',
            linkSettings: { newTab: false },
        };

        act(() => {
            useGuidelineActionsStub.createLink(link);
        });

        await waitFor(() => {
            expect(createLink).toHaveBeenCalledWith(link);
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocument:Action', {
                document: { ...DocumentDummy.with(1), documentGroupId: link.documentGroupId },
                action: 'add',
            });
        });
    });

    it('should update a link and emit an event', async () => {
        const updateLink = vi.spyOn(useGuidelineActionsStub, 'updateLink');

        const link: DocumentLinkUpdate = {
            id: 1,
            title: 'Updated Link',
            documentGroupId: 1,
        };

        act(() => {
            useGuidelineActionsStub.updateLink(link);
        });

        await waitFor(() => {
            expect(updateLink).toHaveBeenCalledWith(link);
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocument:Action', {
                document: { ...DocumentDummy.with(1), documentGroupId: link.documentGroupId },
                action: 'update',
            });
        });
    });

    it('should delete a link and emit an event', async () => {
        const deleteLink = vi.spyOn(useGuidelineActionsStub, 'deleteLink');

        const documentId = 1;

        act(() => {
            useGuidelineActionsStub.deleteLink({ id: documentId });
        });

        await waitFor(() => {
            expect(deleteLink).toHaveBeenCalledWith({ id: documentId });
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocument:Action', {
                document: { id: documentId },
                action: 'delete',
            });
        });
    });

    it('should create a library and emit an event', async () => {
        const createLibrary = vi.spyOn(useGuidelineActionsStub, 'createLibrary');

        const library: DocumentLibraryCreate = {
            title: 'Test Library',
            documentGroupId: 1,
            mode: 'DOCUMENTLIBRARY',
            settings: {
                project: 1,
            },
        };

        act(() => {
            useGuidelineActionsStub.createLibrary(library);
        });

        await waitFor(() => {
            expect(createLibrary).toHaveBeenCalledWith(library);
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocument:Action', {
                document: { ...DocumentDummy.with(1), documentGroupId: library.documentGroupId },
                action: 'add',
            });
        });
    });

    it('should update a library and emit an event', async () => {
        const updateLibrary = vi.spyOn(useGuidelineActionsStub, 'updateLibrary');

        const library: DocumentLibraryUpdate = {
            id: 1,
            title: 'Updated Library',
            documentGroupId: 1,
        };

        act(() => {
            useGuidelineActionsStub.updateLibrary(library);
        });

        await waitFor(() => {
            expect(updateLibrary).toHaveBeenCalledWith(library);
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocument:Action', {
                document: { ...DocumentDummy.with(1), documentGroupId: library.documentGroupId },
                action: 'update',
            });
        });
    });

    it('should delete a library and emit an event', async () => {
        const deleteLibrary = vi.spyOn(useGuidelineActionsStub, 'deleteLibrary');

        const documentId = 1;

        act(() => {
            useGuidelineActionsStub.deleteLibrary({ id: documentId });
        });

        await waitFor(() => {
            expect(deleteLibrary).toHaveBeenCalledWith({ id: documentId });
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocument:Action', {
                document: { id: documentId },
                action: 'delete',
            });
        });
    });

    it('should create a standard document and emit an event', async () => {
        const createStandardDocument = vi.spyOn(useGuidelineActionsStub, 'createDocument');

        const documentCreationParameters: DocumentStandardCreate = {
            title: 'Test Standard Document',
            documentGroupId: 1,
        };

        act(() => {
            useGuidelineActionsStub.createDocument(documentCreationParameters);
        });

        await waitFor(() => {
            expect(createStandardDocument).toHaveBeenCalledWith(documentCreationParameters);
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocument:Action', {
                document: { ...DocumentDummy.with(1), documentGroupId: documentCreationParameters.documentGroupId },
                action: 'add',
            });
        });
    });

    it('should update a standard document and emit an event', async () => {
        const updateStandardDocument = vi.spyOn(useGuidelineActionsStub, 'updateDocument');

        const document: DocumentStandardUpdate = {
            id: 1,
            title: 'Updated Standard Document',
            documentGroupId: 1,
        };

        act(() => {
            useGuidelineActionsStub.updateDocument(document);
        });

        await waitFor(() => {
            expect(updateStandardDocument).toHaveBeenCalledWith(document);
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocument:Action', {
                document: { ...DocumentDummy.with(1), documentGroupId: document.documentGroupId },
                action: 'update',
            });
        });
    });

    it('should delete a standard document and emit an event', async () => {
        const deleteStandardDocument = vi.spyOn(useGuidelineActionsStub, 'deleteDocument');

        const documentId = 1;

        act(() => {
            useGuidelineActionsStub.deleteDocument({ id: documentId });
        });

        await waitFor(() => {
            expect(deleteStandardDocument).toHaveBeenCalledWith({ id: documentId });
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocument:Action', {
                document: { id: documentId },
                action: 'delete',
            });
        });
    });

    it('should create a cover page and emit an event', async () => {
        const createCoverPage = vi.spyOn(useGuidelineActionsStub, 'createCoverPage');

        const coverPage: CoverPageCreate = {
            template: 'blank',
            documentId: '1',
        };

        act(() => {
            useGuidelineActionsStub.createCoverPage(coverPage);
        });

        await waitFor(() => {
            expect(createCoverPage).toHaveBeenCalledWith(coverPage);
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineCoverPage:Action', {
                coverPage: CoverPageDummy.with(1),
                action: 'add',
            });
        });
    });

    it('should update a cover page and emit an event', async () => {
        const updateCoverPage = vi.spyOn(useGuidelineActionsStub, 'updateCoverPage');

        const coverPage: CoverPageUpdate = {
            id: 1,
            draft: false,
            enabled: true,
        };

        act(() => {
            useGuidelineActionsStub.updateCoverPage(coverPage);
        });

        await waitFor(() => {
            expect(updateCoverPage).toHaveBeenCalledWith(coverPage);
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineCoverPage:Action', {
                coverPage: CoverPageDummy.with(1),
                action: 'update',
            });
        });
    });

    it('should update a legacy cover page and emit an event', async () => {
        const updateLegacyCoverPage = vi.spyOn(useGuidelineActionsStub, 'updateLegacyCoverPage');

        const legacyCoverPage: Partial<CoverPage> = {
            draft: false,
            enabled: true,
            title: 'Legacy Cover Page',
        };

        act(() => {
            useGuidelineActionsStub.updateLegacyCoverPage(legacyCoverPage);
        });

        await waitFor(() => {
            expect(updateLegacyCoverPage).toHaveBeenCalledWith(legacyCoverPage);
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineCoverPage:Action', {
                coverPage: legacyCoverPage,
                action: 'update',
            });
        });
    });

    it('should delete a cover page and emit an event', async () => {
        const deleteCoverPage = vi.spyOn(useGuidelineActionsStub, 'deleteCoverPage');

        act(() => {
            useGuidelineActionsStub.deleteCoverPage();
        });

        await waitFor(() => {
            expect(deleteCoverPage).toHaveBeenCalled();
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineCoverPage:Action', {
                action: 'delete',
            });
        });
    });

    it('should update a brandportal link and emit an event', async () => {
        const updateBrandportalLink = vi.spyOn(useGuidelineActionsStub, 'updateBrandportalLink');

        const brandportalLink: BrandportalLink = {
            label: 'Updated BrandportalLink',
            url: 'https://www.example.com',
            enabled: true,
        };

        act(() => {
            useGuidelineActionsStub.updateBrandportalLink(brandportalLink);
        });

        await waitFor(() => {
            expect(updateBrandportalLink).toHaveBeenCalledWith(brandportalLink);
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineBrandportalLink:Action', {
                brandportalLink: BrandportalLinkDummy.with(),
                action: 'update',
            });
        });
    });

    it('should create a document group and emit an event', async () => {
        const createDocumentGroup = vi.spyOn(useGuidelineActionsStub, 'createDocumentGroup');

        const group: DocumentGroupCreate = {
            name: 'Test Document Group',
        };

        act(() => {
            useGuidelineActionsStub.createDocumentGroup(group);
        });

        await waitFor(() => {
            expect(createDocumentGroup).toHaveBeenCalledWith(group);
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocumentGroup:Action', {
                documentGroup: DocumentGroupDummy.with(1),
                action: 'add',
            });
        });
    });

    it('should update a document group and emit an event', async () => {
        const updateDocumentGroup = vi.spyOn(useGuidelineActionsStub, 'updateDocumentGroup');

        const documentGroupUpdate: DocumentGroupUpdate = {
            id: 1,
            name: 'Updated Document Group',
        };

        const documentGroup = DocumentGroupDummy.with(1);

        act(() => {
            useGuidelineActionsStub.updateDocumentGroup(documentGroupUpdate);
        });

        await waitFor(() => {
            expect(updateDocumentGroup).toHaveBeenCalledWith(documentGroupUpdate);
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocumentGroup:Action', {
                documentGroup,
                action: 'update',
            });
        });
    });

    it('should delete a document group and emit an event', async () => {
        const deleteDocumentGroup = vi.spyOn(useGuidelineActionsStub, 'deleteDocumentGroup');

        const id = 1;

        act(() => {
            useGuidelineActionsStub.deleteDocumentGroup({ id });
        });

        await waitFor(() => {
            expect(deleteDocumentGroup).toHaveBeenCalledWith({ id });
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocumentGroup:Action', {
                documentGroup: { id },
                action: 'delete',
            });
        });
    });

    it('should create a document category and emit an event', async () => {
        const createDocumentCategory = vi.spyOn(useGuidelineActionsStub, 'createDocumentCategory');

        const documentCategoryCreationParameters: DocumentCategoryCreate = {
            title: 'Test Document Category',
            documentId: 1,
        };

        act(() => {
            useGuidelineActionsStub.createDocumentCategory(documentCategoryCreationParameters);
        });

        await waitFor(() => {
            expect(createDocumentCategory).toHaveBeenCalledWith(documentCategoryCreationParameters);
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocumentCategory:Action', {
                documentCategory: DocumentCategoryDummy.with(1),
                action: 'add',
            });
        });
    });

    it('should update a document category and emit an event', async () => {
        const updateDocumentCategory = vi.spyOn(useGuidelineActionsStub, 'updateDocumentCategory');

        const updatedDocumentCategory: DocumentCategoryUpdate = {
            id: 1,
            title: 'Updated Document Category',
            documentId: 15,
        };

        const documentCategory = DocumentCategoryDummy.with(1);

        act(() => {
            useGuidelineActionsStub.updateDocumentCategory(updatedDocumentCategory);
        });

        await waitFor(() => {
            expect(updateDocumentCategory).toHaveBeenCalledWith(updatedDocumentCategory);
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocumentCategory:Action', {
                documentCategory,
                action: 'update',
            });
        });
    });

    it('should delete a document category and emit an event', async () => {
        const deleteDocumentCategory = vi.spyOn(useGuidelineActionsStub, 'deleteDocumentCategory');

        const documentCategory = { id: 1, documentId: 16 };

        act(() => {
            useGuidelineActionsStub.deleteDocumentCategory(documentCategory);
        });

        await waitFor(() => {
            expect(deleteDocumentCategory).toHaveBeenCalledWith(documentCategory);
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocumentCategory:Action', {
                documentCategory: { id: documentCategory.id, documentId: 16 },
                action: 'delete',
            });
        });
    });

    it('should create a page and emit an event', async () => {
        const createDocumentPage = vi.spyOn(useGuidelineActionsStub, 'createDocumentPage');

        const page: DocumentPageCreate = {
            title: 'Test Page',
            documentId: 1,
        };

        act(() => {
            useGuidelineActionsStub.createDocumentPage(page);
        });

        await waitFor(() => {
            expect(createDocumentPage).toHaveBeenCalledWith(page);
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocumentPage:Action', {
                documentPage: DocumentPageDummy.with(1),
                action: 'add',
            });
        });
    });

    it('should update a page and emit an event', async () => {
        const documentPage = DocumentPageDummy.with(1);
        const updateDocumentPage = vi.spyOn(useGuidelineActionsStub, 'updateDocumentPage');

        const page: DocumentPageUpdate = {
            id: 1,
            title: 'Updated Page',
            documentId: 25,
        };

        act(() => {
            useGuidelineActionsStub.updateDocumentPage(page);
        });

        await waitFor(() => {
            expect(updateDocumentPage).toHaveBeenCalledWith(page);
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocumentPage:Action', {
                action: 'update',
                documentPage,
            });
        });
    });

    it('should delete a page and emit an event', async () => {
        const deleteDocumentPage = vi.spyOn(useGuidelineActionsStub, 'deleteDocumentPage');

        const page = { id: 1, documentId: 22 };

        act(() => {
            useGuidelineActionsStub.deleteDocumentPage(page);
        });

        await waitFor(() => {
            expect(deleteDocumentPage).toHaveBeenCalledWith(page);
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocumentPage:Action', {
                documentPage: { id: page.id, documentId: 22, categoryId: null },
                action: 'delete',
            });
        });
    });

    it('should duplicate a page and emit an event', async () => {
        const duplicateDocumentPage = vi.spyOn(useGuidelineActionsStub, 'duplicateDocumentPage');

        const originalDocumentPage = {
            id: 2341,
            documentId: 10,
            categoryId: 1138,
        };

        act(() => {
            useGuidelineActionsStub.duplicateDocumentPage(originalDocumentPage);
        });

        await waitFor(() => {
            expect(duplicateDocumentPage).toHaveBeenCalledWith(originalDocumentPage);
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocumentPage:Action', {
                documentPage: {
                    ...DocumentPageDummy.with(originalDocumentPage.id),
                    documentId: originalDocumentPage.documentId,
                    categoryId: originalDocumentPage.categoryId,
                },
                action: 'add',
            });
        });
    });

    it('should update document targets and emit all events', async () => {
        const updateDocumentTargets = vi.spyOn(useGuidelineActionsStub, 'updateDocumentTargets');

        const targets = [1, 2, 3];
        const documentIds = [204];

        act(() => {
            useGuidelineActionsStub.updateDocumentTargets(targets, documentIds);
        });

        await waitFor(() => {
            expect(updateDocumentTargets).toHaveBeenCalledWith(targets, documentIds);
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocumentTargets:Action', {
                payload: {
                    targets,
                    documentIds,
                },
                action: 'update',
            });
        });
    });

    it('should update document page targets and emit all events', async () => {
        const updateDocumentPageTargets = vi.spyOn(useGuidelineActionsStub, 'updateDocumentPageTargets');

        const targets = [1, 2, 3];
        const documentPageIds = [204];

        act(() => {
            useGuidelineActionsStub.updateDocumentPageTargets(targets, documentPageIds);
        });

        await waitFor(() => {
            expect(updateDocumentPageTargets).toHaveBeenCalledWith(targets, documentPageIds);
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocumentPageTargets:Action', {
                payload: { targets, pageIds: documentPageIds },
                action: 'update',
            });
        });
    });

    it('should move an uncategorized document page within the same document', async () => {
        const DOCUMENT_PAGE_1 = DocumentPageDummy.withFields({
            id: UNCATEGORIZED_DOCUMENT_PAGE_ID_1,
            documentId: DOCUMENT_ID_1,
            categoryId: null,
        });

        const appBridge = getAppBridgeThemeStub();
        const emitSpy = vi.spyOn(window.emitter, 'emit');
        const moveDocumentPageSpy = vi
            .spyOn(appBridge, 'moveDocumentPage')
            .mockResolvedValueOnce({ ...DOCUMENT_PAGE_1, sort: 2 });

        const { result: guidelineActions } = renderHook(() => useGuidelineActions(appBridge));

        const { result: uncategorizedDocumentPages } = renderHook(() =>
            useUncategorizedDocumentPages(appBridge, DOCUMENT_ID_1),
        );

        await waitFor(() => {
            expect(uncategorizedDocumentPages.current.documentPages.map((documentPage) => documentPage.id)).toEqual([
                DOCUMENT_PAGE_1.id,
                UNCATEGORIZED_DOCUMENT_PAGE_ID_2,
                UNCATEGORIZED_DOCUMENT_PAGE_ID_3,
            ]);
        });

        guidelineActions.current.moveDocumentPage(DOCUMENT_PAGE_1, DOCUMENT_ID_1, 2);

        expect(moveDocumentPageSpy).toHaveBeenCalledOnce();

        await waitFor(() => {
            expect(emitSpy.mock.calls).toEqual([
                [
                    'AppBridge:GuidelineDocumentPage:MoveEvent',
                    {
                        documentPage: {
                            ...DOCUMENT_PAGE_1,
                            sort: 1,
                            categoryId: null,
                        },
                        categoryId: null,
                        documentId: DOCUMENT_ID_1,
                        position: 2,
                        action: 'movePreview',
                    },
                ],
                [
                    'AppBridge:GuidelineDocumentPage:Action',
                    { documentPage: { ...DOCUMENT_PAGE_1, sort: 2 }, action: 'move' },
                ],
                ['AppBridge:GuidelineDocument:DocumentPageAction', { documentPage: DOCUMENT_PAGE_1, action: 'delete' }],
                [
                    'AppBridge:GuidelineDocument:DocumentPageAction',
                    { documentPage: { ...DOCUMENT_PAGE_1, sort: 2 }, action: 'add' },
                ],
            ]);

            expect(uncategorizedDocumentPages.current.documentPages.map((documentPage) => documentPage.id)).toEqual([
                UNCATEGORIZED_DOCUMENT_PAGE_ID_2,
                DOCUMENT_PAGE_1.id,
                UNCATEGORIZED_DOCUMENT_PAGE_ID_3,
            ]);
        });
    });

    it('should move a categorized document page within the same document category', async () => {
        const DOCUMENT_PAGE_1 = DocumentPageDummy.withFields({
            id: DOCUMENT_PAGE_ID_1,
            documentId: DOCUMENT_ID_1,
            categoryId: DOCUMENT_CATEGORY_ID_1,
        });

        const appBridge = getAppBridgeThemeStub();
        const emitSpy = vi.spyOn(window.emitter, 'emit');
        const moveDocumentPageSpy = vi
            .spyOn(appBridge, 'moveDocumentPage')
            .mockResolvedValueOnce({ ...DOCUMENT_PAGE_1, sort: 3 });

        const { result: guidelineActions } = renderHook(() => useGuidelineActions(appBridge));

        const { result: categorizedDocumentPages } = renderHook(() =>
            useCategorizedDocumentPages(appBridge, DOCUMENT_CATEGORY_ID_1),
        );

        await waitFor(() => {
            expect(categorizedDocumentPages.current.documentPages.map((documentPage) => documentPage.id)).toEqual([
                DOCUMENT_PAGE_1.id,
                DOCUMENT_PAGE_ID_2,
                DOCUMENT_PAGE_ID_3,
                DOCUMENT_PAGE_ID_4,
            ]);
        });

        guidelineActions.current.moveDocumentPage(DOCUMENT_PAGE_1, DOCUMENT_ID_1, 3, DOCUMENT_CATEGORY_ID_1);

        expect(moveDocumentPageSpy).toHaveBeenCalledOnce();

        await waitFor(() => {
            expect(emitSpy.mock.calls).toEqual([
                [
                    'AppBridge:GuidelineDocumentPage:MoveEvent',
                    {
                        documentPage: {
                            ...DOCUMENT_PAGE_1,
                            sort: 1,
                        },
                        categoryId: DOCUMENT_CATEGORY_ID_1,
                        documentId: DOCUMENT_ID_1,
                        position: 3,
                        action: 'movePreview',
                    },
                ],
                [
                    'AppBridge:GuidelineDocumentPage:Action',
                    { documentPage: { ...DOCUMENT_PAGE_1, sort: 3 }, action: 'move' },
                ],
                [
                    'AppBridge:GuidelineDocumentCategory:DocumentPageAction',
                    { documentPage: DOCUMENT_PAGE_1, action: 'delete' },
                ],
                [
                    'AppBridge:GuidelineDocumentCategory:DocumentPageAction',
                    { documentPage: { ...DOCUMENT_PAGE_1, sort: 3 }, action: 'add' },
                ],
            ]);

            expect(categorizedDocumentPages.current.documentPages.map((documentPage) => documentPage.id)).toEqual([
                DOCUMENT_PAGE_ID_2,
                DOCUMENT_PAGE_ID_3,
                DOCUMENT_PAGE_1.id,
                DOCUMENT_PAGE_ID_4,
            ]);
        });
    });

    it('should move a categorized document page to uncategorized within the same document', async () => {
        const DOCUMENT_PAGE_1 = DocumentPageDummy.withFields({
            id: DOCUMENT_PAGE_ID_1,
            documentId: DOCUMENT_ID_1,
            categoryId: DOCUMENT_CATEGORY_ID_1,
        });

        const appBridge = getAppBridgeThemeStub();
        const fetchUncategorizedDocumentPagesSpy = vi.spyOn(appBridge, 'getUncategorizedDocumentPagesByDocumentId');
        const emitSpy = vi.spyOn(window.emitter, 'emit');

        const moveDocumentPageSpy = vi
            .spyOn(appBridge, 'moveDocumentPage')
            .mockResolvedValueOnce({ ...DOCUMENT_PAGE_1, sort: 3, categoryId: null });

        const { result: guidelineActions } = renderHook(() => useGuidelineActions(appBridge));

        const { result: categorizedDocumentPages } = renderHook(() =>
            useCategorizedDocumentPages(appBridge, DOCUMENT_CATEGORY_ID_1),
        );
        const { result: uncategorizedDocumentPages } = renderHook(() =>
            useUncategorizedDocumentPages(appBridge, DOCUMENT_ID_1),
        );

        await waitFor(() => {
            expect(categorizedDocumentPages.current.documentPages.map((documentPage) => documentPage.id)).toEqual([
                DOCUMENT_PAGE_1.id,
                DOCUMENT_PAGE_ID_2,
                DOCUMENT_PAGE_ID_3,
                DOCUMENT_PAGE_ID_4,
            ]);

            expect(uncategorizedDocumentPages.current.documentPages.map((documentPage) => documentPage.id)).toEqual([
                UNCATEGORIZED_DOCUMENT_PAGE_ID_1,
                UNCATEGORIZED_DOCUMENT_PAGE_ID_2,
                UNCATEGORIZED_DOCUMENT_PAGE_ID_3,
            ]);
        });

        // Mock the response of the add in uncategorized hook call
        fetchUncategorizedDocumentPagesSpy.mockResolvedValue([
            DocumentPageDummy.withFields({
                id: UNCATEGORIZED_DOCUMENT_PAGE_ID_1,
                documentId: DOCUMENT_ID_1,
                categoryId: null,
                sort: 1,
            }),
            DocumentPageDummy.withFields({
                id: UNCATEGORIZED_DOCUMENT_PAGE_ID_2,
                documentId: DOCUMENT_ID_1,
                categoryId: null,
                sort: 2,
            }),
            { ...DOCUMENT_PAGE_1, sort: 3, categoryId: null },
            DocumentPageDummy.withFields({
                id: UNCATEGORIZED_DOCUMENT_PAGE_ID_3,
                documentId: DOCUMENT_ID_1,
                categoryId: null,
                sort: 4,
            }),
        ]);

        guidelineActions.current.moveDocumentPage(DOCUMENT_PAGE_1, DOCUMENT_ID_1, 2, null);

        expect(moveDocumentPageSpy).toHaveBeenCalledOnce();
        expect(fetchUncategorizedDocumentPagesSpy).toHaveBeenCalledOnce();

        await waitFor(() => {
            expect(emitSpy.mock.calls).toEqual([
                [
                    'AppBridge:GuidelineDocumentPage:MoveEvent',
                    {
                        documentPage: {
                            ...DOCUMENT_PAGE_1,
                            sort: 1,
                        },
                        categoryId: null,
                        documentId: DOCUMENT_ID_1,
                        position: 2,
                        action: 'movePreview',
                    },
                ],
                [
                    'AppBridge:GuidelineDocumentPage:Action',
                    { documentPage: { ...DOCUMENT_PAGE_1, sort: 1 }, action: 'delete' },
                ],
                [
                    'AppBridge:GuidelineDocumentPage:Action',
                    { documentPage: { ...DOCUMENT_PAGE_1, sort: 3, categoryId: null }, action: 'add' },
                ],
                [
                    'AppBridge:GuidelineDocumentCategory:DocumentPageAction',
                    { documentPage: DOCUMENT_PAGE_1, action: 'delete' },
                ],
                [
                    'AppBridge:GuidelineDocument:DocumentPageAction',
                    { documentPage: { ...DOCUMENT_PAGE_1, sort: 3, categoryId: null }, action: 'add' },
                ],
            ]);

            expect(categorizedDocumentPages.current.documentPages.map((documentPage) => documentPage.id)).toEqual([
                DOCUMENT_PAGE_ID_2,
                DOCUMENT_PAGE_ID_3,
                DOCUMENT_PAGE_ID_4,
            ]);

            expect(uncategorizedDocumentPages.current.documentPages.map((documentPage) => documentPage.id)).toEqual([
                UNCATEGORIZED_DOCUMENT_PAGE_ID_1,
                UNCATEGORIZED_DOCUMENT_PAGE_ID_2,
                DOCUMENT_PAGE_1.id,
                UNCATEGORIZED_DOCUMENT_PAGE_ID_3,
            ]);
        });
    });

    it('should move an uncategorized document page to a document category within the same document', async () => {
        const UNCATEGORIZED_DOCUMENT_PAGE = DocumentPageDummy.withFields({
            id: UNCATEGORIZED_DOCUMENT_PAGE_ID_1,
            documentId: DOCUMENT_ID_1,
            categoryId: null,
        });

        const appBridge = getAppBridgeThemeStub();
        const fetchCategorizedDocumentPagesSpy = vi.spyOn(appBridge, 'getDocumentPagesByDocumentCategoryId');
        const emitSpy = vi.spyOn(window.emitter, 'emit');

        const moveDocumentPageSpy = vi
            .spyOn(appBridge, 'moveDocumentPage')
            .mockResolvedValueOnce({ ...UNCATEGORIZED_DOCUMENT_PAGE, sort: 2, categoryId: DOCUMENT_CATEGORY_ID_1 });

        const { result: guidelineActions } = renderHook(() => useGuidelineActions(appBridge));

        const { result: categorizedDocumentPages } = renderHook(() =>
            useCategorizedDocumentPages(appBridge, DOCUMENT_CATEGORY_ID_1),
        );
        const { result: uncategorizedDocumentPages } = renderHook(() =>
            useUncategorizedDocumentPages(appBridge, DOCUMENT_ID_1),
        );

        await waitFor(() => {
            expect(uncategorizedDocumentPages.current.documentPages.map((documentPage) => documentPage.id)).toEqual([
                UNCATEGORIZED_DOCUMENT_PAGE.id,
                UNCATEGORIZED_DOCUMENT_PAGE_ID_2,
                UNCATEGORIZED_DOCUMENT_PAGE_ID_3,
            ]);

            expect(categorizedDocumentPages.current.documentPages.map((documentPage) => documentPage.id)).toEqual([
                DOCUMENT_PAGE_ID_1,
                DOCUMENT_PAGE_ID_2,
                DOCUMENT_PAGE_ID_3,
                DOCUMENT_PAGE_ID_4,
            ]);
        });

        // Mock the response of the add in uncategorized hook call
        fetchCategorizedDocumentPagesSpy.mockResolvedValue([
            DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_1, categoryId: DOCUMENT_CATEGORY_ID_1, sort: 1 }),
            DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_2, categoryId: DOCUMENT_CATEGORY_ID_1, sort: 2 }),
            { ...UNCATEGORIZED_DOCUMENT_PAGE, sort: 3, categoryId: DOCUMENT_CATEGORY_ID_1 },
            DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_3, categoryId: DOCUMENT_CATEGORY_ID_1, sort: 4 }),
            DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_4, categoryId: DOCUMENT_CATEGORY_ID_1, sort: 5 }),
        ]);

        guidelineActions.current.moveDocumentPage(
            UNCATEGORIZED_DOCUMENT_PAGE,
            DOCUMENT_ID_1,
            2,
            DOCUMENT_CATEGORY_ID_1,
        );

        expect(moveDocumentPageSpy).toHaveBeenCalledOnce();
        expect(fetchCategorizedDocumentPagesSpy).toHaveBeenCalledOnce();

        await waitFor(() => {
            expect(emitSpy.mock.calls).toEqual([
                [
                    'AppBridge:GuidelineDocumentPage:MoveEvent',
                    {
                        documentPage: {
                            ...UNCATEGORIZED_DOCUMENT_PAGE,
                            sort: 1,
                            documentId: DOCUMENT_ID_1,
                            categoryId: null,
                        },
                        categoryId: DOCUMENT_CATEGORY_ID_1,
                        documentId: DOCUMENT_ID_1,
                        position: 2,
                        action: 'movePreview',
                    },
                ],
                [
                    'AppBridge:GuidelineDocumentPage:Action',
                    { documentPage: { ...UNCATEGORIZED_DOCUMENT_PAGE, sort: 1, categoryId: null }, action: 'delete' },
                ],
                [
                    'AppBridge:GuidelineDocumentPage:Action',
                    {
                        documentPage: { ...UNCATEGORIZED_DOCUMENT_PAGE, sort: 2, categoryId: DOCUMENT_CATEGORY_ID_1 },
                        action: 'add',
                    },
                ],
                [
                    'AppBridge:GuidelineDocument:DocumentPageAction',
                    { documentPage: UNCATEGORIZED_DOCUMENT_PAGE, action: 'delete' },
                ],
                [
                    'AppBridge:GuidelineDocumentCategory:DocumentPageAction',
                    {
                        documentPage: { ...UNCATEGORIZED_DOCUMENT_PAGE, sort: 2, categoryId: DOCUMENT_CATEGORY_ID_1 },
                        action: 'add',
                    },
                ],
            ]);

            expect(uncategorizedDocumentPages.current.documentPages.map((documentPage) => documentPage.id)).toEqual([
                UNCATEGORIZED_DOCUMENT_PAGE_ID_2,
                UNCATEGORIZED_DOCUMENT_PAGE_ID_3,
            ]);

            expect(categorizedDocumentPages.current.documentPages.map((documentPage) => documentPage.id)).toEqual([
                DOCUMENT_PAGE_ID_1,
                DOCUMENT_PAGE_ID_2,
                UNCATEGORIZED_DOCUMENT_PAGE.id,
                DOCUMENT_PAGE_ID_3,
                DOCUMENT_PAGE_ID_4,
            ]);
        });
    });

    it('should move an uncategorized document page to another document as uncategorized', async () => {
        const UNCATEGORIZED_DOCUMENT_PAGE = DocumentPageDummy.withFields({
            id: UNCATEGORIZED_DOCUMENT_PAGE_ID_4,
            documentId: DOCUMENT_ID_1,
            categoryId: null,
            sort: 1,
        });

        const appBridge = getAppBridgeThemeStub();
        const fetchUncategorizedDocumentPagesSpy = vi.spyOn(appBridge, 'getUncategorizedDocumentPagesByDocumentId');
        const emitSpy = vi.spyOn(window.emitter, 'emit');

        const moveDocumentPageSpy = vi.spyOn(appBridge, 'moveDocumentPage').mockResolvedValueOnce({
            ...UNCATEGORIZED_DOCUMENT_PAGE,
            documentId: DOCUMENT_ID_2,
            categoryId: null,
            sort: 2,
        });

        const { result: guidelineActions } = renderHook(() => useGuidelineActions(appBridge));

        // Mock the response to add an extra category to the document
        fetchUncategorizedDocumentPagesSpy.mockResolvedValueOnce([
            UNCATEGORIZED_DOCUMENT_PAGE,
            DocumentPageDummy.withFields({
                id: UNCATEGORIZED_DOCUMENT_PAGE_ID_1,
                documentId: DOCUMENT_ID_2,
                categoryId: null,
                sort: 2,
            }),
            DocumentPageDummy.withFields({
                id: UNCATEGORIZED_DOCUMENT_PAGE_ID_2,
                documentId: DOCUMENT_ID_2,
                categoryId: null,
                sort: 3,
            }),
            DocumentPageDummy.withFields({
                id: UNCATEGORIZED_DOCUMENT_PAGE_ID_3,
                documentId: DOCUMENT_ID_2,
                categoryId: null,
                sort: 4,
            }),
        ]);

        const { result: uncategorizedDocumentPagesInDocumentId1 } = renderHook(() =>
            useUncategorizedDocumentPages(appBridge, DOCUMENT_ID_1),
        );

        await waitFor(() => {
            expect(
                uncategorizedDocumentPagesInDocumentId1.current.documentPages.map((documentPage) => documentPage.id),
            ).toEqual([
                UNCATEGORIZED_DOCUMENT_PAGE.id,
                UNCATEGORIZED_DOCUMENT_PAGE_ID_1,
                UNCATEGORIZED_DOCUMENT_PAGE_ID_2,
                UNCATEGORIZED_DOCUMENT_PAGE_ID_3,
            ]);
        });

        const { result: uncategorizedDocumentPagesInDocumentId2 } = renderHook(() =>
            useUncategorizedDocumentPages(appBridge, DOCUMENT_ID_2),
        );

        await waitFor(() => {
            expect(
                uncategorizedDocumentPagesInDocumentId2.current.documentPages.map((documentPage) => documentPage.id),
            ).toEqual([
                UNCATEGORIZED_DOCUMENT_PAGE_ID_1,
                UNCATEGORIZED_DOCUMENT_PAGE_ID_2,
                UNCATEGORIZED_DOCUMENT_PAGE_ID_3,
            ]);
        });

        // Mock the response of the add in uncategorized hook call
        fetchUncategorizedDocumentPagesSpy.mockResolvedValueOnce([
            DocumentPageDummy.withFields({
                id: UNCATEGORIZED_DOCUMENT_PAGE_ID_1,
                documentId: DOCUMENT_ID_2,
                categoryId: null,
                sort: 1,
            }),
            DocumentPageDummy.withFields({
                id: UNCATEGORIZED_DOCUMENT_PAGE_ID_2,
                documentId: DOCUMENT_ID_2,
                categoryId: null,
                sort: 2,
            }),
            { ...UNCATEGORIZED_DOCUMENT_PAGE, documentId: DOCUMENT_ID_2, categoryId: null, sort: 3 },
            DocumentPageDummy.withFields({
                id: UNCATEGORIZED_DOCUMENT_PAGE_ID_3,
                documentId: DOCUMENT_ID_2,
                categoryId: null,
                sort: 4,
            }),
        ]);

        guidelineActions.current.moveDocumentPage(UNCATEGORIZED_DOCUMENT_PAGE, DOCUMENT_ID_2, 2, null);

        expect(moveDocumentPageSpy).toHaveBeenCalledOnce();
        expect(fetchUncategorizedDocumentPagesSpy).toHaveBeenCalledTimes(2);

        await waitFor(() => {
            expect(emitSpy.mock.calls).toEqual([
                [
                    'AppBridge:GuidelineDocumentPage:MoveEvent',
                    {
                        documentPage: {
                            ...UNCATEGORIZED_DOCUMENT_PAGE,
                            sort: 1,
                            documentId: DOCUMENT_ID_1,
                            categoryId: null,
                        },
                        categoryId: null,
                        documentId: DOCUMENT_ID_2,
                        position: 2,
                        action: 'movePreview',
                    },
                ],
                [
                    'AppBridge:GuidelineDocumentPage:Action',
                    {
                        documentPage: {
                            ...UNCATEGORIZED_DOCUMENT_PAGE,
                            sort: 1,
                            documentId: DOCUMENT_ID_1,
                            categoryId: null,
                        },
                        action: 'delete',
                    },
                ],
                [
                    'AppBridge:GuidelineDocumentPage:Action',
                    {
                        documentPage: {
                            ...UNCATEGORIZED_DOCUMENT_PAGE,
                            sort: 2,
                            documentId: DOCUMENT_ID_2,
                            categoryId: null,
                        },
                        action: 'add',
                    },
                ],
                [
                    'AppBridge:GuidelineDocument:DocumentPageAction',
                    { documentPage: { ...UNCATEGORIZED_DOCUMENT_PAGE, documentId: DOCUMENT_ID_1 }, action: 'delete' },
                ],
                [
                    'AppBridge:GuidelineDocument:DocumentPageAction',
                    {
                        documentPage: {
                            ...UNCATEGORIZED_DOCUMENT_PAGE,
                            sort: 2,
                            documentId: DOCUMENT_ID_2,
                            categoryId: null,
                        },
                        action: 'add',
                    },
                ],
            ]);

            expect(
                uncategorizedDocumentPagesInDocumentId1.current.documentPages.map((documentPage) => documentPage.id),
            ).toEqual([
                UNCATEGORIZED_DOCUMENT_PAGE_ID_1,
                UNCATEGORIZED_DOCUMENT_PAGE_ID_2,
                UNCATEGORIZED_DOCUMENT_PAGE_ID_3,
            ]);

            expect(
                uncategorizedDocumentPagesInDocumentId2.current.documentPages.map((documentPage) => documentPage.id),
            ).toEqual([
                UNCATEGORIZED_DOCUMENT_PAGE_ID_1,
                UNCATEGORIZED_DOCUMENT_PAGE_ID_2,
                UNCATEGORIZED_DOCUMENT_PAGE.id,
                UNCATEGORIZED_DOCUMENT_PAGE_ID_3,
            ]);
        });
    });

    it('should move a categorized document page to another document as uncategorized', async () => {
        const DOCUMENT_PAGE = DocumentPageDummy.withFields({
            id: DOCUMENT_PAGE_ID_5,
            documentId: DOCUMENT_ID_1,
            categoryId: DOCUMENT_CATEGORY_ID_1,
            sort: 5,
        });

        const appBridge = getAppBridgeThemeStub();
        const fetchCategorizedDocumentPagesSpy = vi.spyOn(appBridge, 'getDocumentPagesByDocumentCategoryId');
        const fetchUncategorizedDocumentPagesSpy = vi.spyOn(appBridge, 'getUncategorizedDocumentPagesByDocumentId');
        const emitSpy = vi.spyOn(window.emitter, 'emit');

        const moveDocumentPageSpy = vi.spyOn(appBridge, 'moveDocumentPage').mockResolvedValueOnce({
            ...DOCUMENT_PAGE,
            documentId: DOCUMENT_ID_2,
            categoryId: null,
            sort: 2,
        });

        const { result: guidelineActions } = renderHook(() => useGuidelineActions(appBridge));

        // Mock the response to add an extra category to the document category
        fetchCategorizedDocumentPagesSpy.mockResolvedValueOnce([
            DocumentPageDummy.withFields({
                id: DOCUMENT_PAGE_ID_1,
                documentId: DOCUMENT_ID_1,
                categoryId: null,
                sort: 1,
            }),
            DocumentPageDummy.withFields({
                id: DOCUMENT_PAGE_ID_2,
                documentId: DOCUMENT_ID_1,
                categoryId: null,
                sort: 2,
            }),
            DocumentPageDummy.withFields({
                id: DOCUMENT_PAGE_ID_3,
                documentId: DOCUMENT_ID_1,
                categoryId: null,
                sort: 3,
            }),
            DocumentPageDummy.withFields({
                id: DOCUMENT_PAGE_ID_4,
                documentId: DOCUMENT_ID_1,
                categoryId: null,
                sort: 4,
            }),
            DOCUMENT_PAGE,
        ]);

        const { result: categorizedDocumentPagesInDocumentCategoryId1 } = renderHook(() =>
            useCategorizedDocumentPages(appBridge, DOCUMENT_CATEGORY_ID_1),
        );

        await waitFor(() => {
            expect(
                categorizedDocumentPagesInDocumentCategoryId1.current.documentPages.map(
                    (documentPage) => documentPage.id,
                ),
            ).toEqual([
                DOCUMENT_PAGE_ID_1,
                DOCUMENT_PAGE_ID_2,
                DOCUMENT_PAGE_ID_3,
                DOCUMENT_PAGE_ID_4,
                DOCUMENT_PAGE.id,
            ]);
        });

        const { result: uncategorizedDocumentPagesInDocumentId2 } = renderHook(() =>
            useUncategorizedDocumentPages(appBridge, DOCUMENT_ID_2),
        );

        await waitFor(() => {
            expect(
                uncategorizedDocumentPagesInDocumentId2.current.documentPages.map((documentPage) => documentPage.id),
            ).toEqual([
                UNCATEGORIZED_DOCUMENT_PAGE_ID_1,
                UNCATEGORIZED_DOCUMENT_PAGE_ID_2,
                UNCATEGORIZED_DOCUMENT_PAGE_ID_3,
            ]);
        });

        // Mock the response of the add in uncategorized hook call
        fetchUncategorizedDocumentPagesSpy.mockResolvedValueOnce([
            DocumentPageDummy.withFields({
                id: UNCATEGORIZED_DOCUMENT_PAGE_ID_1,
                documentId: DOCUMENT_ID_2,
                categoryId: null,
                sort: 1,
            }),
            DocumentPageDummy.withFields({
                id: UNCATEGORIZED_DOCUMENT_PAGE_ID_2,
                documentId: DOCUMENT_ID_2,
                categoryId: null,
                sort: 2,
            }),
            { ...DOCUMENT_PAGE, documentId: DOCUMENT_ID_2, categoryId: null, sort: 3 },
            DocumentPageDummy.withFields({
                id: UNCATEGORIZED_DOCUMENT_PAGE_ID_3,
                documentId: DOCUMENT_ID_2,
                categoryId: null,
                sort: 4,
            }),
        ]);

        guidelineActions.current.moveDocumentPage(DOCUMENT_PAGE, DOCUMENT_ID_2, 2, null);

        expect(moveDocumentPageSpy).toHaveBeenCalledOnce();
        expect(fetchUncategorizedDocumentPagesSpy).toHaveBeenCalledOnce();

        await waitFor(() => {
            expect(emitSpy.mock.calls).toEqual([
                [
                    'AppBridge:GuidelineDocumentPage:MoveEvent',
                    {
                        documentPage: {
                            ...DOCUMENT_PAGE,
                            sort: 5,
                            documentId: DOCUMENT_ID_1,
                        },
                        categoryId: null,
                        documentId: DOCUMENT_ID_2,
                        position: 2,
                        action: 'movePreview',
                    },
                ],
                [
                    'AppBridge:GuidelineDocumentPage:Action',
                    {
                        documentPage: {
                            ...DOCUMENT_PAGE,
                            sort: 5,
                            documentId: DOCUMENT_ID_1,
                            categoryId: DOCUMENT_CATEGORY_ID_1,
                        },
                        action: 'delete',
                    },
                ],
                [
                    'AppBridge:GuidelineDocumentPage:Action',
                    {
                        documentPage: {
                            ...DOCUMENT_PAGE,
                            sort: 2,
                            documentId: DOCUMENT_ID_2,
                            categoryId: null,
                        },
                        action: 'add',
                    },
                ],
                [
                    'AppBridge:GuidelineDocumentCategory:DocumentPageAction',
                    {
                        documentPage: {
                            ...DOCUMENT_PAGE,
                            documentId: DOCUMENT_ID_1,
                            categoryId: DOCUMENT_CATEGORY_ID_1,
                        },
                        action: 'delete',
                    },
                ],
                [
                    'AppBridge:GuidelineDocument:DocumentPageAction',
                    {
                        documentPage: {
                            ...DOCUMENT_PAGE,
                            sort: 2,
                            documentId: DOCUMENT_ID_2,
                            categoryId: null,
                        },
                        action: 'add',
                    },
                ],
            ]);

            expect(
                categorizedDocumentPagesInDocumentCategoryId1.current.documentPages.map(
                    (documentPage) => documentPage.id,
                ),
            ).toEqual([DOCUMENT_PAGE_ID_1, DOCUMENT_PAGE_ID_2, DOCUMENT_PAGE_ID_3, DOCUMENT_PAGE_ID_4]);

            expect(
                uncategorizedDocumentPagesInDocumentId2.current.documentPages.map((documentPage) => documentPage.id),
            ).toEqual([
                UNCATEGORIZED_DOCUMENT_PAGE_ID_1,
                UNCATEGORIZED_DOCUMENT_PAGE_ID_2,
                DOCUMENT_PAGE.id,
                UNCATEGORIZED_DOCUMENT_PAGE_ID_3,
            ]);
        });
    });

    it('should move an uncategorized document page to another document as categorized', async () => {
        const UNCATEGORIZED_DOCUMENT_PAGE = DocumentPageDummy.withFields({
            id: DOCUMENT_PAGE_ID_5,
            documentId: DOCUMENT_ID_1,
            categoryId: null,
            sort: 1,
        });

        const appBridge = getAppBridgeThemeStub();
        const fetchUncategorizedDocumentPagesSpy = vi.spyOn(appBridge, 'getUncategorizedDocumentPagesByDocumentId');
        const fetchCategorizedDocumentPagesSpy = vi.spyOn(appBridge, 'getDocumentPagesByDocumentCategoryId');
        const emitSpy = vi.spyOn(window.emitter, 'emit');

        const moveDocumentPageSpy = vi.spyOn(appBridge, 'moveDocumentPage').mockResolvedValueOnce({
            ...UNCATEGORIZED_DOCUMENT_PAGE,
            documentId: DOCUMENT_ID_2,
            categoryId: DOCUMENT_CATEGORY_ID_1,
            sort: 2,
        });

        const { result: guidelineActions } = renderHook(() => useGuidelineActions(appBridge));

        // Mock the response to add an extra category to the document
        fetchUncategorizedDocumentPagesSpy.mockResolvedValueOnce([
            UNCATEGORIZED_DOCUMENT_PAGE,
            DocumentPageDummy.withFields({
                id: UNCATEGORIZED_DOCUMENT_PAGE_ID_1,
                documentId: DOCUMENT_ID_1,
                categoryId: null,
                sort: 2,
            }),
            DocumentPageDummy.withFields({
                id: UNCATEGORIZED_DOCUMENT_PAGE_ID_2,
                documentId: DOCUMENT_ID_1,
                categoryId: null,
                sort: 3,
            }),
            DocumentPageDummy.withFields({
                id: UNCATEGORIZED_DOCUMENT_PAGE_ID_3,
                documentId: DOCUMENT_ID_1,
                categoryId: null,
                sort: 4,
            }),
        ]);

        const { result: uncategorizedDocumentPagesInDocumentId1 } = renderHook(() =>
            useUncategorizedDocumentPages(appBridge, DOCUMENT_ID_1),
        );

        await waitFor(() => {
            expect(
                uncategorizedDocumentPagesInDocumentId1.current.documentPages.map((documentPage) => documentPage.id),
            ).toEqual([
                UNCATEGORIZED_DOCUMENT_PAGE.id,
                UNCATEGORIZED_DOCUMENT_PAGE_ID_1,
                UNCATEGORIZED_DOCUMENT_PAGE_ID_2,
                UNCATEGORIZED_DOCUMENT_PAGE_ID_3,
            ]);
        });

        const { result: categorizedDocumentPagesInDocumentId2 } = renderHook(() =>
            useCategorizedDocumentPages(appBridge, DOCUMENT_CATEGORY_ID_1),
        );

        await waitFor(() => {
            expect(
                categorizedDocumentPagesInDocumentId2.current.documentPages.map((documentPage) => documentPage.id),
            ).toEqual([DOCUMENT_PAGE_ID_1, DOCUMENT_PAGE_ID_2, DOCUMENT_PAGE_ID_3, DOCUMENT_PAGE_ID_4]);
        });

        // Mock the response of the add in uncategorized hook call
        fetchCategorizedDocumentPagesSpy.mockResolvedValueOnce([
            DocumentPageDummy.withFields({
                id: DOCUMENT_PAGE_ID_1,
                documentId: DOCUMENT_ID_2,
                categoryId: null,
                sort: 1,
            }),
            DocumentPageDummy.withFields({
                id: DOCUMENT_PAGE_ID_2,
                documentId: DOCUMENT_ID_2,
                categoryId: null,
                sort: 2,
            }),
            { ...UNCATEGORIZED_DOCUMENT_PAGE, documentId: DOCUMENT_ID_2, categoryId: null, sort: 3 },
            DocumentPageDummy.withFields({
                id: DOCUMENT_PAGE_ID_3,
                documentId: DOCUMENT_ID_2,
                categoryId: null,
                sort: 4,
            }),
            DocumentPageDummy.withFields({
                id: DOCUMENT_PAGE_ID_4,
                documentId: DOCUMENT_ID_2,
                categoryId: null,
                sort: 5,
            }),
        ]);

        guidelineActions.current.moveDocumentPage(
            UNCATEGORIZED_DOCUMENT_PAGE,
            DOCUMENT_ID_2,
            2,
            DOCUMENT_CATEGORY_ID_1,
        );

        expect(moveDocumentPageSpy).toHaveBeenCalledOnce();
        expect(fetchUncategorizedDocumentPagesSpy).toHaveBeenCalledOnce();

        await waitFor(() => {
            expect(emitSpy.mock.calls).toEqual([
                [
                    'AppBridge:GuidelineDocumentPage:MoveEvent',
                    {
                        documentPage: {
                            ...UNCATEGORIZED_DOCUMENT_PAGE,
                            sort: 1,
                            documentId: DOCUMENT_ID_1,
                        },
                        categoryId: DOCUMENT_CATEGORY_ID_1,
                        documentId: DOCUMENT_ID_2,
                        position: 2,
                        action: 'movePreview',
                    },
                ],
                [
                    'AppBridge:GuidelineDocumentPage:Action',
                    {
                        documentPage: {
                            ...UNCATEGORIZED_DOCUMENT_PAGE,
                            sort: 1,
                            documentId: DOCUMENT_ID_1,
                            categoryId: null,
                        },
                        action: 'delete',
                    },
                ],
                [
                    'AppBridge:GuidelineDocumentPage:Action',
                    {
                        documentPage: {
                            ...UNCATEGORIZED_DOCUMENT_PAGE,
                            sort: 2,
                            documentId: DOCUMENT_ID_2,
                            categoryId: DOCUMENT_CATEGORY_ID_1,
                        },
                        action: 'add',
                    },
                ],
                [
                    'AppBridge:GuidelineDocument:DocumentPageAction',
                    { documentPage: { ...UNCATEGORIZED_DOCUMENT_PAGE, documentId: DOCUMENT_ID_1 }, action: 'delete' },
                ],
                [
                    'AppBridge:GuidelineDocumentCategory:DocumentPageAction',
                    {
                        documentPage: {
                            ...UNCATEGORIZED_DOCUMENT_PAGE,
                            sort: 2,
                            documentId: DOCUMENT_ID_2,
                            categoryId: DOCUMENT_CATEGORY_ID_1,
                        },
                        action: 'add',
                    },
                ],
            ]);

            expect(
                uncategorizedDocumentPagesInDocumentId1.current.documentPages.map((documentPage) => documentPage.id),
            ).toEqual([
                UNCATEGORIZED_DOCUMENT_PAGE_ID_1,
                UNCATEGORIZED_DOCUMENT_PAGE_ID_2,
                UNCATEGORIZED_DOCUMENT_PAGE_ID_3,
            ]);

            expect(
                categorizedDocumentPagesInDocumentId2.current.documentPages.map((documentPage) => documentPage.id),
            ).toEqual([
                DOCUMENT_PAGE_ID_1,
                DOCUMENT_PAGE_ID_2,
                UNCATEGORIZED_DOCUMENT_PAGE.id,
                DOCUMENT_PAGE_ID_3,
                DOCUMENT_PAGE_ID_4,
            ]);
        });
    });

    it('should move a categorized document page to another document as categorized', async () => {
        const DOCUMENT_PAGE = DocumentPageDummy.withFields({
            id: DOCUMENT_PAGE_ID_5,
            documentId: DOCUMENT_ID_1,
            categoryId: DOCUMENT_CATEGORY_ID_1,
            sort: 5,
        });

        const appBridge = getAppBridgeThemeStub();
        const fetchCategorizedDocumentPagesSpy = vi.spyOn(appBridge, 'getDocumentPagesByDocumentCategoryId');
        const emitSpy = vi.spyOn(window.emitter, 'emit');

        const moveDocumentPageSpy = vi.spyOn(appBridge, 'moveDocumentPage').mockResolvedValueOnce({
            ...DOCUMENT_PAGE,
            documentId: DOCUMENT_ID_2,
            categoryId: DOCUMENT_CATEGORY_ID_2,
            sort: 2,
        });

        const { result: guidelineActions } = renderHook(() => useGuidelineActions(appBridge));

        // Mock the response to add an extra category to the document category
        fetchCategorizedDocumentPagesSpy.mockResolvedValueOnce([
            DocumentPageDummy.withFields({
                id: DOCUMENT_PAGE_ID_1,
                documentId: DOCUMENT_ID_1,
                categoryId: DOCUMENT_CATEGORY_ID_1,
                sort: 1,
            }),
            DocumentPageDummy.withFields({
                id: DOCUMENT_PAGE_ID_2,
                documentId: DOCUMENT_ID_1,
                categoryId: DOCUMENT_CATEGORY_ID_1,
                sort: 2,
            }),
            DocumentPageDummy.withFields({
                id: DOCUMENT_PAGE_ID_3,
                documentId: DOCUMENT_ID_1,
                categoryId: DOCUMENT_CATEGORY_ID_1,
                sort: 3,
            }),
            DocumentPageDummy.withFields({
                id: DOCUMENT_PAGE_ID_4,
                documentId: DOCUMENT_ID_1,
                categoryId: DOCUMENT_CATEGORY_ID_1,
                sort: 4,
            }),
            DOCUMENT_PAGE,
        ]);

        const { result: categorizedDocumentPagesInDocumentCategoryId1 } = renderHook(() =>
            useCategorizedDocumentPages(appBridge, DOCUMENT_CATEGORY_ID_1),
        );

        await waitFor(() => {
            expect(
                categorizedDocumentPagesInDocumentCategoryId1.current.documentPages.map(
                    (documentPage) => documentPage.id,
                ),
            ).toEqual([
                DOCUMENT_PAGE_ID_1,
                DOCUMENT_PAGE_ID_2,
                DOCUMENT_PAGE_ID_3,
                DOCUMENT_PAGE_ID_4,
                DOCUMENT_PAGE.id,
            ]);
        });

        const { result: categorizedDocumentPagesInDocumentCategoryId2 } = renderHook(() =>
            useCategorizedDocumentPages(appBridge, DOCUMENT_CATEGORY_ID_2),
        );

        await waitFor(() => {
            expect(
                categorizedDocumentPagesInDocumentCategoryId2.current.documentPages.map(
                    (documentPage) => documentPage.id,
                ),
            ).toEqual([DOCUMENT_PAGE_ID_1, DOCUMENT_PAGE_ID_2, DOCUMENT_PAGE_ID_3, DOCUMENT_PAGE_ID_4]);
        });

        // Mock the response of the add in uncategorized hook call
        fetchCategorizedDocumentPagesSpy.mockResolvedValueOnce([
            DocumentPageDummy.withFields({
                id: DOCUMENT_PAGE_ID_1,
                documentId: DOCUMENT_ID_2,
                categoryId: DOCUMENT_CATEGORY_ID_2,
                sort: 1,
            }),
            DocumentPageDummy.withFields({
                id: DOCUMENT_PAGE_ID_2,
                documentId: DOCUMENT_ID_2,
                categoryId: DOCUMENT_CATEGORY_ID_2,
                sort: 2,
            }),
            { ...DOCUMENT_PAGE, documentId: DOCUMENT_ID_2, categoryId: DOCUMENT_CATEGORY_ID_2, sort: 3 },
            DocumentPageDummy.withFields({
                id: DOCUMENT_PAGE_ID_3,
                documentId: DOCUMENT_ID_2,
                categoryId: DOCUMENT_CATEGORY_ID_2,
                sort: 4,
            }),
            DocumentPageDummy.withFields({
                id: DOCUMENT_PAGE_ID_4,
                documentId: DOCUMENT_ID_2,
                categoryId: DOCUMENT_CATEGORY_ID_2,
                sort: 4,
            }),
        ]);

        guidelineActions.current.moveDocumentPage(DOCUMENT_PAGE, DOCUMENT_ID_2, 2, null);

        expect(moveDocumentPageSpy).toHaveBeenCalledOnce();
        expect(fetchCategorizedDocumentPagesSpy).toHaveBeenCalledTimes(2);

        await waitFor(() => {
            expect(emitSpy.mock.calls).toEqual([
                [
                    'AppBridge:GuidelineDocumentPage:MoveEvent',
                    {
                        documentPage: {
                            ...DOCUMENT_PAGE,
                            sort: 5,
                            documentId: DOCUMENT_ID_1,
                            categoryId: DOCUMENT_CATEGORY_ID_1,
                        },
                        categoryId: null,
                        documentId: DOCUMENT_ID_2,
                        position: 2,
                        action: 'movePreview',
                    },
                ],
                [
                    'AppBridge:GuidelineDocumentPage:Action',
                    {
                        documentPage: {
                            ...DOCUMENT_PAGE,
                            sort: 5,
                            documentId: DOCUMENT_ID_1,
                            categoryId: DOCUMENT_CATEGORY_ID_1,
                        },
                        action: 'delete',
                    },
                ],
                [
                    'AppBridge:GuidelineDocumentPage:Action',
                    {
                        documentPage: {
                            ...DOCUMENT_PAGE,
                            sort: 2,
                            documentId: DOCUMENT_ID_2,
                            categoryId: DOCUMENT_CATEGORY_ID_2,
                        },
                        action: 'add',
                    },
                ],
                [
                    'AppBridge:GuidelineDocumentCategory:DocumentPageAction',
                    {
                        documentPage: {
                            ...DOCUMENT_PAGE,
                            documentId: DOCUMENT_ID_1,
                            categoryId: DOCUMENT_CATEGORY_ID_1,
                        },
                        action: 'delete',
                    },
                ],
                [
                    'AppBridge:GuidelineDocumentCategory:DocumentPageAction',
                    {
                        documentPage: {
                            ...DOCUMENT_PAGE,
                            sort: 2,
                            documentId: DOCUMENT_ID_2,
                            categoryId: DOCUMENT_CATEGORY_ID_2,
                        },
                        action: 'add',
                    },
                ],
            ]);

            expect(
                categorizedDocumentPagesInDocumentCategoryId1.current.documentPages.map(
                    (documentPage) => documentPage.id,
                ),
            ).toEqual([DOCUMENT_PAGE_ID_1, DOCUMENT_PAGE_ID_2, DOCUMENT_PAGE_ID_3, DOCUMENT_PAGE_ID_4]);

            expect(
                categorizedDocumentPagesInDocumentCategoryId2.current.documentPages.map(
                    (documentPage) => documentPage.id,
                ),
            ).toEqual([
                DOCUMENT_PAGE_ID_1,
                DOCUMENT_PAGE_ID_2,
                DOCUMENT_PAGE.id,
                DOCUMENT_PAGE_ID_3,
                DOCUMENT_PAGE_ID_4,
            ]);
        });
    });

    it('should move an ungrouped document and emit 2 events', async () => {
        const DOCUMENT = DocumentDummy.withFields({ ...DocumentDummy.with(DOCUMENT_ID_5), sort: 5 });

        const appBridge = getAppBridgeThemeStub();
        const fetchDocumentsSpy = vi.spyOn(appBridge, 'getUngroupedDocuments');
        const emitSpy = vi.spyOn(window.emitter, 'emit');

        const moveDocumentSpy = vi.spyOn(appBridge, 'moveDocument').mockResolvedValueOnce({
            ...DOCUMENT,
            sort: 2,
        });

        const { result: guidelineActions } = renderHook(() => useGuidelineActions(appBridge));

        // Mock the response to add an extra category to the document category
        fetchDocumentsSpy.mockResolvedValueOnce([
            DocumentDummy.withFields({ ...DocumentDummy.with(DOCUMENT_ID_1), sort: 1 }),
            DocumentDummy.withFields({ ...DocumentDummy.with(DOCUMENT_ID_2), sort: 2 }),
            DocumentDummy.withFields({ ...DocumentDummy.with(DOCUMENT_ID_3), sort: 3 }),
            DocumentDummy.withFields({ ...DocumentDummy.with(DOCUMENT_ID_4), sort: 4 }),
            DOCUMENT,
        ]);

        const { result: ungroupedDocuments } = renderHook(() => useUngroupedDocuments(appBridge));

        await waitFor(() => {
            expect(ungroupedDocuments.current.documents.map((document) => document.id)).toEqual([
                DOCUMENT_ID_1,
                DOCUMENT_ID_2,
                DOCUMENT_ID_3,
                DOCUMENT_ID_4,
                DOCUMENT_ID_5,
            ]);
        });

        guidelineActions.current.moveDocument(DOCUMENT, 2);

        expect(moveDocumentSpy).toHaveBeenCalledOnce();

        await waitFor(() => {
            expect(emitSpy.mock.calls).toEqual([
                [
                    'AppBridge:GuidelineDocument:MoveEvent',
                    {
                        document: {
                            ...DOCUMENT,
                            sort: 5,
                        },
                        position: 2,
                        action: 'movePreview',
                    },
                ],
                [
                    'AppBridge:GuidelineDocument:Action',
                    {
                        document: {
                            ...DOCUMENT,
                            sort: 2,
                        },
                        action: 'move',
                    },
                ],
            ]);
        });
    });

    it('should move a document into a group and emit 3 events', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getDocumentsByDocumentGroupId');
        const emitSpy = vi.spyOn(window.emitter, 'emit');

        const { result: guidelineActions } = renderHook(() => useGuidelineActions(appBridge));

        const DOCUMENT_1 = DocumentDummy.withFields({
            ...DocumentDummy.with(DOCUMENT_ID_1),
            sort: 1,
        });
        const DOCUMENT_2 = DocumentDummy.withFields({
            ...DocumentDummy.with(DOCUMENT_ID_2),
            sort: 2,
        });
        const DOCUMENT_3 = DocumentDummy.withFields({
            ...DocumentDummy.with(DOCUMENT_ID_3),
            sort: 3,
        });
        const DOCUMENT_4 = DocumentDummy.withFields({
            ...DocumentDummy.with(DOCUMENT_ID_4),
            sort: 4,
        });

        const moveGroupSpy = spy.mockResolvedValueOnce([DOCUMENT_1, DOCUMENT_2, DOCUMENT_3, DOCUMENT_4]);
        const moveGroupSpyAfter = spy.mockResolvedValueOnce([DOCUMENT_2, DOCUMENT_3, DOCUMENT_4]);

        const { result: groupedDocuments } = renderHook(() => useGroupedDocuments(appBridge, DOCUMENT_GROUP_ID_1));

        expect(moveGroupSpy).toHaveBeenCalledOnce();

        await waitFor(() => {
            expect(groupedDocuments.current.documents.map((document) => document.id)).toEqual([
                DOCUMENT_ID_1,
                DOCUMENT_ID_2,
                DOCUMENT_ID_3,
                DOCUMENT_ID_4,
            ]);
        });

        guidelineActions.current.moveDocument(DOCUMENT_1, 5, DOCUMENT_GROUP_ID_2);

        expect(moveGroupSpyAfter).toHaveBeenCalledOnce();

        await waitFor(() => {
            expect(emitSpy.mock.calls).toEqual([
                [
                    'AppBridge:GuidelineDocument:MoveEvent',
                    {
                        document: DOCUMENT_1,
                        position: 5,
                        newGroupId: DOCUMENT_GROUP_ID_2,
                        action: 'movePreview',
                    },
                ],
                [
                    'AppBridge:GuidelineDocument:Action',
                    {
                        document: DOCUMENT_1,
                        action: 'delete',
                    },
                ],
                [
                    'AppBridge:GuidelineDocument:Action',
                    {
                        document: {
                            ...DOCUMENT_1,
                            sort: 5,
                        },
                        action: 'add',
                    },
                ],
            ]);
        });
    });

    it('should move a document group and emit 2 events', async () => {
        const DOCUMENT_GROUP_1 = DocumentGroupDummy.withFields({
            ...DocumentGroupDummy.with(DOCUMENT_GROUP_ID_1),
            sort: 1,
        });

        const appBridge = getAppBridgeThemeStub();
        const fetchDocumentGroupsSpy = vi.spyOn(appBridge, 'getDocumentGroups');
        const emitSpy = vi.spyOn(window.emitter, 'emit');

        const moveDocumentGroupSpy = vi.spyOn(appBridge, 'moveDocumentGroup').mockResolvedValueOnce({
            ...DOCUMENT_GROUP_1,
            sort: 2,
        });

        const { result: guidelineActions } = renderHook(() => useGuidelineActions(appBridge));

        fetchDocumentGroupsSpy.mockResolvedValueOnce([
            DOCUMENT_GROUP_1,
            DocumentGroupDummy.withFields({ ...DocumentGroupDummy.with(DOCUMENT_GROUP_ID_2), sort: 2 }),
            DocumentGroupDummy.withFields({ ...DocumentGroupDummy.with(DOCUMENT_GROUP_ID_3), sort: 3 }),
        ]);

        const { result: documentGroups } = renderHook(() => useDocumentGroups(appBridge));

        await waitFor(() => {
            expect(documentGroups.current.documentGroups.map((documentGroup) => documentGroup.id)).toEqual([
                DOCUMENT_GROUP_ID_1,
                DOCUMENT_GROUP_ID_2,
                DOCUMENT_GROUP_ID_3,
            ]);
        });

        guidelineActions.current.moveDocumentGroup(DOCUMENT_GROUP_1, 2);

        expect(moveDocumentGroupSpy).toHaveBeenCalledOnce();

        await waitFor(() => {
            expect(emitSpy.mock.calls).toEqual([
                [
                    'AppBridge:GuidelineDocumentGroup:MoveEvent',
                    {
                        documentGroup: DOCUMENT_GROUP_1,
                        position: 2,
                        action: 'movePreview',
                    },
                ],
                [
                    'AppBridge:GuidelineDocumentGroup:Action',
                    {
                        documentGroup: {
                            ...DOCUMENT_GROUP_1,
                            sort: 2,
                        },
                        action: 'update',
                    },
                ],
            ]);
        });
    });

    it('should move a document category and emit 2 events', async () => {
        const CATEGORY_1 = DocumentCategoryDummy.withFields({
            ...DocumentCategoryDummy.with(DOCUMENT_CATEGORY_ID_1),
            sort: 1,
        });
        const CATEGORY_2 = DocumentCategoryDummy.withFields({
            ...DocumentCategoryDummy.with(DOCUMENT_CATEGORY_ID_2),
            sort: 2,
        });
        const CATEGORY_3 = DocumentCategoryDummy.withFields({
            ...DocumentCategoryDummy.with(DOCUMENT_CATEGORY_ID_3),
            sort: 3,
        });

        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getDocumentCategoriesByDocumentId');
        const emitSpy = vi.spyOn(window.emitter, 'emit');

        const { result: guidelineActions } = renderHook(() => useGuidelineActions(appBridge));

        const categoriesSpy = spy.mockResolvedValueOnce([CATEGORY_1, CATEGORY_2, CATEGORY_3]);

        const { result: documentCategories } = renderHook(() => useDocumentCategories(appBridge, DOCUMENT_ID_1));

        expect(categoriesSpy).toHaveBeenCalledOnce();

        await waitFor(() => {
            expect(
                documentCategories.current.documentCategories.map((documentCategory) => documentCategory.id),
            ).toEqual([DOCUMENT_CATEGORY_ID_1, DOCUMENT_CATEGORY_ID_2, DOCUMENT_CATEGORY_ID_3]);
        });

        guidelineActions.current.moveDocumentCategory(CATEGORY_1, DOCUMENT_ID_1, 2);
        expect(categoriesSpy).toHaveBeenCalledOnce();

        await waitFor(() => {
            expect(emitSpy.mock.calls).toEqual([
                [
                    'AppBridge:GuidelineDocumentCategory:MoveEvent',
                    {
                        documentCategory: CATEGORY_1,
                        documentId: DOCUMENT_ID_1,
                        position: 2,
                        action: 'movePreview',
                    },
                ],
                [
                    'AppBridge:GuidelineDocumentCategory:Action',
                    {
                        documentCategory: {
                            ...CATEGORY_1,
                            documentId: DOCUMENT_ID_1,
                            sort: 2,
                        },
                        action: 'update',
                    },
                ],
            ]);
        });
    });
});
