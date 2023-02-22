/* (c) Copyright Frontify Ltd., all rights reserved. */

export type ProjectAssetResponse = {
    data: {
        workspaceProject: {
            name: string;
            assets: {
                total: number;
                items: Asset[];
            };
        };
    };
};

export type Asset = {
    id: string;
    previewUrl: string;
    title: string;
};

export type OpenAiImage = {
    b64_json: string;
};
