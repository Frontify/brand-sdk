/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type EventCallbackParameter } from './types/Event.ts';

type NameContextList = 'Command' | 'Event';
export type WrongNamePattern<ApiMethodName, NameContext extends NameContextList> = ApiMethodName extends string
    ? `The following ${NameContext} do not match the naming pattern: ${ApiMethodName}`
    : never;

export type ObjectNameValidator<
    NameObject,
    PatternObject,
    NameContext extends NameContextList,
> = keyof NameObject extends keyof PatternObject
    ? NameObject
    : WrongNamePattern<
          `${Exclude<Extract<keyof NameObject, string>, Extract<keyof PatternObject, string>>}`,
          NameContext
      >;

export type SubscribeMap<Event> = {
    [EventName in keyof Event as EventName]: Map<EventCallbackParameter<keyof Event, Event>, boolean>;
};
