/* (c) Copyright Frontify Ltd., all rights reserved. */

type ApiVerb = 'get' | 'create' | 'update' | 'delete' | 'add' | 'remove' | 'set';
type ApiMethodsPattern = Record<`${ApiVerb}${string}`, { payload: unknown; response: unknown }>;

type Asset = {};
type OpenAssetChooserPayload = {};

type DispatchPayload = {
    openAssetChooser?: OpenAssetChooserPayload;
};

type ApiHandler<ApiMethodName extends keyof ApiMethodsPattern> =
    ApiMethodsPattern[ApiMethodName]['payload'] extends void
        ? { name: ApiMethodName }
        : { name: ApiMethodName; payload: ApiMethodsPattern[ApiMethodName]['payload'] };

type ApiHandlerResponse<ApiMethodName extends keyof ApiMethodsPattern> = ApiMethodsPattern[ApiMethodName]['response'];

type DispatchHandler<DispatchName extends keyof DispatchPayload> = DispatchPayload[DispatchName] extends void
    ? { name: DispatchName }
    : { name: DispatchName; payload: DispatchPayload[DispatchName] };

type UnsubscribeFunction = () => void;

type SubscriptionCallback = {
    assetsChosen?: (assets: Asset[]) => void;
};

// Should we enforce typing of StateResponse?
type StateResponse = {};
type ContextResponse = {};

type StateName = 'settings' | 'assets';

type State<StateResponse> = {
    get(): Readonly<StateResponse>;
    set(nextState: StateResponse): void;
    subscribe(fn: (nextState: StateResponse, previousState: StateResponse) => void): UnsubscribeFunction;
};

type Context<ContextResponse> = {
    get(): Readonly<ContextResponse>;
    subscribe(fn: (nextState: ContextResponse, previousState: ContextResponse) => void): UnsubscribeFunction;
};

export interface AppBridge<ApiMethods extends ApiMethodsPattern = ApiMethodsPattern> {
    api<ApiMethodName extends keyof ApiMethods>(
        apiHandler: ApiHandler<ApiMethodName>,
    ): Promise<ApiHandlerResponse<ApiMethodName>>;
    context(): Context<ContextResponse>;
    state(): Record<StateName, State<StateResponse>>;
    dispatch<DispatchName extends keyof DispatchPayload>(dispatchHandler: DispatchHandler<DispatchName>): Promise<void>;
    subscribe<SubscriptionName extends keyof SubscriptionCallback>(
        eventName: SubscriptionName,
        callback: SubscriptionCallback[SubscriptionName],
    ): UnsubscribeFunction;
}
