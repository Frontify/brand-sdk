/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    type Asset,
    type CreateAssetsFileFailure,
    type CreateAssetsFileProgress,
    type CreateAssetsFileSuccess,
    type CreateAssetsProgress,
} from '../../types';

export type CreateAssetsPayload = {
    files: File[];
    signal?: AbortSignal;
    onProgress?: (progress: CreateAssetsProgress) => void;
    onFileProgress?: (progress: CreateAssetsFileProgress) => void;
    onFileDone?: (result: CreateAssetsFileSuccess) => void;
    onFileFail?: (failure: CreateAssetsFileFailure) => void;
};

export type CreateAssetsResponse = {
    assets: Asset[];
    failures: CreateAssetsFileFailure[];
};

export const createAssets = (
    payload: CreateAssetsPayload,
): { name: 'createAssets'; payload: CreateAssetsPayload } => ({
    name: 'createAssets',
    payload,
});
