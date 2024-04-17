/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    type DocumentNavigationItem,
    type GuidelineDocumentPageHeading,
    type GuidelineDocumentPage,
    type GuidelineDocumentPageLink,
    type GuidelinePageCategory,
} from '../types';

class DocumentPageCategoryDummy implements GuidelinePageCategory {
    type: 'page-category';

    readonly #id: number;
    readonly #children: (GuidelineDocumentPage | GuidelineDocumentPageLink)[];

    constructor(id: number, children?: (GuidelineDocumentPage | GuidelineDocumentPageLink)[]) {
        this.type = 'page-category';
        this.#id = id;
        this.#children = children ?? [];
    }

    id(): number {
        return this.#id;
    }

    title(): string {
        return 'Dummy title';
    }

    slug(): string {
        return 'dummy slug';
    }

    children(): (GuidelineDocumentPage | GuidelineDocumentPageLink)[] {
        return this.#children;
    }
}

class DocumentPageDummy implements GuidelineDocumentPage {
    type: 'document-page';

    readonly #id;
    readonly #headings;

    constructor(id: number, headings?: GuidelineDocumentPageHeading[]) {
        this.type = 'document-page';
        this.#id = id ?? 1234;
        this.#headings = headings ?? [];
    }

    id(): number {
        return this.#id;
    }

    title(): string {
        return 'Dummy title';
    }

    slug(): string {
        return 'dummy slug';
    }

    url(): string {
        return 'dummy url';
    }

    headings(): GuidelineDocumentPageHeading[] {
        return this.#headings;
    }
}

class DocumentPageLinkDummy implements GuidelineDocumentPageLink {
    type: 'document-page-link';

    readonly #id: number;

    constructor(id: number) {
        this.type = 'document-page-link';
        this.#id = id;
    }

    id(): number {
        return this.#id;
    }

    title(): string {
        return 'Dummy title';
    }

    url(): string {
        return 'dummy url';
    }
}

class DocumentPageHeadingDummy implements GuidelineDocumentPageHeading {
    type: 'document-page-heading';

    readonly #id;

    constructor(id: number) {
        this.type = 'document-page-heading';
        this.#id = id;
    }

    id(): number {
        return this.#id;
    }

    title(): string {
        return 'Dummy title';
    }

    slug(): string {
        return 'dummy slug';
    }
}

export class DocumentNavigationTreeDummy {
    static default(): DocumentNavigationItem[] {
        return [
            new DocumentPageCategoryDummy(1, [
                new DocumentPageDummy(1, [
                    new DocumentPageHeadingDummy(1),
                    new DocumentPageHeadingDummy(2),
                    new DocumentPageHeadingDummy(3),
                ]),
                new DocumentPageLinkDummy(2),
            ]),
            new DocumentPageDummy(3),
        ];
    }

    static alternative(): DocumentNavigationItem[] {
        return [
            new DocumentPageCategoryDummy(1, [
                new DocumentPageDummy(1, [new DocumentPageHeadingDummy(2), new DocumentPageHeadingDummy(3)]),
                new DocumentPageLinkDummy(2),
            ]),
            new DocumentPageDummy(2, [new DocumentPageHeadingDummy(1)]),
            new DocumentPageLinkDummy(6),
        ];
    }
}
