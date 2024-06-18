/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Simplify } from 'type-fest';

import { type CommandRegistry } from '../commands';
import { type ObjectNameValidator, type WrongNamePattern } from '../types.ts';

type CommandVerb = 'open' | 'close' | 'navigate' | 'download';

type CommandNamePattern = { [commandName: `${CommandVerb}${string}`]: unknown };

export type CommandNameValidator<CommandNameObject> = Simplify<
    ObjectNameValidator<CommandNameObject, CommandNamePattern, 'Command'>
>;

export type Command = CommandNameValidator<
    Pick<CommandRegistry, 'openSearchDialog' | 'closeSearchDialog' | 'navigateToDocumentSection'>
>;

type DispatchHandler<
    CommandName extends keyof CommandNamePattern,
    Command extends CommandNamePattern,
> = Command[CommandName] extends void ? { name: CommandName } : { name: CommandName; payload: Command[CommandName] };

export type DispatchHandlerParameter<
    CommandName,
    Command extends CommandNamePattern,
> = CommandName extends keyof CommandNamePattern
    ? DispatchHandler<CommandName, Command>
    : WrongNamePattern<CommandName, 'Command'>;
