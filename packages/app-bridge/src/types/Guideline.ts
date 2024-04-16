/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type LinkSettingsDisplay, type LinkSettingsIconPosition } from './Document.ts';

export interface GuidelineCoverPage {
    id(): number;
    title(language?: string): string;
    isPublished(): boolean;
    isHiddenInNavigation(): boolean;
    url(language?: string): string;
    type: 'cover-page';
}

export interface GuidelineDocumentGroup {
    id(): number;
    title(language?: string): string;
    children(): (GuidelineDocument | GuidelineDocumentLibrary | GuidelineDocumentLink)[];
    type: 'document-group';
}

export interface GuidelineDocument {
    id(): number;
    title(language?: string): string;
    slug(language?: string): string;
    url(language?: string): string;
    parentId(): Nullable<number>;
    type: 'document';
}

export interface GuidelineDocumentLibrary {
    id(): number;
    title(language?: string): string;
    slug(language?: string): string;
    url(language?: string): string;
    parentId(): Nullable<number>;
    type: 'document-library';
}

export interface GuidelineDocumentLink {
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

export interface GuidelinePageCategory {
    id(): number;
    title(language?: string): string;
    slug(language?: string): string;
    children(): (GuidelineDocumentPage | GuidelineDocumentPageLink)[];
    type: 'page-category';
}

export interface GuidelineDocumentPage {
    id(): number;
    title(language?: string): string;
    slug(language?: string): string;
    url(language?: string): string;
    headings(): GuidelineDocumentPageHeading[];
    type: 'document-page';
}

export interface GuidelineDocumentPageLink {
    id(): number;
    title(language?: string): string;
    url(): string;
    type: 'document-page-link';
}

export interface GuidelineDocumentPageHeading {
    id(): number;
    title(language?: string): string;
    slug(language?: string): string;
    type: 'document-page-heading';
}

export type PortalNavigationItem =
    | GuidelineCoverPage
    | GuidelineDocumentGroup
    | GuidelineDocument
    | GuidelineDocumentLibrary
    | GuidelineDocumentLink;

export type PortalNavigationItemTypes = PortalNavigationItem['type'];
