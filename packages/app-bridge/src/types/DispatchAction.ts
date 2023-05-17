/* (c) Copyright Frontify Ltd., all rights reserved. */

export type DispatchAction =
    | 'GetProjectId'
    | 'GetEditorState'
    | 'GetTranslationLanguage'
    | 'GetColorPalettes'
    | 'GetColorsByColorPaletteId'
    | 'GetAllDocuments'
    | 'GetDocumentGroups'
    | 'GetDocumentPagesByDocumentId'
    | 'GetDocumentCategoriesByDocumentId'
    | 'GetUncategorizedPagesByDocumentId'
    | 'GetDocumentSectionsByDocumentPageId'
    | 'GetDocumentTargets'
    | 'GetDocumentPageTargets';
