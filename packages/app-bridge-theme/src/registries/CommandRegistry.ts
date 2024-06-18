/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type CommandNameValidator } from '../types/Command.ts';

type OpenSearchDialog = void;
type CloseSearchDialog = void;
type NavigateToDocumentSection = number | string;

export type CommandRegistry = CommandNameValidator<{
    openSearchDialog: OpenSearchDialog;
    closeSearchDialog: CloseSearchDialog;
    navigateToDocumentSection: NavigateToDocumentSection;
}>;
