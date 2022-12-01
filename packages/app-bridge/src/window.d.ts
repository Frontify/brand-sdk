/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { BlockSettingsUpdateEvent } from './react';
import type {
    Asset,
    Color,
    ColorPalette,
    CoverPage,
    Document,
    DocumentGroup,
    DocumentPage,
    EmitterAction,
    TerrificComponent,
    TerrificEvent,
} from './types';

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
        emitter: Emitter<{
            'AppBridge:BlockSettingsUpdated': BlockSettingsUpdateEvent;
            'AppBridge:BlockAssetsUpdated': {
                blockId: number;
                blockAssets: Record<string, Asset[]>;
            };
            'AppBridge:ColorsUpdated': {
                blockId: number;
                colors: Color[];
            };
            'AppBridge:ColorPalettesUpdated': {
                blockId: number;
                colorPalettes: ColorPalette[];
            };
            'AppBridge:GuidelineDocumentUpdate': {
                document: Document | DocumentGroup;
                action: EmitterAction;
            };
            'AppBridge:GuidelineDocumentPageUpdate': {
                page: DocumentPage;
                action: EmitterAction;
            };
            'AppBridge:GuidelineCoverPageUpdate': {
                coverPage: CoverPage;
                action: EmitterAction;
            };
        }>;
    }
}

declare namespace Cypress {
    interface AUTWindow {
        emitter: Emitter;
    }
}

export {};
