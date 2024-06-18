/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Asset } from '../types/Asset';
import { type EventNameValidator } from '../types/Event';

export type EventRegistry = EventNameValidator<{
    assetsChosen: { assets: Asset[] };
}>;
