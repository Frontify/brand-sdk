/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    type CommandNameValidator,
    type ContextAsEventName,
    type ContextReturn,
    type DispatchHandlerParameter,
    type EventCallbackParameter,
    type EventNameParameter,
    type EventNameValidator,
    type EventUnsubscribeFunction,
    type StateAsEventName,
    type StateReturn,
    type SubscribeMap,
} from '@frontify/app-bridge';

import { InitializationError } from './errors';
import { type ApiMethodRegistry } from './registries';
import { openConnection } from './registries/commands.ts';
import {
    type PlatformAppApiHandlerParameter,
    type PlatformAppApiMethodNameValidator,
    type PlatformAppApiReturn,
} from './types';
import { Topic } from './types/Topic';
import { generateRandomString, notify, subscribe } from './utilities';
import { ErrorMessageBus, type IMessageBus, MessageBus } from './utilities/MessageBus';
import { getQueryParameters } from './utilities/queryParams';

export type PlatformAppApiMethod = PlatformAppApiMethodNameValidator<
    Pick<
        ApiMethodRegistry,
        | 'getCurrentUser'
        | 'getAssetResourceInformation'
        | 'createAsset'
        | 'getSecureRequest'
        | 'getAccountId'
        | 'executeGraphQl'
        | 'executeSecureRequest'
    >
>;

export type PlatformAppCommandRegistry = CommandNameValidator<{
    openConnection: void;
}>;

export type PlatformAppCommand = CommandNameValidator<Pick<PlatformAppCommandRegistry, 'openConnection'>>;

export type PlatformAppState = {
    settings: Record<string, unknown>;
    userState: Record<string, unknown>;
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
    brandId: number;
    domain: string;
};

export type AssetBulkActionsContext = {
    surface: 'assetBulkActions';
    selection: { assets: { ids: string[] }; folders: { ids: string[] } };
    parentId: string;
    rootId: string;
} & AppBaseProps;

export type ThemeActionContext = {
    surface: 'themeAction';
    portalId: string;
    projectId: string;
} & AppBaseProps;

export type AssetViewerContext = {
    surface: 'assetViewer';
    assetId: string;
} & AppBaseProps;

export type AssetActionContext = {
    surface: 'assetAction';
    assetId: string;
    parentId: string;
    rootId: string;
} & AppBaseProps;

export type AssetCreationContext = {
    surface: 'assetCreation';
    parentId: string;
    rootId: string;
} & AppBaseProps;

export type PlatformAppContext =
    | AssetActionContext
    | AssetCreationContext
    | AssetViewerContext
    | ThemeActionContext
    | AssetBulkActionsContext;

export type PlatformAppEvent = EventNameValidator<
    StateAsEventName<PlatformAppState & { '*': PlatformAppState }> &
        ContextAsEventName<PlatformAppContext & { '*': PlatformAppContext }>
>;

export class AppBridgePlatformApp {
    private apiMessageBus: IMessageBus = new ErrorMessageBus();
    private statePort: MessagePort | undefined;
    private initialized: boolean = false;
    private localContext?: PlatformAppContext;
    private localState: PlatformAppState = { settings: {}, userState: {} };
    private maxRetries: number = 5;

    private readonly subscribeMap: SubscribeMap<PlatformAppEvent> = {
        'State.*': new Map(),
        'State.settings': new Map(),
        'State.userState': new Map(),
        'Context.*': new Map(),
        'Context.marketplaceServiceAppId': new Map(),
        'Context.token': new Map(),
        'Context.assetId': new Map(),
        'Context.brandId': new Map(),
        'Context.parentId': new Map(),
        'Context.rootId': new Map(),
        'Context.domain': new Map(),
        'Context.surface': new Map(),
        'Context.connected': new Map(),
    };

    constructor() {
        if (window.appBridgePlatformApp) {
            return window.appBridgePlatformApp;
        }

        window.appBridgePlatformApp = this;
    }

    api<ApiMethodName extends keyof PlatformAppApiMethod>(
        apiHandler: PlatformAppApiHandlerParameter<ApiMethodName, PlatformAppApiMethod>,
    ): PlatformAppApiReturn<ApiMethodName, PlatformAppApiMethod> {
        return this.apiMessageBus.post({
            parameter: apiHandler,
        }) as PlatformAppApiReturn<ApiMethodName, PlatformAppApiMethod>;
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

            const checksum = generateRandomString();

            notify(Topic.Init, checksum, {
                token: getQueryParameters(window.location.href).token,
                appBridgeVersion: 'v4',
            });

            await this.attemptSubscription(1, checksum);
        }
    }

    private async attemptSubscription(attempt: number, checksum: string): Promise<void> {
        try {
            const { statePort, apiPort, context, state } = await subscribe<InitializeEvent>(Topic.Init, checksum);

            this.apiMessageBus = new MessageBus(apiPort);

            this.statePort = statePort;
            this.statePort.onmessage = (event: MessageEvent<{ message: PlatformAppState }>) => {
                this.onStateChangeListener(event);
            };

            this.localContext = context;
            this.localState = state;
            this.initialized = true;

            this.callSubscribedTopic('Context.connected', [true, false]);
            this.callSubscribedTopic('Context.*', [this.localContext, this.localContext]);
            this.callSubscribedTopic('State.*', [this.localState, this.localState]);
        } catch (error) {
            if (attempt < this.maxRetries) {
                await this.attemptSubscription(attempt + 1, checksum);
            } else {
                console.error('Could not connect to the platform.');
            }
        }
    }

    context(key?: void): ContextReturn<PlatformAppContext, void>;
    context<Key extends keyof PlatformAppContext>(key?: Key): ContextReturn<PlatformAppContext, Key>;
    context(key?: keyof PlatformAppContext | void): unknown {
        if (typeof key === 'undefined') {
            return {
                get: () => this.localContext,
            };
        }
        return {
            get: () => (this.localContext ? this.localContext[key] : {}),
        };
    }

    state(): StateReturn<PlatformAppState, void>;
    state<Key extends keyof PlatformAppState>(key: Key): StateReturn<PlatformAppState, Key>;
    state<Key extends keyof PlatformAppState>(key?: keyof PlatformAppState | void): unknown {
        if (typeof key === 'undefined') {
            return {
                get: () => this.localState,
                set: (nextState: PlatformAppState) => {
                    if (this.statePort) {
                        this.statePort.postMessage({
                            message: {
                                parameter: { nextState },
                            },
                            token: 'state',
                        });
                    }
                },
                subscribe: (callback: (nextState: PlatformAppState, previousState: PlatformAppState) => void) => {
                    return this.subscribe('State.*', callback);
                },
            };
        }

        return {
            get: () => this.localState[key],
            set: (nextState: PlatformAppState[Key]) => {
                if (this.statePort) {
                    this.statePort.postMessage({
                        message: {
                            parameter: { key, nextState },
                        },
                        token: 'state',
                    });
                }
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

        // @ts-expect-error callback complexity
        this.subscribeMap[eventName].set(callback, true);

        return () => {
            // @ts-expect-error callback complexity
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

    private onStateChangeListener(event: MessageEvent<{ message: PlatformAppState; key?: 'settings' | 'userState' }>) {
        const { message, key } = event.data;

        if (!key) {
            this.callSubscribedTopic('State.*', [message, this.localState]);
        } else {
            this.callSubscribedTopic(`State.${key}`, [message[key], this.localState[key]]);
        }
        this.localState = message;
    }
}
