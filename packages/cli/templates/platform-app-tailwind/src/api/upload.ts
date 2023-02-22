/* (c) Copyright Frontify Ltd., all rights reserved. */

import { OpenAiImage } from '../type/Project';

export const Frontify = {
    uploadToLibrary: async (
        directory: string[],
        uploadAssets: OpenAiImage[],
        libraryId: string,
        onSuccess: (assetIds: string[]) => void,
        setProgress: (progress: number) => void,
        onError: (error: any) => void,
        token?: any
    ) => {
        const CHUNK_SIZE = 100 * 1024 * 1024;
        const assetIds = [];

        try {
            for (const [index, asset] of uploadAssets.entries()) {
                // Fetch the asset
                const uploadAssetResponse = await fetch(asset.b64_json);
                // get it as blob
                const dataAssetBlob = await uploadAssetResponse.blob();
                // create the input Body

                setProgress(100 / (uploadAssets.length / (index / 3 + 1)));
                const uploadVariables = {
                    input: {
                        filename: `${index}open_ai_image.png`,
                        chunkSize: CHUNK_SIZE,
                        size: dataAssetBlob.size,
                    },
                };

                const uploadBody = {
                    query: uploadFileFrontify,
                    variables: uploadVariables,
                };
                const response = await frontifyFetch(token, uploadBody);
                const uploadFileResponse = await response.json();

                // upload urls
                for (const url of uploadFileResponse.data.uploadFile.urls) {
                    await fetch(url, {
                        method: 'PUT',
                        headers: {
                            'content-type': 'binary',
                        },
                        body: dataAssetBlob,
                    });
                }
                setProgress(100 / (uploadAssets.length / (index / 2 + 1)));

                const createAssetVariable = {
                    input: {
                        projectId: libraryId,
                        fileId: uploadFileResponse.data.uploadFile.id,
                        title: 'open Ai Image',
                        externalId: '',
                        directory,
                    },
                };

                const assetBody = {
                    query: createAssetFrontify,
                    variables: createAssetVariable,
                };

                setProgress(100 / (uploadAssets.length / (index + 1)));
                const assetResponse = await frontifyFetch(token, assetBody);
                const assetJsonResponse = await assetResponse.json();
                assetIds.push(assetJsonResponse.data.createAsset.job.assetId);
            }
            onSuccess(assetIds);
        } catch (error) {
            const errorMessage = error ? error : 'An Error occured while fetching the asset.';
            onError({ status: 'error', message: errorMessage });
        }
    },
};

const frontifyFetch = async (token?: any, body?: object) => {
    if (token?.bearerToken?.domain) {
        return await fetch(`https://${token.bearerToken.domain}/graphql`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token.bearerToken.accessToken}`,
            },
            body: JSON.stringify(body),
        });
    } else {
        throw 'Resource Token is not set';
    }
};

export const uploadFileFrontify = `
    mutation UploadFile($input: UploadFileInput!) {
      uploadFile(input: $input) {
        id
        urls
      }
    }
`;

export const createAssetFrontify = `
    mutation CreateAsset($input: CreateAssetInput!) {
      createAsset(input: $input) {
        job {
          assetId
        }
      }
    }
`;
