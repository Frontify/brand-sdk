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
import type { ApiMethodRegistry } from './AppBridgeApiMethodRegistry';
import type { CommandRegistry } from './AppBridgeCommandRegistry';
import type { EventRegistry } from './AppBridgeEventRegistry';

export type PlatformAppApiMethod = ApiMethodNameValidator<
    ApiMethodRegistry & {
        createPlatformAppSpecificApiMethod: { payload: void; response: void };
    }
>;

export type PlatformAppCommand = CommandNameValidator<
    CommandRegistry & {
        openPlatformAppSpecificCommand: string;
    }
>;

export type PlatformAppState = {
    settings: Record<string, unknown>;
    assets: Record<string, unknown>;
};

export type PlatformAppContext = {
    marketplaceServiceAppId: string;
};

export type PlatformAppEvent = EventNameValidator<
    Pick<EventRegistry, 'assetsChosen'> &
        StateAsEventName<PlatformAppState & { '*': PlatformAppState }> &
        ContextAsEventName<PlatformAppContext & { '*': PlatformAppContext }> & {
            platformAppSpecificEntityChosen: string;
        }
>;

export interface AppBridgePlatformApp<
    State extends PlatformAppState,
    Context extends PlatformAppContext,
    Event extends PlatformAppEvent,
> extends AppBridge<PlatformAppApiMethod, PlatformAppCommand, State, Context, Event> {
    api<ApiMethodName extends keyof PlatformAppApiMethod>(
        apiHandler: ApiHandlerParameter<ApiMethodName, PlatformAppApiMethod>,
    ): ApiReturn<ApiMethodName>;

    dispatch<CommandName extends keyof PlatformAppCommand>(
        dispatchHandler: DispatchHandlerParameter<CommandName>,
    ): Promise<void>;

    state(): StateReturn<State, void>;
    state<Key extends keyof State>(key: Key): StateReturn<State, Key>;
    state<Key extends keyof State>(key?: Key | void): unknown;

    context(): ContextReturn<Context, void>;
    context<Key extends keyof Context>(key: Key): ContextReturn<Context, Key>;
    context<Key extends keyof Context>(key?: Key | void): unknown;

    subscribe<EventName extends keyof Event>(
        eventName: EventNameParameter<EventName>,
        callback: EventCallbackParameter<EventName, Event>,
    ): EventUnsubscribeFunction;
}
