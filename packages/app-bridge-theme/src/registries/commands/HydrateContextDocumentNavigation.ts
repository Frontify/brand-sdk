/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DispatchHandlerParameter } from 'src/types/Command';

import { type CommandRegistry } from '../CommandRegistry';

export const hydrateContextDocumentNavigation = (
    documentId: CommandRegistry['hydrateContextDocumentNavigation'],
): DispatchHandlerParameter<'hydrateContextDocumentNavigation', CommandRegistry> => ({
    name: 'hydrateContextDocumentNavigation',
    payload: documentId,
});
