/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { EventNameValidator } from '../../AppBridge';
import type { Asset } from '../../types';

export type EventRegistry = EventNameValidator<{
    assetsChosen: { assets: Asset[] };
}>;
