import type { FC } from 'react';
import type { BlockProps } from '@frontify/guideline-blocks-settings';

export const AnExampleBlock: FC<BlockProps> = ({ appBridge }) => {
    return <span>A custom block with some text</span>;
};
