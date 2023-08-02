/* (c) Copyright Frontify Ltd., all rights reserved. */

import type {
    ApiHandlerParameter,
    ApiMethodNameValidator,
    ApiReturn,
    AppBridge,
    CommandNameValidator,
    ContextReturn,
    DispatchHandlerParameter,
    EventCallbackParameter,
    EventNameParameter,
    EventNameValidator,
    EventUnsubscribeFunction,
    StateReturn,
} from './AppBridge';
import type { ApiMethodRegistry } from './AppBridgeApiMethodRegistry';
import type { CommandRegistry } from './AppBridgeCommandRegistry';
import { EventRegistry } from './AppBridgeEventRegistry';

type ApiMethod = ApiMethodNameValidator<
    Pick<ApiMethodRegistry, 'createAsset' | 'createAttachment' | 'getCurrentUser'> & {
        createPlatformAppSpecificApiMethod: { payload: void; response: void };
    }
>;

type Command = CommandNameValidator<
    Pick<
        CommandRegistry,
        | 'closeAssetChooser'
        | 'closeTemplateChooser'
        | 'openAssetChooser'
        | 'openAssetViewer'
        | 'openNavigationManager'
        | 'openTemplateChooser'
    > & {
        openPlatformAppSpecificCommand: string;
    }
>;

type Event = EventNameValidator<
    Pick<EventRegistry, 'assetsChosen'> & {
        platformAppSpecificEntityChosen: string;
    }
>;

type StateDefault = {
    settings: Record<string, unknown>;
    assets: Record<string, unknown>;
};

export interface AppBridgePlaformApp<State extends StateDefault>
    extends AppBridge<ApiMethod, Command, Event, State, Context> {
    // private readonly subscribeMap: Record<string, Map<(eventReturn: unknown) => void, boolean>>;
    // private readonly localState: State;

    api<ApiMethodName extends keyof ApiMethod>(
        apiHandler: ApiHandlerParameter<ApiMethodName>,
    ): ApiReturn<ApiMethodName>;

    dispatch<CommandName extends keyof ExtendedCommand>(
        dispatchHandler: DispatchHandlerParameter<CommandName>,
    ): Promise<void>;

    subscribe<EventName extends keyof ExtendedEvent>(
        eventName: EventNameParameter<EventName>,
        callback: EventCallbackParameter<EventName, Event>,
    ): EventUnsubscribeFunction;

    state(key: keyof State | void): StateReturn<State, typeof key>;

    context(): ContextReturn<{
        marketplaceServiceAppId: string;
    }>;
}

/**
 * WEB APP
 */

type State = {
    settings: Record<string, unknown>;
    assets: Record<string, unknown>;
    // banana: Record<string, unknown>;
};

type Context = {
    marketplaceServiceAppId: string;
};

type ExtendedApiMethod = ApiMethodNameValidator<ApiMethod & { createPrivatedApiMethod: string }>;
type ExtendedCommand = CommandNameValidator<Command & { openPrivateCommand: string }>;
type ExtendedEvent = EventNameValidator<Event & { privateEntityChosen: string }>;

class AppBridgePlaformAppTODO implements AppBridgePlaformApp<State> {
    private readonly subscribeMap: Record<string, Map<(eventReturn: unknown) => void, boolean>> = {};
    private localState: State = Object.preventExtensions({
        settings: {},
        assets: {},
    });

    api<ApiMethodName extends keyof ExtendedApiMethod>(
        apiHandler: ApiHandlerParameter<ApiMethodName>,
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
        callback: EventCallbackParameter<EventName, Event>,
    ): EventUnsubscribeFunction {
        if (!(eventName in this.subscribeMap)) {
            this.subscribeMap[eventName] = new Map();
        }

        this.subscribeMap[eventName].set(callback, true);

        return () => {
            this.subscribeMap[eventName].delete(callback);
        };
    }

    state(key: keyof typeof this.localState | void): StateReturn<State, typeof key> {
        return {
            get: () => (key ? this.localState[key] : this.localState),
            // @TODO extract nextState type
            set: (
                nextState: typeof key extends infer Key
                    ? Key extends keyof typeof this.localState
                        ? (typeof this.localState)[Key]
                        : typeof this.localState
                    : typeof this.localState,
            ) => {
                if (key && key in this.localState) {
                    this.localState[key] = nextState;
                } else {
                    this.localState = nextState;
                }
            },
            subscribe: (callback: (nextState: State, previousState: State) => void) => {
                return this.subscribe(key ? `State.${key}` : 'State.*', callback);
            },
        };
    }

    context(): { get(): Readonly<{}>; subscribe(fn: (nextState: {}, previousState: {}) => void): () => void } {}
}

const abc = new AppBridgePlaformAppTODO();
const fn = abc.subscribe('assetsChosen', (assets) => {
    console.log(assets);
});

abc.state().set({ settings: {}, assets: {} });
abc.state('settings').get();
abc.state('settings').set({});
abc.state('assets').get();
fn();
