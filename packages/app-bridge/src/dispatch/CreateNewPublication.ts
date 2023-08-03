/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { DispatchHandler } from '../types';
import { CreateNewPublicationOptions } from '../types';

export const createNewPublication = (
    options: CreateNewPublicationOptions,
): DispatchHandler<'createNewPublication'> => ({
    name: 'createNewPublication',
    payload: options,
});
