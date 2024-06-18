/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Simplify } from 'type-fest';

import { type EventRegistry } from '../registries/EventRegistry';
import { type ObjectNameValidator, type WrongNamePattern } from '../types';

import { type Context } from './Context';

type EventVerb = 'chosen';

export type EventNameValidator<EventNameObject> = Simplify<
    ObjectNameValidator<EventNameObject, EventNamePattern, 'Event'>
>;

type ContextAsEventName<Context> = {
    [ContextKey in keyof Context as ContextKey extends string ? `Context.${ContextKey}` : never]: [
        Context[ContextKey],
        Context[ContextKey],
    ];
};

export type AppBridgeThemeEvent = EventNameValidator<
    Pick<EventRegistry, 'assetsChosen'> &
        ContextAsEventName<
            Context & {
                '*': Context;
            }
        >
>;

export type EventNamePattern = {
    [eventName: `Context.${string}` | `${string}${Capitalize<EventVerb>}`]: unknown;
};
export type EventNameParameter<
    EventName,
    EventNameParameter extends EventNamePattern,
> = EventName extends keyof EventNameParameter ? EventName : WrongNamePattern<EventName, 'Event'>;

export type EventCallbackParameter<EventName, AppBridgeThemeEvent> = EventName extends keyof AppBridgeThemeEvent
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      AppBridgeThemeEvent[EventName] extends any[]
        ? (...eventReturn: AppBridgeThemeEvent[EventName]) => void
        : (eventReturn: AppBridgeThemeEvent[EventName]) => void
    : () => void;

export type EventUnsubscribeFunction = () => void;
