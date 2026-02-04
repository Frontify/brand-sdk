/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Simplify } from 'type-fest';

import { type CommandVerb } from '../registries/verbs';

type NameContextList = 'Command';
type WrongNamePattern<CommandName, NameContext extends NameContextList> = CommandName extends string
    ? `The following ${NameContext} do not match the naming pattern: ${CommandName}`
    : never;

type ObjectNameValidator<
    NameObject,
    PatternObject,
    NameContext extends NameContextList,
> = keyof NameObject extends keyof PatternObject
    ? NameObject
    : WrongNamePattern<
          `${Exclude<Extract<keyof NameObject, string>, Extract<keyof PatternObject, string>>}`,
          NameContext
      >;

type PlatformAppCommandNamePattern = { [command: `${CommandVerb}${string}`]: { payload: unknown } };

export type PlatformAppCommandNameValidator<CommandNameObject> = Simplify<
    ObjectNameValidator<CommandNameObject, PlatformAppCommandNamePattern, 'Command'>
>;

type PlatformAppDispatchHandler<
    CommandName extends keyof PlatformAppCommandNamePattern,
    Command extends PlatformAppCommandNamePattern,
> = Command[CommandName]['payload'] extends void
    ? { name: CommandName; payload?: undefined }
    : { name: CommandName; payload: Command[CommandName]['payload'] };

export type PlatformAppDispatchHandlerParameter<
    CommandName,
    Command extends PlatformAppCommandNamePattern,
> = CommandName extends keyof PlatformAppCommandNamePattern
    ? PlatformAppDispatchHandler<CommandName, Command>
    : WrongNamePattern<CommandName, 'Command'>;
