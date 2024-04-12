/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    type GuidelineCoverPage,
    type GuidelineDocument,
    type GuidelineDocumentGroup,
    type GuidelineDocumentLibrary,
    type GuidelineDocumentLink,
} from './Guideline';

export type NavigationTree = (
    | GuidelineCoverPage
    | GuidelineDocumentGroup
    | GuidelineDocument
    | GuidelineDocumentLibrary
    | GuidelineDocumentLink
)[];

export type NavigationTreeClassTypes = (
    | GuidelineCoverPage
    | GuidelineDocumentGroup
    | GuidelineDocument
    | GuidelineDocumentLibrary
    | GuidelineDocumentLink
)['type'];
