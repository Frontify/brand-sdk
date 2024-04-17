/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    type DocumentNavigationItem,
    type GuidelineDocumentPageHeading,
    type GuidelineDocumentPage,
    type GuidelineDocumentPageLink,
    type GuidelinePageCategory,
} from '../types';

class DocumentPageCategoryDummy implements GuidelinePageCategory {
    static with({
        id,
        title,
        slug,
        children,
    }: {
        id?: number;
        title?: string;
        slug?: string;
        children?: (GuidelineDocumentPage | GuidelineDocumentPageLink)[];
    }): GuidelinePageCategory {
        return new DocumentPageCategoryDummy(id ?? 1234, title ?? 'Dummy Title', slug ?? 'dummy-slug', children ?? []);
    }

    type: 'page-category';

    private constructor(
        private readonly _id: number,
        private readonly _title: string,
        private readonly _slug: string,
        private readonly _children: (GuidelineDocumentPage | GuidelineDocumentPageLink)[],
    ) {
        this.type = 'page-category';
    }

    id(): number {
        return this._id;
    }

    title(): string {
        return this._title;
    }

    slug(): string {
        return this._slug;
    }

    children(): (GuidelineDocumentPage | GuidelineDocumentPageLink)[] {
        return this._children;
    }
}

class DocumentPageDummy implements GuidelineDocumentPage {
    static with({
        id,
        title,
        slug,
        url,
        headings,
    }: {
        id?: number;
        title?: string;
        slug?: string;
        url?: string;
        headings?: GuidelineDocumentPageHeading[];
    }): GuidelineDocumentPage {
        return new DocumentPageDummy(
            id ?? 1234,
            title ?? 'Dummy Title',
            slug ?? 'dummy-slug',
            url ?? 'dummy url',
            headings ?? [],
        );
    }

    type: 'document-page';

    private constructor(
        private readonly _id: number,
        private readonly _title: string,
        private readonly _slug: string,
        private readonly _url: string,
        private readonly _headings: GuidelineDocumentPageHeading[],
    ) {
        this.type = 'document-page';
    }

    id(): number {
        return this._id;
    }

    title(): string {
        return this._title;
    }

    slug(): string {
        return this._slug;
    }

    url(): string {
        return this._url;
    }

    headings(): GuidelineDocumentPageHeading[] {
        return this._headings;
    }
}

class DocumentPageLinkDummy implements GuidelineDocumentPageLink {
    static with({ id, title, url }: { id?: number; title?: string; url?: string }): GuidelineDocumentPageLink {
        return new DocumentPageLinkDummy(id ?? 1234, title ?? 'Dummy Title', url ?? 'dummy url');
    }

    type: 'document-page-link';

    private constructor(
        private readonly _id: number,
        private readonly _title: string,
        private readonly _url: string,
    ) {
        this.type = 'document-page-link';
    }

    id(): number {
        return this._id;
    }

    title(): string {
        return this._title;
    }

    url(): string {
        return this._url;
    }
}

class DocumentPageHeadingDummy implements GuidelineDocumentPageHeading {
    static with({ id, title, slug }: { id?: number; title?: string; slug?: string }): GuidelineDocumentPageHeading {
        return new DocumentPageHeadingDummy(id ?? 1234, title ?? 'Dummy Title', slug ?? 'dummy slug');
    }

    type: 'document-page-heading';

    private constructor(
        private readonly _id: number,
        private readonly _title: string,
        private readonly _slug: string,
    ) {
        this.type = 'document-page-heading';
    }

    id(): number {
        return this._id;
    }

    title(): string {
        return this._title;
    }

    slug(): string {
        return this._slug;
    }
}

export class DocumentNavigationTreeDummy {
    static default(): DocumentNavigationItem[] {
        return [
            DocumentPageCategoryDummy.with({
                id: 1,
                children: [
                    DocumentPageDummy.with({
                        id: 1,
                        headings: [
                            DocumentPageHeadingDummy.with({ id: 1 }),
                            DocumentPageHeadingDummy.with({ id: 2 }),
                            DocumentPageHeadingDummy.with({ id: 3 }),
                        ],
                    }),
                    DocumentPageLinkDummy.with({ id: 2 }),
                ],
            }),
            DocumentPageDummy.with({ id: 2 }),
        ];
    }

    static alternative(): DocumentNavigationItem[] {
        return [
            DocumentPageCategoryDummy.with({
                id: 1,
                children: [
                    DocumentPageDummy.with({
                        id: 1,
                        headings: [DocumentPageHeadingDummy.with({ id: 2 }), DocumentPageHeadingDummy.with({ id: 3 })],
                    }),
                    DocumentPageLinkDummy.with({ id: 2 }),
                ],
            }),
            DocumentPageDummy.with({ id: 2, headings: [DocumentPageHeadingDummy.with({ id: 1 })] }),
            DocumentPageLinkDummy.with({ id: 6 }),
        ];
    }
}
