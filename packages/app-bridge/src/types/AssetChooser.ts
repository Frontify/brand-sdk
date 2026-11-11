/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type FileExtension } from './FileExtension';

export enum AssetChooserProjectType {
    MediaLibrary = 'MediaLibrary',
    LogoLibrary = 'LogoLibrary',
    IconLibrary = 'IconLibrary',
    DocumentLibrary = 'DocumentLibrary',
    TemplateLibrary = 'TemplateLibrary',
    Styleguide = 'Styleguide',
    Workspace = 'Workspace',
}

export enum AssetChooserObjectType {
    File = 'FILE', // Audio, Zip, ...
    Canvas = 'CANVAS',
    ImageVideo = 'IMAGE', // No distinction between images and videos in the screen table
    TextSnippet = 'TEXT_SNIPPET',
    Url = 'URL',
}

export type AssetChooserOptions = {
    projectTypes?: AssetChooserProjectType[];
    objectTypes?: AssetChooserObjectType[];
    multiSelection?: boolean;
    extensions?: (FileExtension | string)[];
    urlContains?: string;
} & (
    | {
          selectedValueId?: number | string;
      }
    | {
          selectedValueIds?: (number | string)[];
      }
);
