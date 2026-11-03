/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Asset } from '../../types';

export type CreateAssetsProgress = {
    /** Bytes uploaded so far, across all files. */
    loaded: number;
    /** Size in bytes of all files. */
    total: number;
};

export type CreateAssetsFileProgress = {
    file: File;
    /** Position of the file in `files`. */
    index: number;
    /** Bytes of this file uploaded so far. */
    loaded: number;
    /** Size in bytes of this file. */
    total: number;
};

export type CreateAssetsFileSuccess = {
    file: File;
    /** Position of the file in `files`. */
    index: number;
    asset: Asset;
};

export type CreateAssetsFileFailure = {
    file: File;
    /** Position of the file in `files`. */
    index: number;
    /** Why the file couldn't be uploaded, safe to show to the user. */
    message: string;
};

export type CreateAssetsPayload = {
    /** The files to upload. Each one becomes an asset in the current project. */
    files: File[];
    /** Cancels the files that haven't finished uploading. The call then rejects with an `AbortError`. */
    signal?: AbortSignal;
    /** Called while the files upload. */
    onProgress?: (progress: CreateAssetsProgress) => void;
    /** Called while a single file uploads. */
    onFileProgress?: (progress: CreateAssetsFileProgress) => void;
    /** Called as soon as the asset for a file is created. */
    onFileDone?: (result: CreateAssetsFileSuccess) => void;
    /** Called when a file can't be uploaded. The other files keep uploading. */
    onFileFail?: (failure: CreateAssetsFileFailure) => void;
};

export type CreateAssetsResponse = {
    /** The created assets, in the order of `files`. Files that failed are left out. */
    assets: Asset[];
    /** The files that couldn't be uploaded. */
    failures: CreateAssetsFileFailure[];
};

/**
 * Uploads files and creates an asset for each of them in the current project.
 *
 * The host does the upload, so blocks don't depend on its upload endpoints.
 * The call resolves once every file is either created or failed.
 *
 * @example
 * const { assets, failures } = await appBridge.api(
 *     createAssets({
 *         files: [file],
 *         onProgress: ({ loaded, total }) => setProgress(loaded / total),
 *     }),
 * );
 */
export const createAssets = (
    payload: CreateAssetsPayload,
): { name: 'createAssets'; payload: CreateAssetsPayload } => ({
    name: 'createAssets',
    payload,
});
