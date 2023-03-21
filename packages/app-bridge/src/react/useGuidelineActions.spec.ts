/* (c) Copyright Frontify Ltd., all rights reserved. */

import mitt from 'mitt';
import { act, renderHook, waitFor } from '@testing-library/react';
import { SpyInstance, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    BrandportalLinkDummy,
    CoverPageDummy,
    DocumentCategoryDummy,
    DocumentDummy,
    DocumentGroupDummy,
    DocumentPageDummy,
    DocumentPageDuplicateDummy,
    getAppBridgeThemeStub,
} from '../tests';

import { useGuidelineActions } from './useGuidelineActions';
import {
    BrandportalLink,
    CoverPage,
    CoverPageCreate,
    CoverPageUpdate,
    DocumentCategoryCreate,
    DocumentCategoryUpdate,
    DocumentGroupCreate,
    DocumentGroupUpdate,
    DocumentLibraryCreate,
    DocumentLibraryUpdate,
    DocumentLinkCreate,
    DocumentLinkUpdate,
    DocumentPageCreate,
    DocumentPageUpdate,
    DocumentStandardCreate,
    DocumentStandardUpdate,
} from '../types';

describe('useGuidelineActions hook', () => {
    let useGuidelineActionsStub: ReturnType<typeof useGuidelineActions>;
    let emitSpy: SpyInstance | null = null;

    beforeAll(() => {
        const appBridgeStub = getAppBridgeThemeStub();
        const { result } = renderHook(() => useGuidelineActions(appBridgeStub));

        useGuidelineActionsStub = result.current;
    });

    beforeEach(() => {
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

    it('should not throw createCategory', async () => {
        const createCategoryMock = vi.fn(useGuidelineActionsStub.createCategory);

        expect(createCategoryMock({ title: 'testCategory', documentId: 4 })).resolves.not.toThrow();
    });

    it('should not throw createPage', async () => {
        const createPageMock = vi.fn(useGuidelineActionsStub.createPage);

        expect(createPageMock({ title: 'testPage', documentId: 5 })).resolves.not.toThrow();
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

    it('should not throw updateCategory', async () => {
        const updateCategoryMock = vi.fn(useGuidelineActionsStub.updateCategory);

        expect(updateCategoryMock({ id: 1, title: 'updateCategoryTest', documentId: 20 })).resolves.not.toThrow();
    });

    it('should not throw updatePage', async () => {
        const updatePageMock = vi.fn(useGuidelineActionsStub.updatePage);

        expect(updatePageMock({ id: 1, title: 'updatePageTest', documentId: 20 })).resolves.not.toThrow();
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

        expect(deleteDocumentMock(1)).resolves.not.toThrow();
    });

    it('should not throw deleteLibrary', async () => {
        const deleteLibraryMock = vi.fn(useGuidelineActionsStub.deleteLibrary);

        expect(deleteLibraryMock(1)).resolves.not.toThrow();
    });

    it('should not throw deleteLink', async () => {
        const deleteLinkMock = vi.fn(useGuidelineActionsStub.deleteLink);

        expect(deleteLinkMock(1)).resolves.not.toThrow();
    });

    it('should not throw deletePage', async () => {
        const deletePageMock = vi.fn(useGuidelineActionsStub.deletePage);

        expect(deletePageMock({ id: 1, documentId: 10 })).resolves.not.toThrow();
    });

    it('should not throw deleteDocumentGroup', async () => {
        const deleteDocumentGroupMock = vi.fn(useGuidelineActionsStub.deleteDocumentGroup);

        expect(deleteDocumentGroupMock(1)).resolves.not.toThrow();
    });

    it('should not throw deleteCategory', async () => {
        const deleteCategoryMock = vi.fn(useGuidelineActionsStub.deleteCategory);

        expect(deleteCategoryMock({ id: 1, documentId: 10 })).resolves.not.toThrow();
    });

    it('should not throw deleteCoverPage', async () => {
        const deleteCoverPageMock = vi.fn(useGuidelineActionsStub.deleteCoverPage);

        expect(deleteCoverPageMock()).resolves.not.toThrow();
    });

    it('should not throw duplicatePage', async () => {
        const duplicatePageMock = vi.fn(useGuidelineActionsStub.duplicatePage);

        expect(duplicatePageMock({ id: 1, documentId: 5 })).resolves.not.toThrow();
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
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocumentAction', {
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
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocumentAction', {
                document: { ...DocumentDummy.with(1), documentGroupId: link.documentGroupId },
                action: 'update',
            });
        });
    });

    it('should delete a link and emit an event', async () => {
        const deleteLink = vi.spyOn(useGuidelineActionsStub, 'deleteLink');

        const id = 1;

        act(() => {
            useGuidelineActionsStub.deleteLink(id);
        });

        await waitFor(() => {
            expect(deleteLink).toHaveBeenCalledWith(id);
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocumentAction', {
                document: { id },
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
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocumentAction', {
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
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocumentAction', {
                document: { ...DocumentDummy.with(1), documentGroupId: library.documentGroupId },
                action: 'update',
            });
        });
    });

    it('should delete a library and emit an event', async () => {
        const deleteLibrary = vi.spyOn(useGuidelineActionsStub, 'deleteLibrary');

        const id = 1;

        act(() => {
            useGuidelineActionsStub.deleteLibrary(id);
        });

        await waitFor(() => {
            expect(deleteLibrary).toHaveBeenCalledWith(id);
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocumentAction', {
                document: { id },
                action: 'delete',
            });
        });
    });

    it('should create a standard document and emit an event', async () => {
        const createStandardDocument = vi.spyOn(useGuidelineActionsStub, 'createDocument');

        const document: DocumentStandardCreate = {
            title: 'Test Standard Document',
            documentGroupId: 1,
        };

        act(() => {
            useGuidelineActionsStub.createDocument(document);
        });

        await waitFor(() => {
            expect(createStandardDocument).toHaveBeenCalledWith(document);
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocumentAction', {
                document: { ...DocumentDummy.with(1), documentGroupId: document.documentGroupId },
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
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocumentAction', {
                document: { ...DocumentDummy.with(1), documentGroupId: document.documentGroupId },
                action: 'update',
            });
        });
    });

    it('should delete a standard document and emit an event', async () => {
        const deleteStandardDocument = vi.spyOn(useGuidelineActionsStub, 'deleteDocument');

        const id = 1;

        act(() => {
            useGuidelineActionsStub.deleteDocument(id);
        });

        await waitFor(() => {
            expect(deleteStandardDocument).toHaveBeenCalledWith(id);
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocumentAction', {
                document: { id },
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
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineCoverPageAction', {
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
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineCoverPageAction', {
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
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineCoverPageAction', {
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
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineCoverPageAction', {
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
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineBrandportalLinkAction', {
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
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocumentGroupAction', {
                documentGroup: DocumentGroupDummy.with(1, []),
                action: 'add',
            });
        });
    });

    it('should update a document group and emit an event', async () => {
        const updateDocumentGroup = vi.spyOn(useGuidelineActionsStub, 'updateDocumentGroup');

        const group: DocumentGroupUpdate = {
            id: 1,
            name: 'Updated Document Group',
        };

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { documents, ...restOfDocumentGroup } = DocumentGroupDummy.with(1, []);

        act(() => {
            useGuidelineActionsStub.updateDocumentGroup(group);
        });

        await waitFor(() => {
            expect(updateDocumentGroup).toHaveBeenCalledWith(group);
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocumentGroupAction', {
                documentGroup: restOfDocumentGroup,
                action: 'update',
            });
        });
    });

    it('should delete a document group and emit an event', async () => {
        const deleteDocumentGroup = vi.spyOn(useGuidelineActionsStub, 'deleteDocumentGroup');

        const id = 1;

        act(() => {
            useGuidelineActionsStub.deleteDocumentGroup(id);
        });

        await waitFor(() => {
            expect(deleteDocumentGroup).toHaveBeenCalledWith(id);
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocumentGroupAction', {
                documentGroup: { id },
                action: 'delete',
            });
        });
    });

    it('should create a document category and emit an event', async () => {
        const createDocumentCategory = vi.spyOn(useGuidelineActionsStub, 'createCategory');

        const category: DocumentCategoryCreate = {
            title: 'Test Document Category',
            documentId: 1,
        };

        act(() => {
            useGuidelineActionsStub.createCategory(category);
        });

        await waitFor(() => {
            expect(createDocumentCategory).toHaveBeenCalledWith(category);
            expect(emitSpy).toHaveBeenCalledWith(`AppBridge:GuidelineDocumentCategoryAction:${category.documentId}`, {
                documentCategory: DocumentCategoryDummy.with(1, []),
                action: 'add',
            });
        });
    });

    it('should update a document category and emit an event', async () => {
        const updateDocumentCategory = vi.spyOn(useGuidelineActionsStub, 'updateCategory');

        const category: DocumentCategoryUpdate = {
            id: 1,
            title: 'Updated Document Category',
            documentId: 15,
        };

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { documentPages, ...categoryWithoutPages } = DocumentCategoryDummy.with(1, []);

        act(() => {
            useGuidelineActionsStub.updateCategory(category);
        });

        await waitFor(() => {
            expect(updateDocumentCategory).toHaveBeenCalledWith(category);
            expect(emitSpy).toHaveBeenCalledWith(`AppBridge:GuidelineDocumentCategoryAction:${category.documentId}`, {
                documentCategory: categoryWithoutPages,
                action: 'update',
            });
        });
    });

    it('should delete a document category and emit an event', async () => {
        const deleteDocumentCategory = vi.spyOn(useGuidelineActionsStub, 'deleteCategory');

        const category = { id: 1, documentId: 16 };

        act(() => {
            useGuidelineActionsStub.deleteCategory(category);
        });

        await waitFor(() => {
            expect(deleteDocumentCategory).toHaveBeenCalledWith(category);
            expect(emitSpy).toHaveBeenCalledWith(`AppBridge:GuidelineDocumentCategoryAction:${category.documentId}`, {
                documentCategory: { id: category.id },
                action: 'delete',
            });
        });
    });

    it('should create a page and emit an event', async () => {
        const createPage = vi.spyOn(useGuidelineActionsStub, 'createPage');

        const page: DocumentPageCreate = {
            title: 'Test Page',
            documentId: 1,
        };

        act(() => {
            useGuidelineActionsStub.createPage(page);
        });

        await waitFor(() => {
            expect(createPage).toHaveBeenCalledWith(page);
            expect(emitSpy).toHaveBeenCalledWith(`AppBridge:GuidelineDocumentPageAction:${page.documentId}`, {
                documentPage: DocumentPageDummy.with(1),
                action: 'add',
            });
        });
    });

    it('should update a page and emit an event', async () => {
        const updatePage = vi.spyOn(useGuidelineActionsStub, 'updatePage');

        const page: DocumentPageUpdate = {
            id: 1,
            title: 'Updated Page',
            documentId: 25,
        };

        act(() => {
            useGuidelineActionsStub.updatePage(page);
        });

        await waitFor(() => {
            expect(updatePage).toHaveBeenCalledWith(page);
            expect(emitSpy).toHaveBeenCalledWith(
                `AppBridge:GuidelineDocumentPageAction:${DocumentPageDummy.with(1).documentId}`,
                {
                    documentPage: DocumentPageDummy.with(1),
                    action: 'update',
                },
            );
        });
    });

    it('should delete a page and emit an event', async () => {
        const deletePage = vi.spyOn(useGuidelineActionsStub, 'deletePage');

        const page = { id: 1, documentId: 22 };

        act(() => {
            useGuidelineActionsStub.deletePage(page);
        });

        await waitFor(() => {
            expect(deletePage).toHaveBeenCalledWith(page);
            expect(emitSpy).toHaveBeenCalledWith(`AppBridge:GuidelineDocumentPageAction:${page.documentId}`, {
                documentPage: { id: page.id },
                action: 'delete',
            });
        });
    });

    it('should duplicate a page and emit an event', async () => {
        const duplicatePage = vi.spyOn(useGuidelineActionsStub, 'duplicatePage');

        const page = {
            id: 2341,
            documentId: 10,
        };

        act(() => {
            useGuidelineActionsStub.duplicatePage(page);
        });

        const documentPageDuplicateDummy = DocumentPageDuplicateDummy.with(2341);

        await waitFor(() => {
            expect(duplicatePage).toHaveBeenCalledWith(page);
            expect(emitSpy).toHaveBeenCalledWith(`AppBridge:GuidelineDocumentPageAction:${page.documentId}`, {
                documentPage: {
                    ...documentPageDuplicateDummy,
                    title: documentPageDuplicateDummy.name,
                    documentId: page.documentId,
                },
                action: 'add',
            });
        });
    });

    it('should move a page between documents and emit all events', async () => {
        const moveDocumentPageBetweenDocuments = vi.spyOn(useGuidelineActionsStub, 'moveDocumentPageBetweenDocuments');

        const page = { id: 1, sourceDocumentId: 22, targetDocumentId: 33 };

        act(() => {
            useGuidelineActionsStub.moveDocumentPageBetweenDocuments(
                page.id,
                page.sourceDocumentId,
                page.targetDocumentId,
            );
        });

        await waitFor(() => {
            expect(moveDocumentPageBetweenDocuments).toHaveBeenCalledWith(
                page.id,
                page.sourceDocumentId,
                page.targetDocumentId,
            );
            expect(emitSpy).toHaveBeenCalledWith(`AppBridge:GuidelineDocumentPageAction:${page.sourceDocumentId}`, {
                documentPage: { id: page.id, documentId: page.sourceDocumentId },
                action: 'update',
            });
            expect(emitSpy).toHaveBeenCalledWith(`AppBridge:GuidelineDocumentPageAction:${page.targetDocumentId}`, {
                documentPage: { id: page.id, documentId: page.targetDocumentId },
                action: 'update',
            });
        });
    });

    it('should udpate document targets and emit all events', async () => {
        const updateDocumentTargets = vi.spyOn(useGuidelineActionsStub, 'updateDocumentTargets');

        const targets = [1, 2, 3];
        const documentIds = [204];

        act(() => {
            useGuidelineActionsStub.updateDocumentTargets(targets, documentIds);
        });

        await waitFor(() => {
            expect(updateDocumentTargets).toHaveBeenCalledWith(targets, documentIds);
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocumentTargetsAction', {
                payload: {
                    targets,
                    documentIds,
                },
                action: 'update',
            });
        });
    });

    it('should udpate document page targets and emit all events', async () => {
        const updateDocumentPageTargets = vi.spyOn(useGuidelineActionsStub, 'updateDocumentPageTargets');

        const targets = [1, 2, 3];
        const pageIds = [204];

        act(() => {
            useGuidelineActionsStub.updateDocumentPageTargets(targets, pageIds);
        });

        await waitFor(() => {
            expect(updateDocumentPageTargets).toHaveBeenCalledWith(targets, pageIds);
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocumentPageTargetsAction', {
                payload: { targets, pageIds },
                action: 'update',
            });
        });
    });
});
