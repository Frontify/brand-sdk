import { useBlockSettings } from '@frontify/app-bridge';
import { type BlockProps } from '@frontify/guideline-blocks-settings';
import { type FC } from 'react';

type Settings = {
    color: 'violet' | 'blue' | 'green' | 'red';
};

const colorTailwindMap: Record<Settings['color'], string> = {
    violet: 'tw-text-[rgb(113,89,215)]',
    blue: 'tw-text-[rgb(37,99,235)]',
    green: 'tw-text-[rgb(22,163,74)]',
    red: 'tw-text-[rgb(220,38,38)]',
};

export const AnExampleBlock: FC<BlockProps> = ({ appBridge }) => {
    const [blockSettings] = useBlockSettings<Settings>(appBridge);

    return (
        <span className={`${colorTailwindMap[blockSettings.color]} tw-underline`}>
            A custom block in {blockSettings.color.toLowerCase()} and underlined
        </span>
    );
};
