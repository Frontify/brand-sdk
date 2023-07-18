/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Asset } from '@frontify/app-bridge';

export const downloadAsset = (asset: Asset) => {
    fetch(asset.genericUrl).then((response) => {
        response.blob().then((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = asset.fileName;
            a.click();
        });
    });
};
