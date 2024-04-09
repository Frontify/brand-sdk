/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type LinkSettingsDisplay, type LinkSettingsIconPosition } from './Document.ts';

export interface CoverPage {
    id(): number;
    title(language?: string): string;
    isPublished(): boolean;
}

export interface DocumentGroup {
    id(): number;
    title(language?: string): string;
    children(): (Document | DocumentLibrary | DocumentLink)[];
}

export interface Document {
    id(): number;
    title(language?: string): string;
    slug(language?: string): string;
    url(language?: string): string;
}

export interface DocumentLibrary {
    id(): number;
    title(language?: string): string;
    slug(language?: string): string;
    url(language?: string): string;
}

export interface DocumentLink {
    id(): number;
    title(language?: string): string;
    url(): string;
    displayMode(): LinkSettingsDisplay;
    iconPosition(): LinkSettingsIconPosition;
    customIconUrl(): Nullable<string>;
    shouldOpenInNewTab(): boolean;
}

export interface PageCategory {
    id(): number;
    title(language?: string): string;
    slug(language?: string): string;
    children(): (DocumentPage | DocumentPageLink)[];
}

export interface DocumentPage {
    id(): number;
    title(language?: string): string;
    slug(language?: string): string;
    url(language?: string): string;
    headings(): DocumentPageHeading[];
}

export interface DocumentPageLink {
    id(): number;
    title(language?: string): string;
    url(): string;
}

export interface DocumentPageHeading {
    id(): number;
    title(language?: string): string;
    slug(language?: string): string;
}
