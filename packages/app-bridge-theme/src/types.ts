/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Simplify } from 'type-fest';

import { type CommandRegistry } from './commands/CommandRegistry';
import { type Context } from './types/Context';

type CommandVerb = 'open' | 'close' | 'navigate' | 'download';
type EventVerb = 'chosen';

type NameContextList = 'Command' | 'Event';
type WrongNamePattern<ApiMethodName, NameContext extends NameContextList> = ApiMethodName extends string
    ? `The following ${NameContext} do not match the naming pattern: ${ApiMethodName}`
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

type CommandNamePattern = { [commandName: `${CommandVerb}${string}`]: unknown };
export type CommandNameValidator<CommandNameObject> = Simplify<
    ObjectNameValidator<CommandNameObject, CommandNamePattern, 'Command'>
>;

export type Command = CommandNameValidator<
    Pick<CommandRegistry, 'openSearchDialog' | 'closeSearchDialog' | 'navigateToDocumentSection'>
>;

type EventNameValidator<EventNameObject> = Simplify<ObjectNameValidator<EventNameObject, EventNamePattern, 'Event'>>;

type ContextAsEventName<Context> = {
    [ContextKey in keyof Context as ContextKey extends string ? `Context.${ContextKey}` : never]: [
        Context[ContextKey],
        Context[ContextKey],
    ];
};

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

export type AppBridgeThemeEvent = EventNameValidator<ContextAsEventName<Context & { '*': Context }>>;

export type EventNamePattern = {
    [eventName: `Context.${string}` | `${string}${Capitalize<EventVerb>}`]: unknown;
};
export type EventNameParameter<
    EventName,
    EventNameParameter extends EventNamePattern,
> = EventName extends keyof EventNameParameter ? EventName : WrongNamePattern<EventName, 'Event'>;

export type EventCallbackParameter<EventName, AppBridgeThemeEvent> = EventName extends keyof AppBridgeThemeEvent
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      AppBridgeThemeEvent[EventName] extends any[]
        ? (...eventReturn: AppBridgeThemeEvent[EventName]) => void
        : (eventReturn: AppBridgeThemeEvent[EventName]) => void
    : () => void;

export type EventUnsubscribeFunction = () => void;

export type SubscribeMap<Event> = {
    [EventName in keyof Event as EventName]: Map<EventCallbackParameter<keyof Event, Event>, boolean>;
};
