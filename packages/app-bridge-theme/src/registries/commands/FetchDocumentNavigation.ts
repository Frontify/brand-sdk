/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DispatchHandlerParameter } from 'src/types/Command';

import { type CommandRegistry } from '../CommandRegistry';

export const fetchDocumentNavigation = (
    documentId: CommandRegistry['fetchDocumentNavigation'],
): DispatchHandlerParameter<'fetchDocumentNavigation', CommandRegistry> => ({
    name: 'fetchDocumentNavigation',
    payload: documentId,
});
