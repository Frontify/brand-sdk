/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useMemo, useState } from 'react';

import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { DocumentSection, EmitterEvents } from '../types';

const getNavigationItems = (sections: DocumentSection[]) => sections.filter((section) => !!section.title?.trim());

const insertSectionIntoArray = (
    previousSections: DocumentSection[],
    documentSection: DocumentSection,
    insertAfterSectionId: Nullable<number>,
) => {
    if (insertAfterSectionId === null) {
        return [documentSection, ...previousSections];
    }
    const index = previousSections.findIndex((section) => section.id === insertAfterSectionId);
    if (index >= 0) {
        return [...previousSections.slice(0, index + 1), documentSection, ...previousSections.slice(index + 1)];
    }
    return [...previousSections, documentSection];
};

const updateSectionInArray = (
    previousSections: DocumentSection[],
    sectionIdToUpdate: number,
    title: Nullable<string>,
    slug: string,
) => previousSections.map((section) => (section.id === sectionIdToUpdate ? { ...section, title, slug } : section));

const deleteSectionFromArray = (previousSections: DocumentSection[], sectionIdToDelete: number) =>
    previousSections.filter((section) => section.id !== sectionIdToDelete);

export const useDocumentSection = (appBridge: AppBridgeBlock | AppBridgeTheme, documentPageId: number) => {
    const [documentSections, setDocumentSections] = useState<DocumentSection[]>([]);
    const navigationItems = useMemo(() => getNavigationItems(documentSections), [documentSections]);

    useEffect(() => {
        const fetchDocumentSection = async (documentPageId: number) => {
            setDocumentSections(await appBridge.getDocumentSectionsByDocumentPageId(documentPageId));
        };

        fetchDocumentSection(documentPageId);
    }, [appBridge, documentPageId]);

    useEffect(() => {
        const handleSectionEvent = (event: EmitterEvents['AppBridge:GuidelineDocumentSection:Action']) => {
            if (event.documentPageId !== documentPageId) {
                return;
            }
            if (event.action === 'add') {
                const { documentSection, insertAfterSectionId } = event;
                setDocumentSections((previousSections) =>
                    insertSectionIntoArray(previousSections, documentSection, insertAfterSectionId),
                );
            }
            if (event.action === 'update') {
                const { sectionId, title, slug } = event;
                setDocumentSections((previousSections) =>
                    updateSectionInArray(previousSections, sectionId, title, slug),
                );
            }
            if (event.action === 'delete') {
                const { sectionId } = event;
                setDocumentSections((previousSections) => deleteSectionFromArray(previousSections, sectionId));
            }
        };

        window.emitter.on('AppBridge:GuidelineDocumentSection:Action', handleSectionEvent);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentSection:Action', handleSectionEvent);
        };
    }, [documentPageId]);

    return { documentSections, navigationItems };
};
