/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type EventNameValidator } from '../types';
import { type Asset } from '../types/Asset';

export type EventRegistry = EventNameValidator<{
    assetsChosen: { assets: Asset[] };
}>;
