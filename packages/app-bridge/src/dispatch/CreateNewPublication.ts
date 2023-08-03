/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { CreateNewPublicationOptions, DispatchHandler } from '../types';

export const createNewPublication = (
    options: CreateNewPublicationOptions,
): DispatchHandler<'createNewPublication'> => ({
    name: 'createNewPublication',
    payload: options,
});
