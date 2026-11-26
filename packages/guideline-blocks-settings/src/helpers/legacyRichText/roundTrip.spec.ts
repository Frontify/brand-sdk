/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { convertLegacyRichText } from './convertLegacyRichText';
import { LEGACY_FIXTURES } from './fixtures';
import { toLegacyRichText } from './toLegacyRichText';
import { type LegacyElement, type LegacyNode, type LegacyRichTextTree, type ResolveMention } from './types';

type Random = () => number;

const SEED_COUNT = 200;
const MIN_EXACT_TREES = 60;
const UINT32_RANGE = 4_294_967_296;
const MULBERRY_INCREMENT = 0x6d_2b_79_f5;

const WORDS = ['lorem', 'ipsum', 'dolor', 'sit', 'amet'];
const MARKS = ['bold', 'italic', 'underline', 'strikethrough', 'code', 'subscript', 'superscript'];
const COLORS = [
    'rgb(255, 0, 0)',
    'rgba(0, 128, 255, 0.42)',
    'rgba(10, 20, 30, 1)',
    '#F00',
    '#00ff7f',
    '#11223380',
    '#AABBCC',
];
const ALIGNMENTS = ['left', 'center', 'right', 'justify'];
const TARGETS = ['_blank', '_self', '_new', '_top', undefined];
const BUTTON_STYLES = ['primary', 'secondary', 'tertiary', undefined];
const SAFE_URLS = ['https://example.com/a', '/relative/path', 'mailto:info@example.com', 'tel:+41445520222'];
const UNSAFE_URL = 'javascript:alert(1)';
const MENTION_CATEGORIES = ['user', 'group', 'all'];
const MENTION_IDS = ['user-1', 7, 'group-2'];
const MENTION_LABEL = 'Ada Lovelace';
const TEXT_STYLES = [
    'heading1',
    'heading2',
    'heading3',
    'heading4',
    'custom1',
    'custom2',
    'custom3',
    'imageTitle',
    'imageCaption',
];
const MAX_LIST_DEPTH = 2;
const MAX_INDENT = 3;
const MAX_BYTE = 255;
const HEX_COLOR_BYTES = 4;

const resolveEveryMention: ResolveMention = (kind, id) => ({
    status: 'resolved',
    username: `@${id}`,
    name: `Name ${kind ?? 'user'} ${id}`,
});

const createRandom = (seed: number): Random => {
    let state = seed;

    return () => {
        state = (state + MULBERRY_INCREMENT) | 0;
        let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
        mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;

        return ((mixed ^ (mixed >>> 14)) >>> 0) / UINT32_RANGE;
    };
};

const chance = (random: Random, probability: number): boolean => random() < probability;

const pick = <TItem>(random: Random, items: readonly TItem[]): TItem => items[Math.floor(random() * items.length)];

const integer = (random: Random, min: number, max: number): number => min + Math.floor(random() * (max - min + 1));

const createText = (random: Random): string => {
    const words = Array.from({ length: integer(random, 1, 3) }, () => pick(random, WORDS));
    const separator = pick(random, [' ', ' ', '\n']);

    return words.join(separator);
};

const createHexColor = (random: Random): string => {
    const bytes = Array.from({ length: HEX_COLOR_BYTES }, () => integer(random, 0, MAX_BYTE));

    return `#${bytes.map((byte) => byte.toString(16).padStart(2, '0')).join('')}`;
};

const createColor = (random: Random): string => {
    if (chance(random, 0.3)) {
        return createHexColor(random);
    }

    return pick(random, COLORS);
};

const createLeaf = (random: Random): LegacyNode => {
    const leaf: LegacyNode = { text: createText(random) };

    for (const mark of MARKS) {
        if (chance(random, 0.15)) {
            leaf[mark] = true;
        }
    }

    if (chance(random, 0.1)) {
        leaf.bold = false;
    }

    if (chance(random, 0.15)) {
        leaf.color = createColor(random);
    }

    return leaf;
};

const createLinkChildren = (random: Random): LegacyNode[] => {
    return Array.from({ length: integer(random, 1, 2) }, () => createLeaf(random));
};

const createUrl = (random: Random): string => {
    if (chance(random, 0.04)) {
        return UNSAFE_URL;
    }

    return pick(random, SAFE_URLS);
};

