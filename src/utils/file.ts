/* (c) Copyright Frontify Ltd., all rights reserved. */

import { readFileSync, readdirSync, rmSync } from 'fs';
import FileNotFoundError from '../errors/FileNotFoundError';

export const isDirectoryEmpty = (folderPath: string): boolean => {
    try {
        return readdirSync(folderPath).length === 0;
    } catch {
        return true;
    }
};

export const deleteDirectory = (folderPath: string): boolean => {
    try {
        rmSync(folderPath, { recursive: true });
        return true;
    } catch {
        return false;
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
