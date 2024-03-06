/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { DispatchHandlerParameter } from '../../AppBridge';
import type { CommandRegistry } from './CommandRegistry';

export const navigateToDocumentSection = (
    sectionId: CommandRegistry['navigateToDocumentSection'],
): DispatchHandlerParameter<'navigateToDocumentSection', CommandRegistry> => ({
    name: 'navigateToDocumentSection',
    payload: sectionId,
});
