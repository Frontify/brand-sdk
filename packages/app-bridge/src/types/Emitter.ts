/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type BlockSettingsUpdateEvent } from '../react/useBlockSettings';

import { type Template } from './Template';

export type EmitterEvents = {
    'AppBridge:BlockSettingsUpdated': BlockSettingsUpdateEvent;

    'AppBridge:BlockTemplatesUpdated': {
        blockId: number;
        blockTemplates: Record<string, Template[]>;
        prevBlockTemplates: Record<string, Template[]>;
    };
};
