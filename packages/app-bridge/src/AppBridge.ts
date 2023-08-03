/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { Simplify } from 'type-fest';

type NameContextList = 'Command' | 'API Method' | 'Event';
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

type ApiVerb = 'get' | 'create' | 'update' | 'delete' | 'add' | 'remove' | 'set';
type ApiMethodNamePattern = { [apiMethod: `${ApiVerb}${string}`]: { payload: unknown; response: unknown } };
export type ApiMethodNameValidator<ApiMethodNameObject> = Simplify<
    ObjectNameValidator<ApiMethodNameObject, ApiMethodNamePattern, 'API Method'>
>;

type CommandVerb = 'open' | 'close' | 'navigate';
type CommandNamePattern = { [commandName: `${CommandVerb}${string}`]: unknown };
export type CommandNameValidator<CommandNameObject> = Simplify<
    ObjectNameValidator<CommandNameObject, CommandNamePattern, 'Command'>
>;

type ApiHandler<ApiMethodName extends keyof ApiMethodNamePattern> =
    ApiMethodNamePattern[ApiMethodName]['payload'] extends void
        ? { name: ApiMethodName }
        : { name: ApiMethodName; payload: ApiMethodNamePattern[ApiMethodName]['payload'] };

type ApiHandlerResponse<ApiMethodName extends keyof ApiMethodNamePattern> =
    ApiMethodNamePattern[ApiMethodName]['response'];

type DispatchHandler<CommandName extends keyof CommandNamePattern> = CommandNamePattern[CommandName] extends void
    ? { name: CommandName }
    : { name: CommandName; payload: CommandNamePattern[CommandName] };

export type ApiHandlerParameter<ApiMethodName> = ApiMethodName extends keyof ApiMethodNamePattern
    ? ApiHandler<ApiMethodName>
    : WrongNamePattern<ApiMethodName, 'API Method'>;

export type ApiReturn<ApiMethodName> = Promise<
    ApiMethodName extends keyof ApiMethodNamePattern ? ApiHandlerResponse<ApiMethodName> : void
>;

export type DispatchHandlerParameter<CommandName> = CommandName extends keyof CommandNamePattern
    ? DispatchHandler<CommandName>
    : WrongNamePattern<CommandName, 'Command'>;

export type StateReturn<State, Key> = Key extends keyof State
    ? {
          /**
           * Gets the current value of the state object at the given key.
           */
          get(): Readonly<State[Key]>;
          /**
           * Sets the value of the state object at the given key.
           * The operation replaces the entire reference.
           */
          set(nextState: State[Key]): void;
          /**
           * Subscribes to changes in the state object at the given key.
           */
          subscribe(
              callbackFunction: (nextState: State[Key], previousState: State[Key]) => void,
          ): EventUnsubscribeFunction;
      }
    : {
          /**
           * Gets the current value of the state object.
           */
          get(): Readonly<State>;
          /**
           * Sets the value of the state object.
           * The operation replaces the entire reference.
           */
          set(nextState: State): void;
          /**
           * Subscribes to changes in the state object.
           */
          subscribe(callbackFunction: (nextState: State, previousState: State) => void): EventUnsubscribeFunction;
      };

export type ContextReturn<Context, Key> = Key extends keyof Context
    ? {
          /**
           * Gets the current value of the context object at the given key.
           */
          get(): Readonly<Context[Key]>;
          /**
           * Subscribes to changes in the context object at the given key.
           */
          subscribe(
              callbackFunction: (nextContext: Context[Key], previousContext: Context[Key]) => void,
          ): EventUnsubscribeFunction;
      }
    : {
          /**
           * Gets the current value of the context object.
           */
          get(): Readonly<Context>;
          /**
           * Subscribes to changes in the context object.
           */
          subscribe(
              callbackFunction: (nextContext: Context, previousContext: Context) => void,
          ): EventUnsubscribeFunction;
      };

type EventVerb = 'chosen';
export type EventNamePattern = {
    [eventName: `State.${string}` | `Context.${string}` | `${string}${Capitalize<EventVerb>}`]: unknown;
};
export type EventNameValidator<EventNameObject> = Simplify<
    ObjectNameValidator<EventNameObject, EventNamePattern, 'Event'>
>;

export type StateAsEventName<State> = {
    [StateKey in keyof State as StateKey extends string ? `State.${StateKey}` : never]: [
        State[StateKey],
        State[StateKey],
    ];
};

export type ContextAsEventName<Context> = {
    [ContextKey in keyof Context as ContextKey extends string ? `Context.${ContextKey}` : never]: [
        Context[ContextKey],
        Context[ContextKey],
    ];
};

export type EventNameParameter<EventName> = EventName extends keyof EventNamePattern
    ? EventName
    : WrongNamePattern<EventName, 'Event'>;

export type EventCallbackParameter<EventName, Event> = EventName extends keyof Event
    ? Event[EventName] extends any[]
        ? (...eventReturn: Event[EventName]) => void
        : (eventReturn: Event[EventName]) => void
    : () => void;

export type EventUnsubscribeFunction = () => void;

export interface AppBridge<
    ApiMethod extends ApiMethodNamePattern,
    Command extends CommandNamePattern,
    State extends Record<string, Record<string, unknown>>,
    Context extends Record<string, unknown>,
    Event extends EventNamePattern,
> {
    api<ApiMethodName extends keyof ApiMethod>(
        apiHandler: ApiHandlerParameter<ApiMethodName>,
    ): ApiReturn<ApiMethodName>;

    dispatch<CommandName extends keyof Command>(dispatchHandler: DispatchHandlerParameter<CommandName>): Promise<void>;

    state(): StateReturn<State, void>;
    state(key: keyof State): StateReturn<State, keyof State>;
    state(key?: void | keyof State): unknown;

    context(): ContextReturn<Context, void>;
    context<Key extends keyof Context>(key: Key): ContextReturn<Context, Key>;
    context<Key extends keyof Context>(key?: void | Key): unknown;

    subscribe<EventName extends keyof Event>(
        eventName: EventNameParameter<EventName>,
        callback: EventCallbackParameter<EventName, Event>,
    ): EventUnsubscribeFunction;
}
