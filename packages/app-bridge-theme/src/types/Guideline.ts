/* (c) Copyright Frontify Ltd., all rights reserved. */

export enum LinkSettingsDisplay {
    TextAndIcon = 'ICON_TEXT',
    IconOnly = 'ICON',
    TextOnly = 'TEXT',
}

export enum LinkSettingsIconPosition {
    Right = 'RIGHT',
    Left = 'LEFT',
}

interface CoverPageBase {
    id(): number;
    title(language?: string): string;
    isPublished(): boolean;
    isHiddenInNavigation(): boolean;
    url(language?: string): string;
    type: 'cover-page';
}
export interface CoverPageNavigationItem extends CoverPageBase {}
export interface CoverPage extends CoverPageBase {}

export interface DocumentGroupNavigationItem {
    id(): number;
    title(language?: string): string;
    children(): (DocumentNavigationItem | DocumentLibraryNavigationItem | DocumentLinkNavigationItem)[];
    type: 'document-group';
}

interface DocumentBase {
    id(): number;
    title(language?: string): string;
    slug(language?: string): string;
    url(language?: string): string;
    parentId(): Nullable<number>;
    type: 'document';
}
export interface DocumentNavigationItem extends DocumentBase {}
export interface Document extends DocumentBase {}

interface DocumentLibraryBase {
    id(): number;
    title(language?: string): string;
    slug(language?: string): string;
    url(language?: string): string;
    parentId(): Nullable<number>;
    type: 'document-library';
}
export interface DocumentLibraryNavigationItem extends DocumentLibraryBase {}
export interface DocumentLibrary extends DocumentLibraryBase {}

export interface DocumentLinkNavigationItem {
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

export interface PageCategoryNavigationItem {
    id(): number;
    title(language?: string): string;
    slug(language?: string): string;
    children(): (DocumentPageNavigationItem | DocumentPageLinkNavigationItem)[];
    type: 'page-category';
}

interface DocumentPageBase {
    id(): number;
    title(language?: string): string;
    slug(language?: string): string;
    url(language?: string): string;
    type: 'document-page';
}
export interface DocumentPageNavigationItem extends DocumentPageBase {
    headings(): DocumentPageHeadingNavigationItem[];
}
export interface DocumentPage extends DocumentPageBase {}

export interface DocumentPageLinkNavigationItem {
    id(): number;
    title(language?: string): string;
    url(): string;
    type: 'document-page-link';
}

export interface DocumentPageHeadingNavigationItem {
    id(): number;
    title(language?: string): string;
    slug(language?: string): string;
    type: 'document-page-heading';
}

export interface BrandPortalLink {
    isEnabled(): boolean;
    title(language?: string): string;
    url(language?: string): string;
}

export type PortalNavigationItem =
    | CoverPageNavigationItem
    | DocumentGroupNavigationItem
    | DocumentNavigationItem
    | DocumentLibraryNavigationItem
    | DocumentLinkNavigationItem;

export type DocumentChildNavigationItem =
    | PageCategoryNavigationItem
    | DocumentPageNavigationItem
    | DocumentPageLinkNavigationItem;
