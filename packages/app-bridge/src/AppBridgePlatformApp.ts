/* (c) Copyright Frontify Ltd., all rights reserved. */

import type {
    AppBridge,
    ApiMethodNameValidator,
    CommandNameValidator,
    ApiHandlerParameter,
    ApiReturn,
    DispatchHandlerParameter,
    EventNameValidator,
    EventNameParameter,
    EventCallbackParameter,
    EventUnsubscribeFunction,
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

type State = {
    settings: Record<string, unknown>;
    assets: Record<string, unknown>;
};

type Context = {
    marketplaceServiceAppId: string;
};

export interface AppBridgePlaformApp extends AppBridge<ApiMethod, Command, Event, State, Context> {
    api<ApiMethodName extends keyof ApiMethod>(
        apiHandler: ApiHandlerParameter<ApiMethodName>,
    ): ApiReturn<ApiMethodName>;

    dispatch<CommandName extends keyof ExtendedCommand>(
        dispatchHandler: DispatchHandlerParameter<CommandName>,
    ): Promise<void>;
}

/**
 * WEB APP
 */

type ExtendedApiMethod = ApiMethodNameValidator<ApiMethod & { createPrivatedApiMethod: string }>;
type ExtendedCommand = CommandNameValidator<Command & { openPrivateCommand: string }>;
type ExtendedEvent = EventNameValidator<Event & { privateEntityChosen: string }>;

class AppBridgePlaformAppTODO implements AppBridgePlaformApp {
    private readonly subscribeMap: Record<string, Map<(eventReturn: unknwon) => void, boolean>> = {};

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

    state(): Record<
        'settings' | 'assets',
        {
            get(): Readonly<{}>;
            set(nextState: {}): void;
            subscribe(fn: (nextState: {}, previousState: {}) => void): () => void;
        }
    > {}

    context(): { get(): Readonly<{}>; subscribe(fn: (nextState: {}, previousState: {}) => void): () => void } {}
}

const abc = new AppBridgePlaformAppTODO();
const fn = abc.subscribe('assetsChosen', (assets) => {
    console.log(assets);
});

fn();
