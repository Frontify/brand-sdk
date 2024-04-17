/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    type DocumentNavigationItem,
    type GuidelineDocumentPageHeading,
    type GuidelineDocumentPage,
    type GuidelineDocumentPageLink,
    type GuidelinePageCategory,
} from '../types';

class DocumentPageCategoryDummy implements GuidelinePageCategory {
    readonly type = 'page-category' as const;

    readonly #id: number;
    readonly #children: (GuidelineDocumentPage | GuidelineDocumentPageLink)[];

    constructor(id: number, children?: (GuidelineDocumentPage | GuidelineDocumentPageLink)[]) {
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
    readonly type = 'document-page' as const;

    readonly #id: number;
    readonly #headings: GuidelineDocumentPageHeading[];

    constructor(id: number, headings?: GuidelineDocumentPageHeading[]) {
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
    readonly type = 'document-page-link' as const;

    readonly #id: number;

    constructor(id: number) {
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
