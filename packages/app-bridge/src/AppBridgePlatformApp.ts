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
    SubscribeMap,
} from './AppBridge';
import { Topic } from './types';
import { ErrorMessageBus, IMessageBus, MessageBus } from './utilities/MessageBus';
import { generateRandomString, notify, subscribe } from './utilities';
import { getQueryParameters } from './utilities/queryParams';
import type { ApiMethodRegistry } from './registries';
import { openConnection } from './registries';
import { InitializationError } from './errors';

export type PlatformAppApiMethod = ApiMethodNameValidator<
    Pick<ApiMethodRegistry, 'getCurrentUser' | 'getAssetResourceInformation' | 'createAsset'>
>;

export type PlatformAppCommandRegistry = CommandNameValidator<{
    openConnection: void;
}>;

export type PlatformAppCommand = CommandNameValidator<Pick<PlatformAppCommandRegistry, 'openConnection'>>;

export type PlatformAppState = {
    settings: Record<string, unknown>;
};

type InitializeEvent = {
    apiPort: MessagePort;
    statePort: MessagePort;
    context: PlatformAppContext;
    state: PlatformAppState;
};

type AppBaseProps = {
    token: string;
    marketplaceServiceAppId: string;
    connected: boolean;
};

export type PlatformAppContext = AppBaseProps &
    (
        | {
              assetId: string;
              brandId: string;
              domain: string;
              parentId: string;
              type: 'ASSET_ACTION';
          }
        | {
              brandId: string;
              domain: string;
              parentId: string;
              type: 'ASSET_CREATION';
          }
    );

export type PlatformAppEvent = EventNameValidator<
    StateAsEventName<PlatformAppState & { '*': PlatformAppState }> &
        ContextAsEventName<PlatformAppContext & { '*': PlatformAppContext }>
>;

export class AppBridgePlatformApp implements IAppBridgePlatformApp {
    private apiMessageBus: IMessageBus = new ErrorMessageBus();
    private stateMessageBus: IMessageBus = new ErrorMessageBus();
    private initialized: boolean = false;
    private localContext?: PlatformAppContext;
    private localState: PlatformAppState = { settings: {} };

    private readonly subscribeMap: SubscribeMap<PlatformAppEvent> = {
        'State.*': new Map(),
        'State.settings': new Map(),
        'Context.*': new Map(),
        'Context.marketplaceServiceAppId': new Map(),
        'Context.token': new Map(),
        'Context.assetId': new Map(),
        'Context.brandId': new Map(),
        'Context.parentId': new Map(),
        'Context.domain': new Map(),
        'Context.type': new Map(),
        'Context.connected': new Map(),
    };

    api<ApiMethodName extends keyof PlatformAppApiMethod>(
        apiHandler: ApiHandlerParameter<ApiMethodName, PlatformAppApiMethod>,
    ): ApiReturn<ApiMethodName, PlatformAppApiMethod> {
        return this.apiMessageBus.post({
            parameter: apiHandler,
        }) as ApiReturn<ApiMethodName, PlatformAppApiMethod>;
    }

    private guardForInitialization() {
        const initialContext = getQueryParameters(window.location.href);
        if (!initialContext.token) {
            throw new InitializationError();
        }
        return this.initialized;
    }

    async dispatch<CommandName extends keyof PlatformAppCommand>(
        dispatchHandler: DispatchHandlerParameter<CommandName, PlatformAppCommand>,
    ): Promise<void> {
        if (dispatchHandler.name === openConnection().name) {
            if (this.guardForInitialization()) {
                return;
            }

            const PUBSUB_CHECKSUM = generateRandomString();

            notify(Topic.Init, PUBSUB_CHECKSUM, {
                token: getQueryParameters(window.location.href).token,
                appBridgeVersion: 'v3',
            });

            subscribe<InitializeEvent>(Topic.Init, PUBSUB_CHECKSUM).then(({ statePort, apiPort, context, state }) => {
                this.apiMessageBus = new MessageBus(apiPort);
                this.stateMessageBus = new MessageBus(statePort);

                this.localContext = context;
                this.localState = state;
                this.initialized = true;

                this.callSubscribedTopic('Context.connected', [true, false]);
                this.callSubscribedTopic('Context.*', [this.localContext, this.localContext]);
                this.callSubscribedTopic('State.*', [this.localState, this.localState]);
            });
        }
    }

