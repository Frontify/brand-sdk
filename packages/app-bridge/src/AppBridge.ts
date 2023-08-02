/* (c) Copyright Frontify Ltd., all rights reserved. */

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
export type ApiMethodNameValidator<ApiMethodNameObject> = ObjectNameValidator<
    ApiMethodNameObject,
    ApiMethodNamePattern,
    'API Method'
>;

type CommandVerb = 'open' | 'close' | 'navigate';
type CommandNamePattern = { [commandName: `${CommandVerb}${string}`]: unknown };
export type CommandNameValidator<CommandNameObject> = ObjectNameValidator<
    CommandNameObject,
    CommandNamePattern,
    'Command'
>;

type EventVerb = 'chosen';
type EventNamePattern = { [eventName: `${string}${Capitalize<EventVerb>}`]: unknown };
export type EventNameValidator<EventNameObject> = ObjectNameValidator<EventNameObject, EventNamePattern, 'Event'>;

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

export type EventNameParameter<EventName> = EventName extends keyof EventNamePattern
    ? EventName
    : WrongNamePattern<EventName, 'Event'>;

export type EventCallbackParameter<EventName, Event> = EventName extends keyof Event
    ? (eventReturn: Event[EventName]) => void
    : () => void;

export type EventUnsubscribeFunction = () => void;

export type StateReturn<State, Key extends keyof State | void> = {
    get(): Key extends keyof State ? Readonly<State[Key]> : Readonly<State>;
    set(nextState: Key extends keyof State ? State[Key] : State): void;
    subscribe(fn: (nextState: State, previousState: State) => void): EventUnsubscribeFunction;
};

export type ContextReturn<Context> = {
    get(): Readonly<Context>;
    subscribe(fn: (nextState: Context, previousState: Context) => void): EventUnsubscribeFunction;
};

export interface AppBridge<
    ApiMethod extends ApiMethodNamePattern,
    Command extends CommandNamePattern,
    Event extends EventNamePattern,
    State extends Record<string, Record<string, unknown>>,
    Context extends Record<string, unknown>,
> {
    api<ApiMethodName extends keyof ApiMethod>(
        apiHandler: ApiHandlerParameter<ApiMethodName>,
    ): ApiReturn<ApiMethodName>;

    dispatch<CommandName extends keyof Command>(dispatchHandler: DispatchHandlerParameter<CommandName>): Promise<void>;
    subscribe<EventName extends keyof Event>(
        eventName: EventNameParameter<EventName>,
        callback: EventCallbackParameter<EventName, Event>,
    ): EventUnsubscribeFunction;

    state(key: keyof State | void): StateReturn<State, typeof key>;
    context(): ContextReturn<Context>;
}
