/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Simplify } from 'type-fest';

import { type ObjectNameValidator } from '../types';

export type CommandRegistry = CommandNameValidator<{
    openSearchDialog: string[];
    closeSearchDialog: void;
    navigate: string;
    navigateToDocumentSection: number | string;
}>;

type CommandNameValidator<CommandNameObject> = Simplify<
    ObjectNameValidator<CommandNameObject, CommandNamePattern, 'Command'>
>;

type CommandNamePattern = { [commandName: `${CommandVerb}${string}`]: unknown };

type CommandVerb = 'open' | 'close' | 'navigate' | 'download';
