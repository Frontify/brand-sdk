/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook, waitFor } from '@testing-library/react';
import mitt from 'mitt';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { DocumentSectionDummy } from '../tests/DocumentSectionDummy';
import { AppBridgeBlock, AppBridgeTheme } from '../';

import { useDocumentSection } from './useDocumentSection';

const DOCUMENT_PAGE_ID = 45;

const documentSections = [
    DocumentSectionDummy.withFields({ id: 464, title: null }),
    DocumentSectionDummy.withFields({ id: 356, title: 'New Title' }),
    DocumentSectionDummy.withFields({ id: 37675, title: ' ' }),
];

describe('useDocumentSection', () => {
    const appBridge: AppBridgeBlock | AppBridgeTheme = {} as AppBridgeBlock | AppBridgeTheme;

    beforeAll(() => {
        window.emitter = mitt();
        appBridge.getDocumentSectionsByDocumentPageId = vi.fn().mockResolvedValue(documentSections);
    });

    it('should return the document sections from appBridge', async () => {
        const { result } = renderHook(() => useDocumentSection(appBridge, DOCUMENT_PAGE_ID));

        await waitFor(() => {
            expect(result.current.documentSections).toEqual(documentSections);
        });
    });

    it('should filter sections with null and falsey titles from navigation items', async () => {
        const { result } = renderHook(() => useDocumentSection(appBridge, DOCUMENT_PAGE_ID));

        await waitFor(() => {
            expect(result.current.navigationItems).toEqual([documentSections[1]]);
        });
    });

    it('should filter sections with null and falsey titles from navigation items', async () => {
        const { result } = renderHook(() => useDocumentSection(appBridge, DOCUMENT_PAGE_ID));

        await waitFor(() => {
            expect(result.current.navigationItems).toEqual([documentSections[1]]);
        });
    });

    describe('when a section is added', () => {
        it('should add the section to the start of the documentSections if insertAfterSectionId is null', async () => {
            const NEW_SECTION = DocumentSectionDummy.with(535);

            const { result } = renderHook(() => useDocumentSection(appBridge, DOCUMENT_PAGE_ID));

            await waitFor(() => {
                expect(result.current.documentSections).toEqual(documentSections);
            });

            window.emitter.emit('AppBridge:GuidelineDocumentSection:Action', {
                action: 'add',
                documentPageId: DOCUMENT_PAGE_ID,
                documentSection: NEW_SECTION,
                insertAfterSectionId: null,
            });

            await waitFor(() => {
                expect(result.current.documentSections).toEqual([NEW_SECTION, ...documentSections]);
                expect(result.current.navigationItems).toEqual([NEW_SECTION, documentSections[1]]);
            });
        });

        it('should add the section after the section with matching id to insertAfterSectionId', async () => {
            const NEW_SECTION = DocumentSectionDummy.with(535);

            const { result } = renderHook(() => useDocumentSection(appBridge, DOCUMENT_PAGE_ID));

            await waitFor(() => {
                expect(result.current.documentSections).toEqual(documentSections);
            });

            window.emitter.emit('AppBridge:GuidelineDocumentSection:Action', {
                action: 'add',
                documentPageId: DOCUMENT_PAGE_ID,
                documentSection: NEW_SECTION,
                insertAfterSectionId: documentSections[1].id,
            });

            await waitFor(() => {
                expect(result.current.documentSections).toEqual([
                    documentSections[0],
                    documentSections[1],
                    NEW_SECTION,
                    documentSections[2],
                ]);
                expect(result.current.navigationItems).toEqual([documentSections[1], NEW_SECTION]);
            });
        });

        it('should not add the section to the array if the documentPageId is incorrect', async () => {
            const NEW_SECTION = DocumentSectionDummy.with(535);

            const { result } = renderHook(() => useDocumentSection(appBridge, DOCUMENT_PAGE_ID));

            await waitFor(() => {
                expect(result.current.documentSections).toEqual(documentSections);
            });

            window.emitter.emit('AppBridge:GuidelineDocumentSection:Action', {
                action: 'add',
                documentPageId: DOCUMENT_PAGE_ID + 1,
                documentSection: NEW_SECTION,
                insertAfterSectionId: documentSections[1].id,
            });

            await waitFor(() => {
                expect(result.current.documentSections).toEqual(documentSections);
                expect(result.current.navigationItems).toEqual([documentSections[1]]);
            });
        });

        it("should add the section to the end of the array if the insertAfterSectionId doesn't exist", async () => {
            const NEW_SECTION = DocumentSectionDummy.with(535);

            const { result } = renderHook(() => useDocumentSection(appBridge, DOCUMENT_PAGE_ID));

            await waitFor(() => {
                expect(result.current.documentSections).toEqual(documentSections);
            });

            window.emitter.emit('AppBridge:GuidelineDocumentSection:Action', {
                action: 'add',
                documentPageId: DOCUMENT_PAGE_ID,
                documentSection: NEW_SECTION,
                insertAfterSectionId: 123,
            });

            await waitFor(() => {
                expect(result.current.documentSections).toEqual([...documentSections, NEW_SECTION]);
                expect(result.current.navigationItems).toEqual([documentSections[1], NEW_SECTION]);
            });
        });
    });

    describe('when a section is updated', () => {
        it('should update the section with matching id', async () => {
            const UPDATED_SECTION = DocumentSectionDummy.withFields({
                id: documentSections[1].id,
                title: 'Updated Title',
                slug: 'updated-slug',
            });

            const { result } = renderHook(() => useDocumentSection(appBridge, DOCUMENT_PAGE_ID));

            await waitFor(() => {
                expect(result.current.documentSections).toEqual(documentSections);
            });

            window.emitter.emit('AppBridge:GuidelineDocumentSection:Action', {
                action: 'update',
                documentPageId: DOCUMENT_PAGE_ID,
                sectionId: UPDATED_SECTION.id,
                title: UPDATED_SECTION.title,
                slug: UPDATED_SECTION.slug,
            });

            await waitFor(() => {
                expect(result.current.documentSections).toEqual([
                    documentSections[0],
                    UPDATED_SECTION,
                    documentSections[2],
                ]);
                expect(result.current.navigationItems).toEqual([UPDATED_SECTION]);
            });
        });

        it('should remove section from navigation items if title becomes falsey', async () => {
            const UPDATED_SECTION = DocumentSectionDummy.withFields({
                id: documentSections[1].id,
                title: '  ',
                slug: 'updated-slug',
            });

            const { result } = renderHook(() => useDocumentSection(appBridge, DOCUMENT_PAGE_ID));

            await waitFor(() => {
                expect(result.current.documentSections).toEqual(documentSections);
            });

            window.emitter.emit('AppBridge:GuidelineDocumentSection:Action', {
                action: 'update',
                documentPageId: DOCUMENT_PAGE_ID,
                sectionId: UPDATED_SECTION.id,
                title: UPDATED_SECTION.title,
                slug: UPDATED_SECTION.slug,
            });

            await waitFor(() => {
                expect(result.current.navigationItems).toEqual([]);
            });
        });

        it('should add section to navigation items if title becomes truthy', async () => {
            const UPDATED_SECTION = DocumentSectionDummy.withFields({
                id: documentSections[2].id,
                title: 'Updated Title',
                slug: 'updated-slug',
            });

            const { result } = renderHook(() => useDocumentSection(appBridge, DOCUMENT_PAGE_ID));

            await waitFor(() => {
                expect(result.current.documentSections).toEqual(documentSections);
            });

            window.emitter.emit('AppBridge:GuidelineDocumentSection:Action', {
                action: 'update',
                documentPageId: DOCUMENT_PAGE_ID,
                sectionId: UPDATED_SECTION.id,
                title: UPDATED_SECTION.title,
                slug: UPDATED_SECTION.slug,
            });

            await waitFor(() => {
                expect(result.current.navigationItems).toEqual([documentSections[1], UPDATED_SECTION]);
            });
        });

        it('should not adjust array if documentPageId is incorrect', async () => {
            const UPDATED_SECTION = DocumentSectionDummy.withFields({
                id: documentSections[2].id,
                title: 'Updated Title',
                slug: 'updated-slug',
            });

            const { result } = renderHook(() => useDocumentSection(appBridge, DOCUMENT_PAGE_ID));

            await waitFor(() => {
                expect(result.current.documentSections).toEqual(documentSections);
            });

            window.emitter.emit('AppBridge:GuidelineDocumentSection:Action', {
                action: 'update',
                documentPageId: DOCUMENT_PAGE_ID + 1,
                sectionId: UPDATED_SECTION.id,
                title: UPDATED_SECTION.title,
                slug: UPDATED_SECTION.slug,
            });

            await waitFor(() => {
                expect(result.current.navigationItems).toEqual([documentSections[1]]);
            });
        });
    });

    describe('when a section is deleted', () => {
        it('should remove the section with matching id', async () => {
            const { result } = renderHook(() => useDocumentSection(appBridge, DOCUMENT_PAGE_ID));

            await waitFor(() => {
                expect(result.current.documentSections).toEqual(documentSections);
            });

            window.emitter.emit('AppBridge:GuidelineDocumentSection:Action', {
                action: 'delete',
                documentPageId: DOCUMENT_PAGE_ID,
                sectionId: documentSections[1].id,
            });

            await waitFor(() => {
                expect(result.current.documentSections).toEqual([documentSections[0], documentSections[2]]);
                expect(result.current.navigationItems).toEqual([]);
            });
        });

        it('should not remove section if document page id is incorrect', async () => {
            const { result } = renderHook(() => useDocumentSection(appBridge, DOCUMENT_PAGE_ID));

            await waitFor(() => {
                expect(result.current.documentSections).toEqual(documentSections);
            });

            window.emitter.emit('AppBridge:GuidelineDocumentSection:Action', {
                action: 'delete',
                documentPageId: DOCUMENT_PAGE_ID + 1,
                sectionId: documentSections[1].id,
            });

            await waitFor(() => {
                expect(result.current.documentSections).toEqual(documentSections);
                expect(result.current.navigationItems).toEqual([documentSections[1]]);
            });
        });
    });
});
