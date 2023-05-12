/* (c) Copyright Frontify Ltd., all rights reserved. */

import mitt from 'mitt';
import { act, renderHook, waitFor } from '@testing-library/react';
import { SpyInstance, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

    beforeEach(() => {
        const appBridgeStub = getAppBridgeThemeStub();
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

    it('should not throw deleteDocumentPage', async () => {
        const deleteDocumentPageMock = vi.fn(useGuidelineActionsStub.deleteDocumentPage);

        expect(deleteDocumentPageMock({ id: 1, documentId: 10, categoryId: null })).resolves.not.toThrow();
    });

    it('should not throw deleteDocumentGroup', async () => {
        const deleteDocumentGroupMock = vi.fn(useGuidelineActionsStub.deleteDocumentGroup);

        expect(deleteDocumentGroupMock(1)).resolves.not.toThrow();
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
            useGuidelineActionsStub.deleteLink(documentId);
        });

        await waitFor(() => {
            expect(deleteLink).toHaveBeenCalledWith(documentId);
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
            useGuidelineActionsStub.deleteLibrary(documentId);
        });

        await waitFor(() => {
            expect(deleteLibrary).toHaveBeenCalledWith(documentId);
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
            useGuidelineActionsStub.deleteDocument(documentId);
        });

        await waitFor(() => {
            expect(deleteStandardDocument).toHaveBeenCalledWith(documentId);
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
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocumentGroup:Action', {
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

        const page = {
            id: 2341,
            documentId: 10,
        };

        act(() => {
            useGuidelineActionsStub.duplicateDocumentPage(page);
        });

        const documentPageDuplicateDummy = DocumentPageDuplicateDummy.with(2341);

        await waitFor(() => {
            expect(duplicateDocumentPage).toHaveBeenCalledWith(page);
            expect(emitSpy).toHaveBeenCalledWith('AppBridge:GuidelineDocumentPage:Action', {
                documentPage: {
                    ...documentPageDuplicateDummy,
                    title: documentPageDuplicateDummy.name,
                    documentId: page.documentId,
                },
                action: 'add',
            });
        });
    });

    //TODO: fix
    it.skip('should move a page between documents and emit all events', async () => {
        const moveDocumentPage = vi.spyOn(useGuidelineActionsStub, 'moveDocumentPage');

        const documentPageId = 23442;
        const targetDocumentId = 22;

        act(() => {
            useGuidelineActionsStub.moveDocumentPage(documentPageId, targetDocumentId);
        });

        expect(moveDocumentPage).toHaveBeenCalledWith(documentPageId, targetDocumentId);

        await waitFor(() => {
            expect(emitSpy?.mock.calls).toEqual([
                [
                    'AppBridge:GuidelineDocumentPage:Action',
                    {
                        documentPage: { id: documentPageId, documentId: targetDocumentId, categoryId: null },
                        action: 'delete',
                    },
                ],
                [
                    'AppBridge:GuidelineDocumentPage:Action',
                    {
                        documentPage: { id: documentPageId, documentId: targetDocumentId, categoryId: null },
                        action: 'delete',
                    },
                ],
                [
                    'AppBridge:GuidelineDocumentPage:Action',
                    {
                        documentPage: DocumentPageDummy.with(documentPageId),
                        action: 'update',
                    },
                ],
            ]);
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
});
