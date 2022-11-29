import type { FC } from 'react';
import { type AppBridgeBlock, useBlockSettings } from '@frontify/app-bridge';

type Settings = {
    color: 'blue' | 'green' | 'red';
};

type Props = {
    appBridge: AppBridgeBlock;
};

const colorTailwindMap: Record<Settings['color'], string> = {
    blue: 'tw-text-blue-600',
    green: 'tw-text-green-600',
    red: 'tw-text-red-600',
};

export const AnExampleBlock: FC<Props> = ({ appBridge }) => {
    const [blockSettings] = useBlockSettings<Settings>(appBridge);

    return (
        <span className={colorTailwindMap[blockSettings.color]}>
            A custom block with {blockSettings.color.toLowerCase()} text from Tailwind
        </span>
    );
};
