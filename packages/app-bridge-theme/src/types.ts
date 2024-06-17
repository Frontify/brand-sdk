/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Simplify } from 'type-fest';

import { type CommandRegistry } from './commands/CommandRegistry';
import {
    type GuidelineCoverPage,
    type GuidelineDocument,
    type GuidelineDocumentLibrary,
    type GuidelineDocumentPage,
} from './types/Guideline';
import { type Language } from './types/Language';
import { type ThemeTemplate } from './types/ThemeTemplate';

export type TemplateContext = { templateId: string; type: ThemeTemplate } & (
    | { type: 'documentPage'; document: GuidelineDocument; documentPage: GuidelineDocumentPage }
    | { type: 'library'; document: GuidelineDocumentLibrary }
    | { type: 'cover'; coverPage: GuidelineCoverPage }
);

export type State = {
    settings: Record<string, unknown>;
};

export type Context = {
    brandId: number;
    projectId: number;
    portalId: number;
    portalToken: string | null;
    currentLanguage: string;
    defaultLanguage: string;
    isEditing: boolean;
    isPublicLink: boolean;
    isAuthenticated: boolean;
    isSearchDialogOpen: boolean;
    languages: Language[];
    template: TemplateContext | null;
};

export type CommandVerb = 'open' | 'close' | 'navigate' | 'download';
export type EventVerb = 'chosen';

type NameContextList = 'Command' | 'API Method' | 'Event';
export type WrongNamePattern<ApiMethodName, NameContext extends NameContextList> = ApiMethodName extends string
    ? `The following ${NameContext} do not match the naming pattern: ${ApiMethodName}`
    : never;

type ObjectNameValidator<
    NameObject,
    PatternObject,
    NameContext extends NameContextList,
> = keyof NameObject extends keyof PatternObject
    ? NameObject
    : WrongNamePattern<
          `${Exclude<Extract<keyof NameObject, string>, Extract<keyof PatternObject, string>>}`,
          NameContext
      >;

export type CommandNamePattern = { [commandName: `${CommandVerb}${string}`]: unknown };
export type CommandNameValidator<CommandNameObject> = Simplify<
    ObjectNameValidator<CommandNameObject, CommandNamePattern, 'Command'>
>;

export type Command = CommandNameValidator<
    Pick<CommandRegistry, 'openSearchDialog' | 'closeSearchDialog' | 'navigateToDocumentSection'>
>;

export type EventNameValidator<EventNameObject> = Simplify<
    ObjectNameValidator<EventNameObject, EventNamePattern, 'Event'>
>;

export type StateAsEventName<State> = {
    [StateKey in keyof State as StateKey extends string ? `State.${StateKey}` : never]: [
        State[StateKey],
        State[StateKey],
    ];
};

export type ContextAsEventName<Context> = {
    [ContextKey in keyof Context as ContextKey extends string ? `Context.${ContextKey}` : never]: [
        Context[ContextKey],
        Context[ContextKey],
    ];
};

type DispatchHandler<
    CommandName extends keyof CommandNamePattern,
    Command extends CommandNamePattern,
> = Command[CommandName] extends void ? { name: CommandName } : { name: CommandName; payload: Command[CommandName] };

export type DispatchHandlerParameter<
    CommandName,
    Command extends CommandNamePattern,
> = CommandName extends keyof CommandNamePattern
    ? DispatchHandler<CommandName, Command>
    : WrongNamePattern<CommandName, 'Command'>;

export type Event = EventNameValidator<
    StateAsEventName<State & { '*': State }> & ContextAsEventName<Context & { '*': Context }>
>;

export type EventNamePattern = {
    [eventName: `State.${string}` | `Context.${string}` | `${string}${Capitalize<EventVerb>}`]: unknown;
};
export type EventNameParameter<
    EventName,
    EventNameParameter extends EventNamePattern,
> = EventName extends keyof EventNameParameter ? EventName : WrongNamePattern<EventName, 'Event'>;

export type EventCallbackParameter<EventName, Event> = EventName extends keyof Event
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Event[EventName] extends any[]
        ? (...eventReturn: Event[EventName]) => void
        : (eventReturn: Event[EventName]) => void
    : () => void;

export type EventUnsubscribeFunction = () => void;

export type StateReturn<State, Key> = Key extends keyof State
    ? {
          /**
           * Gets the current value of the state object at the given key.
           */
          get(): Readonly<State[Key]>;
          /**
           * Sets the value of the state object at the given key.
           * The operation replaces the entire reference.
           */
          set(nextState: State[Key]): void;
          /**
           * Subscribes to changes in the state object at the given key.
           */
          subscribe(
              callbackFunction: (nextState: State[Key], previousState: State[Key]) => void,
          ): EventUnsubscribeFunction;
      }
    : {
          /**
           * Gets the current value of the state object.
           */
          get(): Readonly<State>;
          /**
           * Sets the value of the state object.
           * The operation replaces the entire reference.
           */
          set(nextState: State): void;
          /**
           * Subscribes to changes in the state object.
           */
          subscribe(callbackFunction: (nextState: State, previousState: State) => void): EventUnsubscribeFunction;
      };

export type ContextReturn<Context, Key> = Key extends keyof Context
    ? {
          /**
           * Gets the current value of the context object at the given key.
           */
          get(): Readonly<Context[Key]>;
          /**
           * Subscribes to changes in the context object at the given key.
           */
          subscribe(
              callbackFunction: (nextContext: Context[Key], previousContext: Context[Key]) => void,
          ): EventUnsubscribeFunction;
      }
    : {
          /**
           * Gets the current value of the context object.
           */
          get(): Readonly<Context>;
          /**
           * Subscribes to changes in the context object.
           */
          subscribe(
              callbackFunction: (nextContext: Context, previousContext: Context) => void,
          ): EventUnsubscribeFunction;
      };
