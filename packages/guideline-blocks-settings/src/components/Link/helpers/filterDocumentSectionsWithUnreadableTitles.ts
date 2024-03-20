/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DocumentSection } from '@frontify/app-bridge';

export const filterDocumentSectionsWithUnreadableTitles = (sections: DocumentSection[]) =>
    sections.filter((section) => !!section.title?.trim());
