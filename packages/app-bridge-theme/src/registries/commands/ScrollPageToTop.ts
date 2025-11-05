/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DispatchHandlerParameter } from '../../types';
import { type CommandRegistry } from '../CommandRegistry';

export const scrollPageToTop = (): DispatchHandlerParameter<'scrollPageToTop', CommandRegistry> => ({
    name: 'scrollPageToTop',
});
