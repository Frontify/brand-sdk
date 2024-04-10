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
    readonly type: 'cover-page' = 'cover-page';
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
    readonly type: 'document-group' = 'document-group';
    readonly #id: number;
    readonly #title: string;
    readonly #children: (GuidelinesDocumentClass | GuidelinesDocumentLibraryClass | GuidelinesDocumentLinkClass)[] = [];

    constructor(
        id: number,
        title: string,
        children: (GuidelinesDocumentClass | GuidelinesDocumentLibraryClass | GuidelinesDocumentLinkClass)[],
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
    readonly type: 'document' = 'document';
    readonly #id: number;
    readonly #title: string;

    constructor(id: number, title: string) {
        this.#id = id;
        this.#title = title;
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
}

class GuidelinesDocumentLibraryClass implements GuidelinesDocumentLibrary {
    readonly type: 'document-library' = 'document-library';
    readonly #id: number;
    readonly #title: string;

    constructor(id: number, title: string) {
        this.#id = id;
        this.#title = title;
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
}

class GuidelinesDocumentLinkClass implements GuidelinesDocumentLink {
    readonly type: 'document-link' = 'document-link';
    readonly #id: number;
    readonly #title: string;
    readonly #displayMode: LinkSettingsDisplay = LinkSettingsDisplay.TextOnly;
    readonly #icoPosition: LinkSettingsIconPosition = LinkSettingsIconPosition.Left;
    readonly #openNewTab: boolean = true;

    constructor(id: number, title: string) {
        this.#id = id;
        this.#title = title;
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
    static with(id: number, title = 'guideline document'): GuidelinesDocumentClass {
        return new GuidelinesDocumentClass(id, title);
    }
}

class GuidelinesDocumentLibraryClassDummy {
    static with(id: number, title = 'guideline document library'): GuidelinesDocumentLibraryClass {
        return new GuidelinesDocumentLibraryClass(id, title);
    }
}

class GuidelinesDocumentLinkClassDummy {
    static with(id: number, title = 'guideline document library'): GuidelinesDocumentLinkClass {
        return new GuidelinesDocumentLinkClass(id, title);
    }
}

export class NavigationTreeDummy {
    static default(): NavigationTree {
        return [
            GuidelinesCoverPageClassDummy.with(5, 'the Cover Page', true, false),
            GuidelinesDocumentClassDummy.with(101, 'document-101'),
            GuidelinesDocumentClassDummy.with(102, 'document-102'),
            GuidelinesDocumentGroupClassDummy.with(200, 'document-group-200', [
                GuidelinesDocumentClassDummy.with(201, 'document-201'),
                GuidelinesDocumentClassDummy.with(202, 'document-203'),
                GuidelinesDocumentClassDummy.with(204, 'document-204'),
            ]),
            GuidelinesDocumentLinkClassDummy.with(111, 'document-link-111'),
            GuidelinesDocumentLibraryClassDummy.with(121, 'document-library-121'),
        ];
    }
}
