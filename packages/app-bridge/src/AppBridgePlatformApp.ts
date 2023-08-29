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
import type { ApiMethodRegistry } from './registries';
import { Topic } from './types';
import { ErrorMessageBus, IMessageBus, MessageBus } from './utilities/MessageBus';
import { PlatformAppContext } from './types/PlatformAppContext';
import { generateRandomString, notify, subscribe } from './utilities';
import { getQueryParameters } from './utilities/queryParams';
import { InitializationError } from './errors';

export type PlatformAppApiMethod = ApiMethodNameValidator<Pick<ApiMethodRegistry, 'getCurrentUser'>>;

export type CommandRegistry = CommandNameValidator<{
    openConnection: void;
}>;

export type PlatformAppCommand = CommandNameValidator<Pick<CommandRegistry, 'openConnection'>>;

export type PlatformAppState = {
    settings: Record<string, unknown>;
};

type InitializeEvent = {
    port: MessagePort;
};

export type PlatformAppEvent = EventNameValidator<
    StateAsEventName<PlatformAppState & { '*': PlatformAppState }> &
        ContextAsEventName<PlatformAppContext & { '*': PlatformAppContext }>
>;

export class AppBridgePlatformApp implements IAppBridgePlatformApp {
    private messageBus: IMessageBus = new ErrorMessageBus();
    private initialized: boolean = false;

    api<ApiMethodName extends keyof PlatformAppApiMethod>(
        apiHandler: ApiHandlerParameter<ApiMethodName, PlatformAppApiMethod>,
    ): ApiReturn<ApiMethodName, PlatformAppApiMethod> {
        return this.messageBus.post(apiHandler) as ApiReturn<ApiMethodName, PlatformAppApiMethod>;
    }

    async dispatch<CommandName extends keyof PlatformAppCommand>(
        dispatchHandler: DispatchHandlerParameter<CommandName, PlatformAppCommand>,
    ): Promise<void> {
        if (dispatchHandler.name === 'openConnection') {
            const { get } = this.context();

            if (get().token && !this.initialized) {
                const PUBSUB_CHECKSUM = generateRandomString();

                notify(Topic.Init, PUBSUB_CHECKSUM, { token: get().token });
                const { port } = await subscribe<InitializeEvent>(Topic.Init, PUBSUB_CHECKSUM);
                this.messageBus = new MessageBus(port);
                this.initialized = true;
                return Promise.resolve<void>(void 0);
            } else {
                throw new InitializationError();
            }
        }
        return Promise.resolve<void>(void 0);
    }

    context(): ContextReturn<PlatformAppContext, void>;
    context<Key extends keyof PlatformAppContext>(key: Key): ContextReturn<PlatformAppContext, Key>;
    context(key?: keyof PlatformAppContext | void): unknown;
    context(): ContextReturn<PlatformAppContext, void>;
    context<Key extends keyof PlatformAppContext>(key: Key): ContextReturn<PlatformAppContext, Key>;
    context(key?: keyof PlatformAppContext | void): unknown;
    context(): unknown {
        return {
            get: () => getQueryParameters(window.location.href),
        };
    }

    state(): StateReturn<PlatformAppState, void>;
    state<Key extends keyof PlatformAppState>(key: Key): StateReturn<PlatformAppState, Key>;
    state(key?: keyof PlatformAppState | void): unknown;
    state(): StateReturn<PlatformAppState, void>;
    state<Key extends keyof PlatformAppState>(key: Key): StateReturn<PlatformAppState, Key>;
    state(key?: keyof PlatformAppState | void): unknown {
        console.log(key);
        return undefined;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    subscribe<EventName extends keyof PlatformAppEvent>(
        eventName: EventNameParameter<EventName, PlatformAppEvent>,
        callback: EventCallbackParameter<EventName, PlatformAppEvent>,
    ): EventUnsubscribeFunction {
        console.log(eventName, callback);
        return () => void 0;
    }
}

export interface IAppBridgePlatformApp<
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

    state(key?: keyof State | void): unknown;

    context(): ContextReturn<Context, void>;

    context<Key extends keyof Context>(key: Key): ContextReturn<Context, Key>;

    context(key?: keyof Context | void): unknown;

    subscribe<EventName extends keyof Event>(
        eventName: EventNameParameter<EventName, Event>,
        callback: EventCallbackParameter<EventName, Event>,
    ): EventUnsubscribeFunction;
}
