import type { FC } from 'react';
import type { AppBridgeBlock } from '@frontify/app-bridge';

type Props = {
    appBridge: AppBridgeBlock;
};

export const AnExampleBlock: FC<Props> = ({ appBridge }) => {
    return <span>A custom block with some text</span>;
};
