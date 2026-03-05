/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DispatchHandlerParameter } from '../../types';
import { type CommandRegistry } from '../CommandRegistry';

export const openAiBrandAssistantDialog = (): DispatchHandlerParameter<
    'openAiBrandAssistantDialog',
    CommandRegistry
> => ({ name: 'openAiBrandAssistantDialog' });

/**
 * @deprecated This will be removed in version 2.0.0 of `@frontify/app-bridge-theme`
 * There won't be a replacement for this command.
 */
export const closeAiBrandAssistantDialog = (): DispatchHandlerParameter<
    'closeAiBrandAssistantDialog',
    CommandRegistry
> => ({ name: 'closeAiBrandAssistantDialog' });
