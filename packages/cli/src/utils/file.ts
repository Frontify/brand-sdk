/* (c) Copyright Frontify Ltd., all rights reserved. */

import { copyFileSync, mkdirSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

import globToRegExp from 'glob-to-regexp';

import FileNotFoundError from '../errors/FileNotFoundError';

export const isDirectoryEmpty = (folderPath: string): boolean => {
    try {
        return readdirSync(folderPath).length === 0;
    } catch {
        return true;
    }
};

export const copyFolder = (
    sourceFolderPath: string,
    destinationFolderPath: string,
    options?: { exclude: string[] },
) => {
    mkdirSync(destinationFolderPath, { recursive: true });
    const excludePatterns = options?.exclude.map((glob) => globToRegExp(glob));

    for (const file of readdirSync(sourceFolderPath)) {
        if (excludePatterns !== undefined && excludePatterns.some((re) => re.test(file))) {
            continue;
        }
        const srcFile = resolve(sourceFolderPath, file);
        const destFile = resolve(destinationFolderPath, file);
        copyFile(srcFile, destFile);
    }
};

export const copyFile = (sourceFilePath: string, destinationFilePath: string) => {
    const stat = statSync(sourceFilePath);
    if (stat.isDirectory()) {
        copyFolder(sourceFilePath, destinationFilePath);
    } else {
        copyFileSync(sourceFilePath, destinationFilePath);
    }
};

export const readFile = (filePath: string): string => {
    try {
        return readFileSync(filePath, 'utf-8');
    } catch {
        throw new FileNotFoundError(filePath);
    }
};

export const readFileAsBase64 = (filePath: string): string => {
    try {
        return readFileSync(filePath, 'base64');
    } catch {
        throw new FileNotFoundError(filePath);
    }
};

export const readFileLinesAsArray = (filePath: string): string[] => {
    try {
        const content = readFile(filePath);
        return content.split(/\r?\n/).filter((line) => line !== '');
    } catch {
        throw new FileNotFoundError(filePath);
    }
};
