/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type CommandNameValidator } from '../types';

type OpenSearchDialog = void;
type CloseSearchDialog = void;
type NavigateToDocumentSection = number | string;

export type CommandRegistry = CommandNameValidator<{
    openSearchDialog: OpenSearchDialog;
    closeSearchDialog: CloseSearchDialog;
    navigateToDocumentSection: NavigateToDocumentSection;
}>;
