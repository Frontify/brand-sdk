/* (c) Copyright Frontify Ltd., all rights reserved. */

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const FOLDER = import.meta.dirname;
const SPEC_SUFFIX = '.spec.ts';
const IMPORT_SPECIFIER_PATTERN = /\bfrom\s+'([^']+)'|\bimport\s*\(\s*'([^']+)'\s*\)|\brequire\s*\(\s*'([^']+)'\s*\)/g;
const RELATIVE_PREFIX = './';
const ALLOWED_PACKAGES = ['@frontify/fondue/rich-text-editor', '@ctrl/tinycolor'];

const readImportSpecifiers = (source: string): string[] => {
    return [...source.matchAll(IMPORT_SPECIFIER_PATTERN)].map((match) => match[1] ?? match[2] ?? match[3]);
};

const isAllowedSpecifier = (specifier: string): boolean => {
    return specifier.startsWith(RELATIVE_PREFIX) || ALLOWED_PACKAGES.includes(specifier);
};

describe('legacyRichText imports', () => {
    const sourceFiles = readdirSync(FOLDER).filter((file) => file.endsWith('.ts') && !file.endsWith(SPEC_SUFFIX));

    it('should find the converter source files (MIG-17)', () => {
        expect(sourceFiles).toContain('convertLegacyRichText.ts');
    });

    it.each(sourceFiles)('should import only relative paths and the allowed packages in %s (MIG-17)', (file) => {
        const specifiers = readImportSpecifiers(readFileSync(join(FOLDER, file), 'utf8'));

        expect(specifiers.filter((specifier) => !isAllowedSpecifier(specifier))).toEqual([]);
    });
});
