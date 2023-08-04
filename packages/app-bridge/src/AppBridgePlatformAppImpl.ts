/* (c) Copyright Frontify Ltd., all rights reserved. */

import type {
    ApiMethodNameValidator,
    CommandNameValidator,
    EventNameValidator,
    ApiHandlerParameter,
    ApiReturn,
    DispatchHandlerParameter,
    EventNameParameter,
    EventCallbackParameter,
    EventUnsubscribeFunction,
    StateReturn,
    ContextReturn,
    ContextAsEventName,
    StateAsEventName,
    SubscribeMap,
} from './AppBridge';
import type {
    AppBridgePlatformApp,
    PlatformAppApiMethod,
    PlatformAppCommand,
    PlatformAppEvent,
    PlatformAppState,
    PlatformAppContext,
} from './AppBridgePlatformApp';

type ExtendedApiMethod = ApiMethodNameValidator<
    PlatformAppApiMethod & { createPrivatedApiMethod: { payload: void; response: void } }
>;
type ExtendedCommand = CommandNameValidator<PlatformAppCommand & { openPrivateCommand: void }>;
type ExtendedState = PlatformAppState & { privateStateValue: Record<string, { foo: 'bar' }> };
type ExtendedContext = PlatformAppContext & { privateContextValue: string };
type ExtendedEvent = EventNameValidator<
    PlatformAppEvent &
        StateAsEventName<ExtendedState & { '*': ExtendedState }> &
        ContextAsEventName<ExtendedContext & { '*': ExtendedContext }> & { privateEntityChosen: void }
>;



class AppBridgePlatformAppImpl implements AppBridgePlatformApp<ExtendedState, ExtendedContext, ExtendedEvent> {
    private readonly subscribeMap: SubscribeMap<ExtendedEvent> = {
        assetsChosen: new Map(),
        'State.*': new Map(),
        'State.assets': new Map(),
        'State.settings': new Map(),
        'State.privateStateValue': new Map(),
        'Context.*': new Map(),
        'Context.marketplaceServiceAppId': new Map(),
        'Context.privateContextValue': new Map(),
        privateEntityChosen: new Map(),
        platformAppSpecificEntityChosen: new Map(),
    };

    constructor(private localState: ExtendedState, private localContext: ExtendedContext) {}

    api<ApiMethodName extends keyof ExtendedApiMethod>(
        apiHandler: ApiHandlerParameter<ApiMethodName, ExtendedApiMethod>,
    ): ApiReturn<ApiMethodName> {
        switch (apiHandler.name) {
            // Global to Bridges
            case 'createAsset':
                return {} as ApiReturn<ApiMethodName>;

            case 'createAttachment':
                return {} as ApiReturn<ApiMethodName>;

            case 'getCurrentUser':
                return {} as ApiReturn<ApiMethodName>;

            // Specific to Bridge
            case 'createPlatformAppSpecificApiMethod':
                return {} as ApiReturn<ApiMethodName>;

            // Private
            case 'createPrivatedApiMethod':
                return {} as ApiReturn<ApiMethodName>;
        }
    }

    dispatch<CommandName extends keyof ExtendedCommand>(
        dispatchHandler: DispatchHandlerParameter<CommandName>,
    ): Promise<void> {
        switch (dispatchHandler.name) {
            // Global to Bridges
            case 'closeAssetChooser':
                return {} as Promise<void>;

            case 'closeTemplateChooser':
                return {} as Promise<void>;

            case 'openAssetChooser':
                return {} as Promise<void>;

            case 'openAssetViewer':
                return {} as Promise<void>;

            case 'openNavigationManager':
                return {} as Promise<void>;

            case 'openTemplateChooser':
                return {} as Promise<void>;

            // Specific to Bridge
            case 'openPlatformAppSpecificCommand':
                return {} as Promise<void>;

            // Private
            case 'openPrivateCommand':
                return {} as Promise<void>;
        }
    }

    subscribe<EventName extends keyof ExtendedEvent>(
        eventName: EventNameParameter<EventName>,
        callback: EventCallbackParameter<EventName, ExtendedEvent>,
    ): EventUnsubscribeFunction {
        if (!(eventName in this.subscribeMap)) {
            this.subscribeMap[eventName] = new Map();
        }

        this.subscribeMap[eventName].set(callback, true);

        return () => {
            this.subscribeMap[eventName].delete(callback);
        };
    }

    state(): StateReturn<ExtendedState, void>;
    state<Key extends keyof ExtendedState>(key: Key): StateReturn<ExtendedState, Key>;
    state<Key extends keyof ExtendedState>(key?: Key | void): unknown {
        if (typeof key === 'undefined') {
            return {
                get: () => this.localState,
                set: (nextState: ExtendedState) => (this.localState = nextState),
                subscribe: (callback: (nextState: ExtendedState, previousState: ExtendedState) => void) => {
                    return this.subscribe('State.*', callback);
                },
            };
        }

        return {
            get: () => this.localState[key],
            set: (nextState: ExtendedState[Key]) => (this.localState[key] = nextState),
            subscribe: (callback: (nextState: ExtendedState[Key], previousState: ExtendedState[Key]) => void) => {
                return this.subscribe(`State.${key satisfies keyof ExtendedState}`, callback);
            },
        };
    }

    context(key?: void): ContextReturn<ExtendedContext, void>;
    context<Key extends keyof ExtendedContext>(key?: Key): ContextReturn<ExtendedContext, Key>;
    context<Key extends keyof ExtendedContext>(key?: Key | void): unknown {
        if (typeof key === 'undefined') {
            return {
                get: () => this.localContext,
                subscribe: (callback: (nextContext: ExtendedContext, previousContext: ExtendedContext) => void) => {
                    return this.subscribe('Context.*', callback);
                },
            };
        }

        return {
            get: () => this.localContext[key],
            subscribe: (
                callback: (nextContext: ExtendedContext[Key], previousContext: ExtendedContext[Key]) => void,
            ) => {
                return this.subscribe(`Context.${key satisfies keyof ExtendedContext}`, callback);
            },
        };
    }
}

const bridge = new AppBridgePlatformAppImpl(
    { settings: {}, assets: {}, privateStateValue: {} },
    { marketplaceServiceAppId: '123', privateContextValue: 'abc' },
);

bridge.api({ name: 'getCurrentUser' });
bridge.api({ name: 'createAsset', payload: { name: 'foo' } });

const subscribe1 = bridge.subscribe('assetsChosen', (assets) => {
    console.log(assets);
});
const subscribe2 = bridge.subscribe('privateEntityChosen', () => {
    console.log();
});
const subscribe3 = bridge.subscribe('Context.marketplaceServiceAppId', (data) => {
    console.log(data);
});
const subscribe4 = bridge.subscribe('State.assets', (data) => {
    console.log(data);
});

subscribe1();
subscribe2();
subscribe3();
subscribe4();

const state = bridge.state().get();
const stateSettings = bridge.state('settings').get();
const statePrivateStateValue = bridge.state('privateStateValue').get();
bridge.state().set({ settings: {}, assets: {}, privateStateValue: { test: { foo: 'bar' } } });
bridge.state('privateStateValue').set({ test: { foo: 'bar' } });
bridge.state().subscribe((after, before) => {});
bridge.state('privateStateValue').subscribe((after, before) => {});

const context = bridge.context().get();
const contextMarketplace = bridge.context('marketplaceServiceAppId').get();
bridge.context().subscribe((after, before) => {});
bridge.context('marketplaceServiceAppId').subscribe((after, before) => {});
