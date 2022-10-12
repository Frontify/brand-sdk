/* (c) Copyright Frontify Ltd., all rights reserved. */

import pc from 'picocolors';
import { Logger, cloneTo, deleteDirectory, isDirectoryEmpty, updatePackageJsonProjectName } from '../utils';

const CONTENT_BLOCK_BOILERPLATE_GIT_URL = 'https://github.com/Frontify/marketplace-content-block-boilerplate.git';

const isValidContentBlockName = (folderName: string): boolean => {
    if (!folderName) {
        Logger.error('The content block name can not be empty.');
        return false;
    } else if (!/^[_a-z-]+$/.test(folderName)) {
        Logger.error('The project name needs to be "a-z" separated by "-" or "_".');
        return false;
    } else if (!isDirectoryEmpty(folderName)) {
        Logger.error(`The directory ./${folderName} already exist.`);
        return false;
    } else {
        return true;
    }
};

export const createNewContentBlock = async (contentBlockName: string): Promise<void> => {
    if (isValidContentBlockName(contentBlockName)) {
        Logger.info('Creating the content block...');

        Logger.info(`Cloning content block boilerplate to ${pc.blue(`./${contentBlockName}`)}.`);
        await cloneTo(CONTENT_BLOCK_BOILERPLATE_GIT_URL, contentBlockName);

        deleteDirectory(`./${contentBlockName}/.git`);

        updatePackageJsonProjectName(contentBlockName);

        Logger.info('Project ready!');

        Logger.defaultInfo(`\n${Logger.spacer(11)}You can now access the project and install dependencies.`);
        Logger.defaultInfo(`${Logger.spacer(4)}cd ${pc.blue(`./${contentBlockName}`)}`);
        Logger.defaultInfo(`${Logger.spacer(4)}npm ci`);
        Logger.defaultInfo(`${Logger.spacer(4)}npm run serve`);

        Logger.defaultInfo(`\n${Logger.spacer(11)}Happy hacking!`);
    }
};
