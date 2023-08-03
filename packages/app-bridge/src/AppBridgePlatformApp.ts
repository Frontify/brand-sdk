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
    /**
     * Makes a request to the Frontify platform with the given API method name
     */
    api<ApiMethodName extends keyof PlatformAppApiMethod>(
        apiHandler: ApiHandlerParameter<ApiMethodName>,
    ): ApiReturn<ApiMethodName>;

    /**
     * Sends a command to the Frontify platform.
     *
     * @returns A promise that resolves to acknowledge the dispatch.
     * The event will be triggered at a later stage and can be subscribed to with {@link AppBridgePlatformApp.subscribe}.
     */
    dispatch<CommandName extends keyof PlatformAppCommand>(
        dispatchHandler: DispatchHandlerParameter<CommandName>,
    ): Promise<void>;

    /**
     * Subscribes to an event with the given name and callback function.
     * The event are fired from {@link AppBridgePlatformApp.dispatch}, {@link AppBridgePlatformApp.state} and {@link AppBridgePlatformApp.context}.
     *
     * @returns Function that can be used to unsubscribe from an event.
     * When called, this function will remove the subscription to the event and prevent any further callbacks from being executed.
     */
    subscribe<EventName extends keyof Event>(
        eventName: EventNameParameter<EventName>,
        callback: EventCallbackParameter<EventName, Event>,
    ): EventUnsubscribeFunction;

    /**
     * Returns a state utility object that can be used to get and set state values.
     *
     * @returns the state utility object.
     */
    state(): StateReturn<State, void>;
    /**
     * Returns a state utility object that can be used to get and set state values.
     *
     * @returns the state utility object focused on the given key is returned.
     */
    state<Key extends keyof State>(key: Key): StateReturn<State, Key>;
    state<Key extends keyof State>(key?: Key | void): unknown;

    /**
     * Returns a context utility object that can be used to get context values.
     *
     * @returns the context utility object.
     */
    context(): ContextReturn<Context, void>;
    /**
     * Returns a context utility object that can be used to get context values.
     *
     * @returns the context utility object focused on the given key is returned.
     */
    context<Key extends keyof Context>(key: Key): ContextReturn<Context, Key>;
    context<Key extends keyof Context>(key?: Key | void): unknown;
}
