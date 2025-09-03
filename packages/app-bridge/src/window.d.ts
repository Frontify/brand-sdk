/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Emitter } from 'mitt';

import { type EmitterEvents } from './types';

declare global {
    interface Window {
        application: {
            sandbox: {
                config: {
                    context: {
                        project: {
                            id: number;
                        };
                    };
                };
            };
        };
        blockSettings: Record<number, Record<string, unknown>>;
        emitter: Emitter<EmitterEvents>;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace Cypress {
    interface AUTWindow {
        emitter: Emitter<EmitterEvents>;
    }
}

export {};
