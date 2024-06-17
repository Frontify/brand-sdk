/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    type Command,
    type DispatchHandlerParameter,
    type StateReturn,
    type ContextReturn,
    type Event,
    type EventNameParameter,
    type EventCallbackParameter,
    type EventUnsubscribeFunction,
    type State,
    type Context,
} from './types';
import { type GuidelineSearchResult } from './types/GuidelineSearchResult';

export interface AppBridgeTheme {
    dispatch<CommandName extends keyof Command>(
        dispatchHandler: DispatchHandlerParameter<CommandName, Command>,
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

    /**
     * Search in the current Guideline for a given query.
     * @param query - The query to search for.
     * @param order - The order in which the results should be returned. Defaults to 'relevance'.
     */
    searchInGuideline(query: string, order?: 'relevance' | 'newest' | 'oldest'): Promise<GuidelineSearchResult[]>;
}
