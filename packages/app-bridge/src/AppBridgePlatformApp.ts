/* (c) Copyright Frontify Ltd., all rights reserved. */

import type {
    ApiHandlerParameter,
    ApiMethodNameValidator,
    ApiReturn,
    AppBridge,
    CommandNameValidator,
    ContextAsEventName,
    ContextReturn,
    DispatchHandlerParameter,
    EventCallbackParameter,
    EventNameParameter,
    EventNameValidator,
    EventUnsubscribeFunction,
    StateAsEventName,
    StateReturn,
} from './AppBridge';
import type { ApiMethodRegistry } from './registries/api/ApiMethodRegistry';

export type PlatformAppApiMethod = ApiMethodNameValidator<ApiMethodRegistry>;

export type PlatformAppCommand = CommandNameValidator<Record<never, never>>;

export type PlatformAppState = {
    settings: Record<string, unknown>;
};

export type PlatformAppContext = {
    marketplaceServiceAppId: string;
};

export type PlatformAppEvent = EventNameValidator<
    StateAsEventName<PlatformAppState & { '*': PlatformAppState }> &
        ContextAsEventName<PlatformAppContext & { '*': PlatformAppContext }>
>;

export interface AppBridgePlatformApp<
    State extends PlatformAppState = PlatformAppState,
    Context extends PlatformAppContext = PlatformAppContext,
    Event extends PlatformAppEvent = PlatformAppEvent,
> extends AppBridge<PlatformAppApiMethod, PlatformAppCommand, State, Context, Event> {
    api<ApiMethodName extends keyof PlatformAppApiMethod>(
        apiHandler: ApiHandlerParameter<ApiMethodName, PlatformAppApiMethod>,
    ): ApiReturn<ApiMethodName, PlatformAppApiMethod>;

    dispatch<CommandName extends keyof PlatformAppCommand>(
        dispatchHandler: DispatchHandlerParameter<CommandName, PlatformAppCommand>,
    ): Promise<void>;

    state(): StateReturn<State, void>;
    state<Key extends keyof State>(key: Key): StateReturn<State, Key>;
    state<Key extends keyof State>(key?: Key | void): unknown;

    context(): ContextReturn<Context, void>;
    context<Key extends keyof Context>(key: Key): ContextReturn<Context, Key>;
    context<Key extends keyof Context>(key?: Key | void): unknown;

    subscribe<EventName extends keyof Event>(
        eventName: EventNameParameter<EventName, Event>,
        callback: EventCallbackParameter<EventName, Event>,
    ): EventUnsubscribeFunction;
}
