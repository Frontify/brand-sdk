import { useBlockSettings } from '@frontify/app-bridge';
import { type BlockProps } from '@frontify/guideline-blocks-settings';
import { type FC } from 'react';

type Settings = {
    color: 'violet' | 'blue' | 'green' | 'red';
};

const colorTailwindMap: Record<Settings['color'], string> = {
    violet: 'tw-text-[rgb(113,89,215)]',
    blue: 'tw-text-blue-600',
    green: 'tw-text-green-600',
    red: 'tw-text-red-600',
};

export const AnExampleBlock: FC<BlockProps> = ({ appBridge }) => {
    const [blockSettings] = useBlockSettings<Settings>(appBridge);

    return (
        <span className={`${colorTailwindMap[blockSettings.color]} tw-underline`}>
            A custom block in {blockSettings.color.toLowerCase()} and underlined
        </span>
    );
};
