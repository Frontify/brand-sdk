/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { FC } from 'react';

type Settings = {
    color: 'violet' | 'blue' | 'green' | 'red';
};

const colorTailwindMap: Record<Settings['color'], string> = {
    violet: 'tw-text-[rgb(113,89,215)]',
    blue: 'tw-text-blue-600',
    green: 'tw-text-green-600',
    red: 'tw-text-red-600',
};

export const App: FC = () => {
    const context = usePlatformContext<Detail>(PlatformAppContext);

    return (
        <div>
            <p>I augment Asset {context.assetId}</p>
            <p>Im in view {context.view}</p>
        </div>
    );
};
