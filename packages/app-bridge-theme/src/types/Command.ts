/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Simplify } from 'type-fest';

import { type CommandRegistry } from '../registries';

import { type ObjectNameValidator, type WrongNamePattern } from './Common';

type CommandVerb = 'open' | 'close' | 'navigate' | 'download';

type CommandNamePattern = { [commandName: `${CommandVerb}${string}`]: unknown };

export type CommandNameValidator<CommandNameObject> = Simplify<
    ObjectNameValidator<CommandNameObject, CommandNamePattern, 'Command'>
>;

type DispatchHandler<
    CommandName extends keyof CommandRegistry,
    TCommand extends CommandRegistry,
> = TCommand[CommandName] extends void ? { name: CommandName } : { name: CommandName; payload: TCommand[CommandName] };

export type DispatchHandlerParameter<
    CommandName,
    TCommand extends CommandRegistry,
> = CommandName extends keyof CommandRegistry
    ? DispatchHandler<CommandName, TCommand>
    : WrongNamePattern<CommandName, 'Command'>;
