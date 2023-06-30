/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Asset } from '@frontify/app-bridge';

export const downloadAsset = async (asset: Asset) => {
    try {
        const response = await fetch(asset.genericUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = asset.fileName;
        a.click();
    } catch {}
};
