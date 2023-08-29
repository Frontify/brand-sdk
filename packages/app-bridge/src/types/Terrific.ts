/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { AssetApi } from './Asset';
import type { FileExtension } from './FileExtension';
import type { TemplateApiLegacy } from './TemplateLegacy';
import type { Template } from './Template';

export enum TerrificEvent {
    OpenModal = 'onOpenModal',
    CloseModal = 'onCloseModal',
}

export type TerrificComponent = {
    component: {
        onAssetChooserAssetChosen: AssetChooserAssetChosenCallback;
        onTemplateChooserTemplateChosen: TemplateChooserTemplateChosenCallback;
    };
};

export type AssetChooserResult = Omit<AssetApi, 'project_id' | 'file_size'> & { project: number; filesize: number };
export type TemplateChooserResult = TemplateApiLegacy;

export type AssetChooserAssetChosenCallback = (selectedAsset: { screenData: AssetChooserResult[] }) => void;
export type TemplateChooserTemplateChosenCallback = (selectedTemplate: { template: TemplateChooserResult }) => void;
export type OpenNewPublicationPayload = {
    template: Template;
};

export enum AssetChooserProjectType {
    MediaLibrary = 'MediaLibrary',
    LogoLibrary = 'LogoLibrary',
    IconLibrary = 'IconLibrary',
    DocumentLibrary = 'DocumentLibrary',
    TemplateLibrary = 'TemplateLibrary',
    PatternLibrary = 'PatternLibrary',
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