const createAnchor = (random: Random): LegacyElement => {
    const anchor: LegacyElement = { type: 'a', url: createUrl(random), children: createLinkChildren(random) };
    const target = pick(random, TARGETS);

    if (target !== undefined) {
        anchor.target = target;
    }

    if (chance(random, 0.2)) {
        anchor.chosenLink = { searchResult: { link: pick(random, SAFE_URLS) }, openInNewTab: chance(random, 0.5) };
    }

    return anchor;
};

const createButton = (random: Random): LegacyElement => {
    const button: LegacyElement = { type: 'button', url: createUrl(random), children: createLinkChildren(random) };
    const target = pick(random, TARGETS);
    const buttonStyle = pick(random, BUTTON_STYLES);

    if (target !== undefined) {
        button.target = target;
    }

    if (buttonStyle !== undefined) {
        button.buttonStyle = buttonStyle;
    }

    return button;
};

const createMention = (random: Random): LegacyElement => ({
    type: 'mention',
    value: MENTION_LABEL,
    category: pick(random, MENTION_CATEGORIES),
    id: pick(random, MENTION_IDS),
    children: [{ text: '' }],
});

const createInlineNode = (random: Random): LegacyNode => {
    const roll = random();

    if (roll < 0.62) {
        return createLeaf(random);
    }

    if (roll < 0.74) {
        return createAnchor(random);
    }

    if (roll < 0.86) {
        return createButton(random);
    }

    if (roll < 0.95) {
        return createMention(random);
    }

    return { text: '' };
};

const createInline = (random: Random): LegacyNode[] => {
    return Array.from({ length: integer(random, 1, 3) }, () => createInlineNode(random));
};

const createTextBlock = (random: Random, type: string): LegacyElement => {
    const block: LegacyElement = { type, children: createInline(random) };

    if (chance(random, 0.3)) {
        block.align = pick(random, ALIGNMENTS);
    }

    return block;
};

const createList = (random: Random, depth: number): LegacyElement => {
    const items: LegacyElement[] = [];

    for (let index = 0; index < integer(random, 1, 2); index++) {
        const children: LegacyNode[] = [];
        const roll = random();

        if (chance(random, 0.08)) {
            items.push({ type: 'li', children });
            continue;
        }

        if (roll < 0.2) {
            children.push(...createInline(random));
        } else {
            children.push(createTextBlock(random, 'lic'));
        }

        if (roll >= 0.5 && roll < 0.8 && depth < MAX_LIST_DEPTH) {
            children.push(createList(random, depth + 1));
        }

        items.push({ type: 'li', children });
    }

    return { type: pick(random, ['ul', 'ol']), children: items };
};

const createCheckRun = (random: Random): LegacyElement[] => {
    return Array.from({ length: integer(random, 1, 4) }, () => {
        const item: LegacyElement = { type: 'checkbox-item', children: createInline(random) };

        if (chance(random, 0.6)) {
            item.indent = integer(random, 1, MAX_INDENT);
        }

        if (chance(random, 0.4)) {
            item.checked = true;
        }

        if (chance(random, 0.2)) {
            item.align = pick(random, ALIGNMENTS);
        }

        return item;
    });
};

const createBlocks = (random: Random): LegacyElement[] => {
    const roll = random();

    if (roll < 0.04) {
        return [{ type: pick(random, ['ul', 'ol']), children: [] }];
    }

    if (roll < 0.3) {
        return [createTextBlock(random, 'p')];
    }

    if (roll < 0.45) {
        return [createTextBlock(random, pick(random, TEXT_STYLES))];
    }

    if (roll < 0.55) {
        return [createTextBlock(random, 'quote')];
    }

    if (roll < 0.8) {
        return [createList(random, 0)];
    }

    return createCheckRun(random);
};

const createTree = (random: Random): LegacyRichTextTree => {
    const tree: LegacyRichTextTree = [];

    for (let index = 0; index < integer(random, 1, 4); index++) {
        const blocks = createBlocks(random);

        if (chance(random, 0.25)) {
            blocks[blocks.length - 1].breakAfterColumn = pick(random, ['active', 'inactive']);
        }

        tree.push(...blocks);
    }

    return tree;
};

const convert = (value: string) => convertLegacyRichText(value, { resolveMention: resolveEveryMention });

const exactFixtures = LEGACY_FIXTURES.filter((fixture) => {
    return fixture.expectedOutcome === 'exact' && fixture.expectedDocument !== undefined;
});

