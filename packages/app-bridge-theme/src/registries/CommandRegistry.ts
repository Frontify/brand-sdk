/* (c) Copyright Frontify Ltd., all rights reserved. */

import {ObjectNameValidator} from '../types';
import {Simplify} from "type-fest";

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
