/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type EventUnsubscribeFunction } from './Event.ts';

export type State = {
    /**
     * The total height of any sticky elements at the top of the document in pixels.
     */
    scrollTopOffset: number;
};

export type StateReturn<State, Key> = Key extends keyof State
    ? {
          /**
           * Gets the current value of the state object at the given key.
           */
          get(): Readonly<State[Key]>;
          /**
           * Sets a new value of the state object at the given key.
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
           * Sets a new value of the state object.
           */
          set(nextState: State): void;
          /**
           * Subscribes to changes in the state object.
           */
          subscribe(callbackFunction: (nextState: State, previousState: State) => void): EventUnsubscribeFunction;
      };
