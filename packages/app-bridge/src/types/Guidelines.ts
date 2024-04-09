/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type LinkSettingsDisplay, type LinkSettingsIconPosition } from './Document.ts';

export interface GuidelinesCoverPage {
    id(): number;
    title(language?: string): string;
    isPublished(): boolean;
    isHiddenInNavigation(): boolean;
    url(language?: string): string;
}

export interface GuidelinesDocumentGroup {
    id(): number;
    title(language?: string): string;
    children(): (GuidelinesDocument | GuidelinesDocumentLibrary | GuidelinesDocumentLink)[];
}

export interface GuidelinesDocument {
    id(): number;
    title(language?: string): string;
    slug(language?: string): string;
    url(language?: string): string;
}

export interface GuidelinesDocumentLibrary {
    id(): number;
    title(language?: string): string;
    slug(language?: string): string;
    url(language?: string): string;
}

export interface GuidelinesDocumentLink {
    id(): number;
    title(language?: string): string;
    url(): string;
    displayMode(): LinkSettingsDisplay;
    iconPosition(): LinkSettingsIconPosition;
    customIconUrl(): Nullable<string>;
    shouldOpenInNewTab(): boolean;
}

export interface GuidelinesPageCategory {
    id(): number;
    title(language?: string): string;
    slug(language?: string): string;
    children(): (GuidelinesDocumentPage | GuidelinesDocumentPageLink)[];
}

export interface GuidelinesDocumentPage {
    id(): number;
    title(language?: string): string;
    slug(language?: string): string;
    url(language?: string): string;
    headings(): GuidelinesDocumentPageHeading[];
}

export interface GuidelinesDocumentPageLink {
    id(): number;
    title(language?: string): string;
    url(): string;
}

export interface GuidelinesDocumentPageHeading {
    id(): number;
    title(language?: string): string;
    slug(language?: string): string;
}