describe('legacy rich text round trips over the fixtures', () => {
    it.each(exactFixtures)(
        'should round trip the exact fixture $id from legacy to document and back (MIG-21)',
        (fixture) => {
            const converted = convert(fixture.legacy);
            expect(converted.outcome).toBe('exact');
            if (converted.outcome !== 'exact') {
                return;
            }

            const written = toLegacyRichText(converted.document);
            expect(written.outcome).toBe('exact');
            if (written.outcome !== 'exact') {
                return;
            }

            expect(convert(JSON.stringify(written.value))).toEqual(converted);
        },
    );

    it.each(exactFixtures)('should keep the legacy normal form of the exact fixture $id stable (MIG-26)', (fixture) => {
        const converted = convert(fixture.legacy);
        if (converted.outcome !== 'exact') {
            return;
        }

        const written = toLegacyRichText(converted.document);
        if (written.outcome !== 'exact') {
            return;
        }

        const reconverted = convert(JSON.stringify(written.value));
        if (reconverted.outcome !== 'exact') {
            return;
        }

        expect(toLegacyRichText(reconverted.document)).toEqual(written);
    });
});

describe('legacy rich text round trips over a mention value', () => {
    it('should write the resolved name as the value and read it back unchanged (MIG-13)', () => {
        const resolveMention: ResolveMention = () => ({ status: 'resolved', username: '@ada', name: 'Ada' });
        const stored = JSON.stringify([
            {
                type: 'p',
                children: [
                    { type: 'mention', value: 'Old Label', category: 'user', id: 'user-1', children: [{ text: '' }] },
                ],
            },
        ]);

        const converted = convertLegacyRichText(stored, { resolveMention });
        expect(converted.outcome).toBe('exact');
        if (converted.outcome !== 'exact') {
            return;
        }

        const written = toLegacyRichText(converted.document);
        expect(written.outcome).toBe('exact');
        if (written.outcome !== 'exact') {
            return;
        }

        expect(JSON.stringify(written.value)).toContain('"value":"Ada"');
        expect(convertLegacyRichText(JSON.stringify(written.value), { resolveMention })).toEqual(converted);
    });
});

describe('legacy rich text round trips over an unresolved mention value', () => {
    it('should write the stored value of an unresolved mention back and read it again unchanged (Q6, MIG-13)', () => {
        const stored = JSON.stringify([
            {
                type: 'p',
                children: [
                    { type: 'mention', value: 'Old Label', category: 'user', id: 'user-1', children: [{ text: '' }] },
                ],
            },
        ]);

        const converted = convertLegacyRichText(stored);
        expect(converted.outcome).toBe('requires-review');
        if (converted.outcome !== 'requires-review') {
            return;
        }

        const written = toLegacyRichText(converted.document);
        expect(written.outcome).toBe('exact');
        if (written.outcome !== 'exact') {
            return;
        }

        expect(JSON.stringify(written.value)).toBe(
            '[{"type":"p","children":[{"type":"mention","value":"Old Label","category":"user","id":"user-1","children":[{"text":""}]}]}]',
        );
        expect(convertLegacyRichText(JSON.stringify(written.value))).toEqual(converted);
    });
});

describe('legacy rich text round trips over generated trees', () => {
    const seeds = Array.from({ length: SEED_COUNT }, (_, index) => index + 1);

    it.each(seeds)('should convert the tree of seed %i the same way twice (MIG-21)', (seed) => {
        const value = JSON.stringify(createTree(createRandom(seed)));

        expect(JSON.stringify(convert(value))).toBe(JSON.stringify(convert(value)));
    });

    it.each(seeds)('should write the document of seed %i to legacy and read it back unchanged (MIG-26)', (seed) => {
        const converted = convert(JSON.stringify(createTree(createRandom(seed))));
        if (converted.outcome !== 'exact') {
            return;
        }

        const written = toLegacyRichText(converted.document);
        expect(written.outcome).toBe('exact');
        if (written.outcome !== 'exact') {
            return;
        }

        const reconverted = convert(JSON.stringify(written.value));
        expect(reconverted).toEqual(converted);
        if (reconverted.outcome !== 'exact') {
            return;
        }

        expect(toLegacyRichText(reconverted.document)).toEqual(written);
    });

    it('should generate enough exact trees for the round trips to mean something (MIG-26)', () => {
        const exactCount = seeds.filter((seed) => {
            return convert(JSON.stringify(createTree(createRandom(seed)))).outcome === 'exact';
        }).length;

        expect(exactCount).toBeGreaterThanOrEqual(MIN_EXACT_TREES);
    });
});
