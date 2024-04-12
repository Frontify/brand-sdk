/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    type GuidelinesDocument,
    type GuidelinesDocumentGroup,
    type GuidelinesDocumentLibrary,
    type GuidelinesDocumentLink,
    LinkSettingsDisplay,
    LinkSettingsIconPosition,
    type GuidelinesCoverPage,
} from '../types';
import { type NavigationTree } from '../types/NavigationTree';

class GuidelinesCoverPageClass implements GuidelinesCoverPage {
    readonly type = 'cover-page' as const;
    readonly #id: number;
    readonly #title: string;
    readonly #isPublished: boolean = false;
    readonly #isHiddenFromNavigation: boolean = false;

    constructor(id: number, title: string, published: boolean, hiddenFromNavigation: boolean) {
        this.#id = id;
        this.#title = title;
        this.#isPublished = published;
        this.#isHiddenFromNavigation = hiddenFromNavigation;
    }

    id() {
        return this.#id;
    }
    title(language?: string) {
        return `${this.#title} - ${language ?? 'default'}`;
    }
    isPublished() {
        return this.#isPublished ?? false;
    }
    isHiddenInNavigation() {
        return this.#isHiddenFromNavigation ?? false;
    }
    url(language?: string) {
        return `http://domain.com/hub/${language ?? 'default'}/${this.#id}`;
    }
}

class GuidelinesDocumentGroupClass implements GuidelinesDocumentGroup {
    readonly type = 'document-group' as const;
    readonly #id: number;
    readonly #title: string;
    readonly #children: (GuidelinesDocument | GuidelinesDocumentLibrary | GuidelinesDocumentLink)[] = [];

    constructor(
        id: number,
        title: string,
        children: (GuidelinesDocument | GuidelinesDocumentLibrary | GuidelinesDocumentLink)[],
    ) {
        this.#id = id;
        this.#title = title;
        this.#children = children;
    }

    id() {
        return this.#id;
    }
    title(language?: string) {
        return `${this.#title} - ${language ?? 'default'}`;
    }
    children() {
        return this.#children ?? [];
    }
}

class GuidelinesDocumentClass implements GuidelinesDocument {
    readonly type = 'document' as const;
    readonly #id: number;
    readonly #title: string;
    readonly #parent: Nullable<number>;

    constructor(id: number, title: string, parent: Nullable<number> = null) {
        this.#id = id;
        this.#title = title;
        this.#parent = parent;
    }

    id() {
        return this.#id;
    }
    title(language?: string) {
        return `${this.#title} - ${language ?? 'default'}`;
    }
    slug(language?: string) {
        return `${this.#title.toLowerCase().replace(' ', '-')}-${language ?? 'default'}`;
    }
    url(language?: string) {
        return `http://domain.com/document/${this.#id}/${language ?? 'default'}/`;
    }
    parentId() {
        return this.#parent;
    }
}

class GuidelinesDocumentLibraryClass implements GuidelinesDocumentLibrary {
    readonly type = 'document-library' as const;
    readonly #id: number;
    readonly #title: string;
    readonly #parent: Nullable<number>;

    constructor(id: number, title: string, parent: Nullable<number> = null) {
        this.#id = id;
        this.#title = title;
        this.#parent = parent;
    }

    id() {
        return this.#id;
    }
    title(language?: string) {
        return `${this.#title} - ${language ?? 'default'}`;
    }
    slug(language?: string) {
        return `${this.#title.toLowerCase().replace(' ', '-')}-${language ?? 'default'}`;
    }
    url(language?: string) {
        return `http://domain.com/document/${this.#id}/${language ?? 'default'}/`;
    }
    parentId() {
        return this.#parent;
    }
}

class GuidelinesDocumentLinkClass implements GuidelinesDocumentLink {
    readonly type = 'document-link' as const;
    readonly #id: number;
    readonly #title: string;
    readonly #displayMode: LinkSettingsDisplay = LinkSettingsDisplay.TextOnly;
    readonly #icoPosition: LinkSettingsIconPosition = LinkSettingsIconPosition.Left;
    readonly #openNewTab: boolean = true;
    readonly #parent: Nullable<number>;

    constructor(id: number, title: string, parent: Nullable<number> = null) {
        this.#id = id;
        this.#title = title;
        this.#parent = parent;
    }

    id() {
        return this.#id;
    }
    title(language?: string) {
        return `${this.#title} - ${language ?? 'default'}`;
    }
    url() {
        return `http://some-external-domain.com/page`;
    }

    displayMode() {
        return this.#displayMode;
    }
    iconPosition() {
        return this.#icoPosition;
    }
    customIconUrl() {
        return null;
    }
    shouldOpenInNewTab() {
        return this.#openNewTab;
    }
    parentId() {
        return this.#parent;
    }
}

class GuidelinesCoverPageClassDummy {
    static with(
        id: number,
        title = 'Cover Page Name',
        published = false,
        hiddenFromNavigation = false,
    ): GuidelinesCoverPageClass {
        return new GuidelinesCoverPageClass(id, title, published, hiddenFromNavigation);
    }
}

class GuidelinesDocumentGroupClassDummy {
    static with(
        id: number,
        title = 'guideline document group',
        children: (GuidelinesDocumentClass | GuidelinesDocumentLibraryClass | GuidelinesDocumentLinkClass)[] = [],
    ): GuidelinesDocumentGroupClass {
        return new GuidelinesDocumentGroupClass(id, title, children);
    }
}

class GuidelinesDocumentClassDummy {
    static with(id: number, title = 'guideline document', parentId: Nullable<number> = null): GuidelinesDocumentClass {
        return new GuidelinesDocumentClass(id, title, parentId);
    }
}

class GuidelinesDocumentLibraryClassDummy {
    static with(
        id: number,
        title = 'guideline document library',
        parentId: Nullable<number> = null,
    ): GuidelinesDocumentLibraryClass {
        return new GuidelinesDocumentLibraryClass(id, title, parentId);
    }
}

class GuidelinesDocumentLinkClassDummy {
    static with(
        id: number,
        title = 'guideline document library',
        parentId: Nullable<number> = null,
    ): GuidelinesDocumentLinkClass {
        return new GuidelinesDocumentLinkClass(id, title, parentId);
    }
}

export class NavigationTreeDummy {
    static default(): NavigationTree {
        return [
            GuidelinesCoverPageClassDummy.with(5, 'the Cover Page', true, false),
            GuidelinesDocumentClassDummy.with(101, 'document-101'),
            GuidelinesDocumentClassDummy.with(102, 'document-102'),
            GuidelinesDocumentGroupClassDummy.with(200, 'document-group-200', [
                GuidelinesDocumentClassDummy.with(201, 'document-201', 200),
                GuidelinesDocumentClassDummy.with(202, 'document-203', 200),
                GuidelinesDocumentClassDummy.with(204, 'document-204', 200),
            ]),
            GuidelinesDocumentLinkClassDummy.with(111, 'document-link-111'),
            GuidelinesDocumentLibraryClassDummy.with(121, 'document-library-121'),
        ];
    }
}
