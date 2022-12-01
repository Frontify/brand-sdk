import type { FC } from 'react';
import type { BlockProps } from '@frontify/guideline-blocks-settings';

import './style.css';

export const AnExampleBlock: FC<BlockProps> = ({ appBridge }) => {
    return <span className="block-text">A custom block in violet and underlined</span>;
};
