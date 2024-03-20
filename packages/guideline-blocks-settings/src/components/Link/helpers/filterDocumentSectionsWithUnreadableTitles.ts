/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DocumentSection } from '@frontify/app-bridge';
import { type DocumentSectionWithTitle } from '../types';

export const filterDocumentSectionsWithUnreadableTitles = (sections: DocumentSection[]) =>
    sections.filter((section) => !!section.title?.trim()) as DocumentSectionWithTitle[];
