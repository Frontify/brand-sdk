/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    type GuidelineDocument,
    type GuidelineDocumentGroup,
    type GuidelineDocumentLibrary,
    type GuidelineDocumentLink,
    LinkSettingsDisplay,
    LinkSettingsIconPosition,
    type GuidelineCoverPage,
} from '../types';
import { type NavigationTree } from '../types/NavigationTree';

class GuidelineCoverPageClass implements GuidelineCoverPage {
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

class GuidelineDocumentGroupClass implements GuidelineDocumentGroup {
    readonly type = 'document-group' as const;
    readonly #id: number;
    readonly #title: string;
    readonly #children: (GuidelineDocument | GuidelineDocumentLibrary | GuidelineDocumentLink)[] = [];

    constructor(
        id: number,
        title: string,
        children: (GuidelineDocument | GuidelineDocumentLibrary | GuidelineDocumentLink)[],
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

class GuidelineDocumentClass implements GuidelineDocument {
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

class GuidelineDocumentLibraryClass implements GuidelineDocumentLibrary {
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

class GuidelineDocumentLinkClass implements GuidelineDocumentLink {
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
        return 'http://some-external-domain.com/page';
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

class GuidelineCoverPageClassDummy {
    static with(
        id: number,
        title = 'Cover Page Name',
        published = false,
        hiddenFromNavigation = false,
    ): GuidelineCoverPageClass {
        return new GuidelineCoverPageClass(id, title, published, hiddenFromNavigation);
    }
}

class GuidelineDocumentGroupClassDummy {
    static with(
        id: number,
        title = 'guideline document group',
        children: (GuidelineDocumentClass | GuidelineDocumentLibraryClass | GuidelineDocumentLinkClass)[] = [],
    ): GuidelineDocumentGroupClass {
        return new GuidelineDocumentGroupClass(id, title, children);
    }
}

class GuidelineDocumentClassDummy {
    static with(id: number, title = 'guideline document', parentId: Nullable<number> = null): GuidelineDocumentClass {
        return new GuidelineDocumentClass(id, title, parentId);
    }
}

class GuidelineDocumentLibraryClassDummy {
    static with(
        id: number,
        title = 'guideline document library',
        parentId: Nullable<number> = null,
    ): GuidelineDocumentLibraryClass {
        return new GuidelineDocumentLibraryClass(id, title, parentId);
    }
}

class GuidelineDocumentLinkClassDummy {
    static with(
        id: number,
        title = 'guideline document library',
        parentId: Nullable<number> = null,
    ): GuidelineDocumentLinkClass {
        return new GuidelineDocumentLinkClass(id, title, parentId);
    }
}

export class NavigationTreeDummy {
    static default(): NavigationTree {
        return [
            GuidelineCoverPageClassDummy.with(5, 'the Cover Page', true, false),
            GuidelineDocumentClassDummy.with(101, 'document-101'),
            GuidelineDocumentClassDummy.with(102, 'document-102'),
            GuidelineDocumentGroupClassDummy.with(200, 'document-group-200', [
                GuidelineDocumentClassDummy.with(201, 'document-201', 200),
                GuidelineDocumentClassDummy.with(202, 'document-203', 200),
                GuidelineDocumentClassDummy.with(204, 'document-204', 200),
            ]),
            GuidelineDocumentLinkClassDummy.with(111, 'document-link-111'),
            GuidelineDocumentLibraryClassDummy.with(121, 'document-library-121'),
        ];
    }
}
