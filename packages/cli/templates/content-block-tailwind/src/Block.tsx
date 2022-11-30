import type { FC } from 'react';
import { useBlockSettings } from '@frontify/app-bridge';
import type { BlockProps } from '@frontify/guideline-blocks-settings';

type Settings = {
    color: 'blue' | 'green' | 'red';
};

const colorTailwindMap: Record<Settings['color'], string> = {
    blue: 'tw-text-blue-600',
    green: 'tw-text-green-600',
    red: 'tw-text-red-600',
};

export const AnExampleBlock: FC<BlockProps> = ({ appBridge }) => {
    const [blockSettings] = useBlockSettings<Settings>(appBridge);

    return (
        <span className={colorTailwindMap[blockSettings.color]}>
            A custom block with {blockSettings.color.toLowerCase()} text from Tailwind
        </span>
    );
};
