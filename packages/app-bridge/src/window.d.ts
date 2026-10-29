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
        emitter: Emitter<EmitterEvents>;
    }
}

export {};
