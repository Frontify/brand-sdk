/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { getAppBridgeThemeStub } from '../tests';

import { useGuidelineActions } from './useGuidelineActions';

describe('useGuidelineActions hook', () => {
    let useGuidelineActionsStub: ReturnType<typeof useGuidelineActions>;

    beforeAll(() => {
        const appBridgeStub = getAppBridgeThemeStub();
        const { result } = renderHook(() => useGuidelineActions(appBridgeStub));

        useGuidelineActionsStub = result.current;
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

        expect(updateCategoryMock({ id: 1, title: 'updateCategoryTest' })).resolves.not.toThrow();
    });

    it('should not throw updatePage', async () => {
        const updatePageMock = vi.fn(useGuidelineActionsStub.updatePage);

        expect(updatePageMock({ id: 1, title: 'updatePageTest' })).resolves.not.toThrow();
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

        expect(deletePageMock(1)).resolves.not.toThrow();
    });

    it('should not throw deleteDocumentGroup', async () => {
        const deleteDocumentGroupMock = vi.fn(useGuidelineActionsStub.deleteDocumentGroup);

        expect(deleteDocumentGroupMock(1)).resolves.not.toThrow();
    });

    it('should not throw deleteCategory', async () => {
        const deleteCategoryMock = vi.fn(useGuidelineActionsStub.deleteCategory);

        expect(deleteCategoryMock(1)).resolves.not.toThrow();
    });

    it('should not throw deleteCoverPage', async () => {
        const deleteCoverPageMock = vi.fn(useGuidelineActionsStub.deleteCoverPage);

        expect(deleteCoverPageMock()).resolves.not.toThrow();
    });
});
