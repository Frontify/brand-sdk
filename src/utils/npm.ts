/* (c) Copyright Frontify Ltd., all rights reserved. */

import { resolve } from 'node:path';
import { reactiveJson } from './reactiveJson';

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
