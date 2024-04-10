/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    type GuidelinesCoverPage,
    type GuidelinesDocument,
    type GuidelinesDocumentGroup,
    type GuidelinesDocumentLibrary,
    type GuidelinesDocumentLink,
} from './Guidelines';

export type NavigationTree = (
    | GuidelinesCoverPage
    | GuidelinesDocumentGroup
    | GuidelinesDocument
    | GuidelinesDocumentLibrary
    | GuidelinesDocumentLink
)[];

export type NavigationTreeClassTypes = (
    | GuidelinesCoverPage
    | GuidelinesDocumentGroup
    | GuidelinesDocument
    | GuidelinesDocumentLibrary
    | GuidelinesDocumentLink
)['type'];
