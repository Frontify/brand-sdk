/* (c) Copyright Frontify Ltd., all rights reserved. */

import { resolve } from 'node:path';

import { isDirectoryEmpty } from './file.js';
import { reactiveJson } from './reactiveJson.js';

type PackageJson = {
    name: string;
    version: string;
    main: string;
};

export const updatePackageJsonProjectName = (folderPath: string): void => {
    const packageJsonPath = resolve(folderPath, 'package.json');
    const packageJson = reactiveJson<PackageJson>(packageJsonPath);
    packageJson.name = folderPath;
};

export const isValidName = (folderName: string): true | string => {
    if (!folderName) {
        return 'The content block name can not be empty.';
    } else if (!/^[_a-z-]+$/.test(folderName)) {
        return 'The project name needs to be "a-z" separated by "-" or "_".';
    } else if (!isDirectoryEmpty(folderName)) {
        return `The directory ./${folderName} already exist.`;
    } else {
        return true;
    }
};
