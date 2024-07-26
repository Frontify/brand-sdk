/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { Emitter } from 'mitt';
import type { EmitterEvents, TerrificComponent, TerrificEvent } from './types';

declare global {
    interface Window {
        APPLICATION_CONFIG: {
            version: string;
            bugsnagKey: string | null;
        };
        application: {
            config: {
                context: {
                    project: {
                        id: number;
                        hub_id: number;
                    };
                };
            };
            connectors: {
                events: {
                    components: {
                        [key: string]: TerrificComponent;
                    };
                    notify: <T = Record<string, unknown>>(
                        something: null,
                        eventName: TerrificEvent,
                        options: T,
                    ) => void;
                    registerComponent: (component: { id: string }) => void;
                };
            };
            sandbox: {
                config: {
                    tpl: {
                        render: (templateName: string, props: Record<string, unknown>) => string;
                    };
                    context: {
                        project: {
                            id: number;
                        };
                        brand: {
                            id: number;
                        };
                        guideline: any;
                    };
                };
            };
        };
        blockSettings: Record<number, Record<string, unknown>>;
        emitter: Emitter<EmitterEvents>;
    }
}

declare namespace Cypress {
    interface AUTWindow {
        emitter: Emitter<EmitterEvents>;
    }
}

export {};
