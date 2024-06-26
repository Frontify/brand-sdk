/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type EventNameValidator } from '../../AppBridge';
import { type Asset, type TemplateLegacy } from '../../types';

export type EventRegistry = EventNameValidator<{
    assetsChosen: { assets: Asset[] };
    templateChosen: { template: TemplateLegacy };
}>;
