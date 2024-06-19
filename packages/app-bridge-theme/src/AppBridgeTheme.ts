/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Command, type DispatchHandlerParameter } from './types/Command';
import { type ContextReturn, type Context } from './types/Context';
import {
    type AppBridgeThemeEvent,
    type EventCallbackParameter,
    type EventNameParameter,
    type EventUnsubscribeFunction,
} from './types/Event';
import { type GuidelineSearchResult } from './types/GuidelineSearchResult';

export interface AppBridgeTheme {
    dispatch<CommandName extends keyof Command>(
        dispatchHandler: DispatchHandlerParameter<CommandName, Command>,
    ): Promise<void>;

    context(): ContextReturn<Context, void>;
    context<Key extends keyof Context>(key: Key): ContextReturn<Context, Key>;
    context(key?: keyof Context | void): unknown;

    subscribe<EventName extends keyof AppBridgeThemeEvent>(
        eventName: EventNameParameter<EventName, AppBridgeThemeEvent>,
        callback: EventCallbackParameter<EventName, AppBridgeThemeEvent>,
    ): EventUnsubscribeFunction;

    /**
     * @deprecated
     * Search in the current Guideline for a given query.
     * @param query - The query to search for.
     * @param order - The order in which the results should be returned. Defaults to 'relevance'.
     */
    searchInGuideline(query: string, order?: 'relevance' | 'newest' | 'oldest'): Promise<GuidelineSearchResult[]>;
}
