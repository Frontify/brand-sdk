/* (c) Copyright Frontify Ltd., all rights reserved. */

import { copyFileSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path, { resolve } from 'node:path';

import globToRegExp from 'glob-to-regexp';

import FileNotFoundError from '../errors/FileNotFoundError';

const GITIGNORE_TEMPLATE = `
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.localdist
.idea
.vscode

# Editor directories and files
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
.secret.json
`;

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

    const gitignorePath = path.join(destinationFolderPath, '.gitignore');
    writeFileSync(gitignorePath, GITIGNORE_TEMPLATE);

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
