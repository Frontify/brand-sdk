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

interface DocumentGroupBase {
    id(): number;
    title(language?: string): string;
    children(): (Document | DocumentLibrary | DocumentLinkNavigationItem)[];
    type: 'document-group';
}
export interface DocumentGroupNavigationItem extends DocumentGroupBase {}

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

interface DocumentLinkBase {
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
export interface DocumentLinkNavigationItem extends DocumentLinkBase {}

interface PageCategoryBase {
    id(): number;
    title(language?: string): string;
    slug(language?: string): string;
    children(): (DocumentPageNavigationItem | DocumentPageHeadingNavigationItem)[];
    type: 'page-category';
}
export interface PageCategoryNavigationItem extends PageCategoryBase {}

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

interface DocumentPageLinkBase {
    id(): number;
    title(language?: string): string;
    url(): string;
    type: 'document-page-link';
}
export interface DocumentPageLinkNavigationItem extends DocumentPageLinkBase {}

interface DocumentPageHeadingBase {
    id(): number;
    title(language?: string): string;
    slug(language?: string): string;
    type: 'document-page-heading';
}
export interface DocumentPageHeadingNavigationItem extends DocumentPageHeadingBase {}

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
