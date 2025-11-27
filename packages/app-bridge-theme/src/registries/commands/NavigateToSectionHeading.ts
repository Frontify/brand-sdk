/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DispatchHandlerParameter } from '../../types';
import { type CommandRegistry } from '../CommandRegistry';

export const navigateToSectionHeading = (
    sectionId: CommandRegistry['navigateToSectionHeading'],
): DispatchHandlerParameter<'navigateToSectionHeading', CommandRegistry> => ({
    name: 'navigateToSectionHeading',
    payload: sectionId,
});
