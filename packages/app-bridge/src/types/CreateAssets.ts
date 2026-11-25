/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Asset } from './Asset';

export type CreateAssetsProgress = {
    loaded: number;
    total: number;
};

export type CreateAssetsFileProgress = {
    file: File;
    index: number;
    loaded: number;
    total: number;
};

export type CreateAssetsFileSuccess = {
    file: File;
    index: number;
    asset: Asset;
};

export type CreateAssetsFileFailure = {
    file: File;
    index: number;
    message: string;
};
