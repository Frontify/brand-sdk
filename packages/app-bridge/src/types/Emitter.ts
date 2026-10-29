/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Template } from './Template';

export type EmitterEvents = {
    'AppBridge:BlockTemplatesUpdated': {
        blockId: number;
        blockTemplates: Record<string, Template[]>;
        prevBlockTemplates: Record<string, Template[]>;
    };
};
