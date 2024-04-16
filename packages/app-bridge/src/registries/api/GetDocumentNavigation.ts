/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DocumentNavigationItem, type GuidelineDocument } from '../../types/Guideline';

export type GetDocumentNavigationPayload = {
    document: GuidelineDocument;
};

export type GetDocumentNavigationResponse = DocumentNavigationItem[];

export const getDocumentNavigation = (
    payload: GetDocumentNavigationPayload,
): { name: 'getDocumentNavigation'; payload: GetDocumentNavigationPayload } => ({
    name: 'getDocumentNavigation',
    payload,
});