    context(key?: void): ContextReturn<PlatformAppContext, void>;
    context<Key extends keyof PlatformAppContext>(key?: Key): ContextReturn<PlatformAppContext, Key>;
    context<Key extends keyof PlatformAppContext>(key?: keyof PlatformAppContext | void): unknown {
        if (typeof key === 'undefined') {
            return {
                get: () => this.localContext,
                subscribe: (
                    callback: (nextContext: PlatformAppContext, previousContext: PlatformAppContext) => void,
                ) => {
                    return this.subscribe('Context.*', callback);
                },
            };
        }
        return {
            get: () => (this.localContext ? this.localContext[key] : {}),
            subscribe: (
                callback: (nextContext: PlatformAppContext[Key], previousContext: PlatformAppContext[Key]) => void,
            ) => {
                // @ts-expect-error typing is correct, but TS doesn't like it
                return this.subscribe(`Context.${key}`, callback);
            },
        };
    }

    private async setInternalState(state: Promise<PlatformAppState>): Promise<void> {
        const prevState = this.localState;
        this.localState = await state;
        this.callSubscribedTopic('State.*', [this.localState, prevState]);
    }

    state(): StateReturn<PlatformAppState, void>;
    state<Key extends keyof PlatformAppState>(key: Key): StateReturn<PlatformAppState, Key>;
    state<Key extends keyof PlatformAppState>(key?: keyof PlatformAppState | void): unknown {
        console.log('state update');
        if (typeof key === 'undefined') {
            console.log('state update');
            return {
                get: () => this.localState,
                set: (nextState: PlatformAppState) => {
                    const newState = this.stateMessageBus.post({
                        parameter: { nextState },
                    }) as Promise<PlatformAppState>;
                    this.setInternalState(newState);
                },
                subscribe: (callback: (nextState: PlatformAppState, previousState: PlatformAppState) => void) => {
                    return this.subscribe('State.*', callback);
                },
            };
        }

        return {
            get: () => this.localState[key],
            set: (nextState: PlatformAppState[Key]) => {
                const newState = this.stateMessageBus.post({
                    parameter: { nextState },
                }) as Promise<PlatformAppState>;
                this.setInternalState(newState);
            },
            subscribe: (callback: (nextState: PlatformAppState[Key], previousState: PlatformAppState[Key]) => void) => {
                return this.subscribe(`State.${key}`, callback);
            },
        };
    }

    subscribe<EventName extends keyof PlatformAppEvent>(
        eventName: EventNameParameter<EventName, PlatformAppEvent>,
        callback: EventCallbackParameter<EventName, PlatformAppEvent>,
    ): EventUnsubscribeFunction {
        if (!(eventName in this.subscribeMap)) {
            this.subscribeMap[eventName] = new Map();
        }

        this.subscribeMap[eventName].set(callback, true);

        return () => {
            this.subscribeMap[eventName].delete(callback);
        };
    }

    callSubscribedTopic<EventName extends keyof PlatformAppEvent>(
        eventName: EventNameParameter<EventName, PlatformAppEvent>,
        callbackParameters: PlatformAppEvent[EventName],
    ) {
        const callbackMap = this.subscribeMap[eventName];
        if (callbackMap && callbackMap?.size !== undefined) {
            for (const [callback] of callbackMap.entries()) {
                // @ts-expect-error if there are multiple parameters, we spread them in the callback call
                callback(...(Array.isArray(callbackParameters) ? callbackParameters : [callbackParameters]));
            }
        }
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
