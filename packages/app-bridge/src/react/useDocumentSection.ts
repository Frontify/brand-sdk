/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useMemo, useState } from 'react';

import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { DocumentSection, EmitterEvents } from '../types';
import { filterDocumentSectionsWithUnreadableTitles } from '../helpers';

const insertSectionIntoArray = (
    previousSections: DocumentSection[],
    documentSection: DocumentSection,
    previousSectionId: Nullable<number>,
) => {
    if (previousSectionId === null) {
        return [documentSection, ...previousSections];
    }
    const index = previousSections.findIndex((section) => section.id === previousSectionId);
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

type UseDocumentSectionReturn = {
    /**
     * The complete list of document sections that belong to the document page with the given documentPageId.
     */
    documentSections: DocumentSection[];
    /**
     * A filtered list of document sections which removes any sections that do not have a readable title.
     * Use this array for creating a navigation menu for the document page.
     */
    navigationItems: DocumentSection[];
};

export const useDocumentSection = (
    appBridge: AppBridgeBlock | AppBridgeTheme,
    documentPageId: number,
): UseDocumentSectionReturn => {
    const [documentSections, setDocumentSections] = useState<DocumentSection[]>([]);
    const navigationItems = useMemo(
        () => filterDocumentSectionsWithUnreadableTitles(documentSections),
        [documentSections],
    );

    useEffect(() => {
        const fetchDocumentSection = async (documentPageId: number) => {
            setDocumentSections(await appBridge.getDocumentSectionsByDocumentPageId(documentPageId));
        };

        fetchDocumentSection(documentPageId);
    }, [appBridge, documentPageId]);

    useEffect(() => {
        const handleSectionEvent = ({
            action,
            payload,
        }: EmitterEvents['AppBridge:GuidelineDocumentSection:Action']) => {
            if (payload.documentPageId !== documentPageId) {
                return;
            }
            switch (action) {
                case 'add':
                    {
                        const { documentSection, previousSectionId } = payload;
                        setDocumentSections((previousSections) =>
                            insertSectionIntoArray(previousSections, documentSection, previousSectionId),
                        );
                    }
                    break;
                case 'update':
                    {
                        const { sectionId, title, slug } = payload;
                        setDocumentSections((previousSections) =>
                            updateSectionInArray(previousSections, sectionId, title, slug),
                        );
                    }
                    break;
                case 'delete':
                    {
                        const { sectionId } = payload;
                        setDocumentSections((previousSections) => deleteSectionFromArray(previousSections, sectionId));
                    }
                    break;
            }
        };

        window.emitter.on('AppBridge:GuidelineDocumentSection:Action', handleSectionEvent);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentSection:Action', handleSectionEvent);
        };
    }, [documentPageId]);

    return { documentSections, navigationItems };
};
