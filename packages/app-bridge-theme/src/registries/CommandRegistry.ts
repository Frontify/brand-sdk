/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type CommandNameValidator } from '../types';

export type CommandRegistry = CommandNameValidator<{
    openSearchDialog: string[];
    closeSearchDialog: void;
    navigate: string;
    navigateToDocumentSection: number | string;
}>;
