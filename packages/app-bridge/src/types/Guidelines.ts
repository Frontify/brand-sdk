/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type LinkSettingsDisplay, type LinkSettingsIconPosition } from './Document.ts';

export interface GuidelinesCoverPage {
    id(): number;
    title(language?: string): string;
    isPublished(): boolean;
    isHiddenInNavigation(): boolean;
    url(language?: string): string;
    type: 'cover-page';
}

export interface GuidelinesDocumentGroup {
    id(): number;
    title(language?: string): string;
    children(): (GuidelinesDocument | GuidelinesDocumentLibrary | GuidelinesDocumentLink)[];
    type: 'document-group';
}

export interface GuidelinesDocument {
    id(): number;
    title(language?: string): string;
    slug(language?: string): string;
    url(language?: string): string;
    parentId(): Nullable<number>;
    type: 'document';
}

export interface GuidelinesDocumentLibrary {
    id(): number;
    title(language?: string): string;
    slug(language?: string): string;
    url(language?: string): string;
    parentId(): Nullable<number>;
    type: 'document-library';
}

export interface GuidelinesDocumentLink {
    id(): number;
    title(language?: string): string;
    url(): string;
    displayMode(): LinkSettingsDisplay;
    iconPosition(): LinkSettingsIconPosition;
    customIconUrl(): Nullable<string>;
    shouldOpenInNewTab(): boolean;
    parentId(): Nullable<number>;
    type: 'document-link';
}

export interface GuidelinesPageCategory {
    id(): number;
    title(language?: string): string;
    slug(language?: string): string;
    children(): (GuidelinesDocumentPage | GuidelinesDocumentPageLink)[];
    type: 'page-category';
}

export interface GuidelinesDocumentPage {
    id(): number;
    title(language?: string): string;
    slug(language?: string): string;
    url(language?: string): string;
    headings(): GuidelinesDocumentPageHeading[];
    type: 'document-page';
}

export interface GuidelinesDocumentPageLink {
    id(): number;
    title(language?: string): string;
    url(): string;
    type: 'document-page-link';
}

export interface GuidelinesDocumentPageHeading {
    id(): number;
    title(language?: string): string;
    slug(language?: string): string;
    type: 'document-page-heading';
}
