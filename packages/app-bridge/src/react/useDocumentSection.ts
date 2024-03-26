/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useMemo, useState } from 'react';

import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { DocumentSection, EmitterEvents } from '../types';
import { filterDocumentSectionsWithUnreadableTitles } from '../helpers';

const insertDocumentSectionIntoArray = (
    previousDocumentSections: DocumentSection[],
    documentSection: DocumentSection,
    previousDocumentSectionId: Nullable<number>,
) => {
    if (previousDocumentSectionId === null) {
        return [documentSection, ...previousDocumentSections];
    }
    const index = previousDocumentSections.findIndex((section) => section.id === previousDocumentSectionId);
    if (index >= 0) {
        return [
            ...previousDocumentSections.slice(0, index + 1),
            documentSection,
            ...previousDocumentSections.slice(index + 1),
        ];
    }
    return [...previousDocumentSections, documentSection];
};

const updateDocumentSectionInArray = (
    previousSections: DocumentSection[],
    documentSectionIdToUpdate: number,
    title: Nullable<string>,
    slug: string,
) =>
    previousSections.map((section) =>
        section.id === documentSectionIdToUpdate ? { ...section, title, slug } : section,
    );

const deleteDocumentSectionFromArray = (
    previousDocumentSections: DocumentSection[],
    documentSectionIdToDelete: number,
) => previousDocumentSections.filter((documentSection) => documentSection.id !== documentSectionIdToDelete);

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
        const handleDocumentSectionEvent = ({
            action,
            payload,
        }: EmitterEvents['AppBridge:GuidelineDocumentSection:Action']) => {
            if (payload.documentPageId !== documentPageId) {
                return;
            }
            switch (action) {
                case 'add':
                    {
                        const { documentSection, previousDocumentSectionId } = payload;
                        setDocumentSections((previousSections) =>
                            insertDocumentSectionIntoArray(
                                previousSections,
                                documentSection,
                                previousDocumentSectionId,
                            ),
                        );
                    }
                    break;
                case 'update':
                    {
                        const { documentSectionId, title, slug } = payload;
                        setDocumentSections((previousSections) =>
                            updateDocumentSectionInArray(previousSections, documentSectionId, title, slug),
                        );
                    }
                    break;
                case 'delete':
                    {
                        const { documentSectionId } = payload;
                        setDocumentSections((previousSections) =>
                            deleteDocumentSectionFromArray(previousSections, documentSectionId),
                        );
                    }
                    break;
            }
        };

        window.emitter.on('AppBridge:GuidelineDocumentSection:Action', handleDocumentSectionEvent);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentSection:Action', handleDocumentSectionEvent);
        };
    }, [documentPageId]);

    return { documentSections, navigationItems };
};
