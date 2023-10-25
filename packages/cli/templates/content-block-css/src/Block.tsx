import type { FC } from 'react';
import { useBlockSettings } from '@frontify/app-bridge';
import type { BlockProps } from '@frontify/guideline-blocks-settings';

import './style.css';

type Settings = {
    'main-dropdown': 'content_block';
};

export const AnExampleBlock: FC<BlockProps> = ({ appBridge }) => {
    const [blockSettings] = useBlockSettings<Settings>(appBridge);

    console.log(blockSettings);

    return <span className="block-text">A custom block in violet and underlined</span>;
};
